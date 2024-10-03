import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./FactionSummary.module.scss";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import TechIcon from "./components/TechIcon/TechIcon";
import { GameIdContext } from "./context/Context";
import {
  useAttachments,
  useFaction,
  useGameState,
  useObjectives,
  usePlanets,
  useTechs,
} from "./context/dataHooks";
import { manualVPUpdateAsync } from "./dynamic/api";
import { computeScoredVPs } from "./util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "./util/planets";
import { filterToOwnedTechs } from "./util/techs";
import TechTree from "./components/TechTree/TechTree";

export function TechSummary({
  techs,
  factionId,
}: {
  techs: Tech[];
  factionId: FactionId;
}) {
  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of techs) {
    switch (tech.type) {
      case "RED":
        redTechs.push(tech);
        break;
      case "YELLOW":
        yellowTechs.push(tech);
        break;
      case "GREEN":
        greenTechs.push(tech);
        break;
      case "BLUE":
        blueTechs.push(tech);
        break;
      case "UPGRADE":
        upgradeTechs.push(tech);
        break;
    }
  }

  const techOrder: TechType[] = ["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"];

  techs.sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff: number = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <>
      <div className={styles.TechSummaryGrid}>
        <div className="centered">{greenTechs.length || "-"}</div>
        <TechIcon type={"GREEN"} size={16} />
        <TechTree type="GREEN" factionId={factionId} />
        <div>&nbsp;</div>
        <div className="centered">{blueTechs.length || "-"}</div>
        <TechIcon type={"BLUE"} size={16} />
        <TechTree type="BLUE" factionId={factionId} />
        <div className="centered">{yellowTechs.length || "-"}</div>
        <TechIcon type={"YELLOW"} size={16} />
        <TechTree type="YELLOW" factionId={factionId} />
        <div>&nbsp;</div>
        <div className="centered">{redTechs.length || "-"}</div>
        <TechIcon type={"RED"} size={16} />
        <TechTree type="RED" factionId={factionId} />
        <div className="centered">{upgradeTechs.length || "-"}</div>
        <div style={{ gridColumn: "2 / 8" }}>
          <FormattedMessage
            id="lGDH2d"
            description="Unit upgrade techs."
            defaultMessage="{count, plural, =0 {Upgrades} one {Upgrade} other {Upgrades}}"
            values={{ count: upgradeTechs.length }}
          />
        </div>
        <TechTree
          style={{ gridColumn: "1 / 8" }}
          type="UPGRADE"
          factionId={factionId}
        />
        <TechTree
          style={{ gridColumn: "8 / 9", gridRow: "1 / 4" }}
          type="FACTION"
          factionId={factionId}
        />
      </div>
    </>
  );
}

interface FactionSummaryProps {
  factionId: FactionId;
  options?: {
    hidePlanets?: boolean;
    hideTechs?: boolean;
    showIcon?: boolean;
  };
}

export function FactionSummary({
  factionId,
  options = {},
}: FactionSummaryProps) {
  const gameId = useContext(GameIdContext);

  const attachments = useAttachments();
  const faction = useFaction(factionId);
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const techs = useTechs();

  let ownedTechs: Tech[] = [];
  let updatedPlanets: Planet[] = [];
  let VPs = 0;
  let factionHero: LeaderState = "locked";

  if (!faction) {
    throw new Error("Faction " + factionId + " not found");
  }

  ownedTechs = filterToOwnedTechs(techs ?? {}, faction);

  const ownedPlanets = factionId
    ? filterToClaimedPlanets(planets ?? {}, factionId)
    : [];
  updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  VPs = computeScoredVPs(factionId, objectives) + (faction.vps ?? 0);

  factionHero = faction.hero;

  function manualVpAdjust(increase: boolean) {
    if (!gameId || !factionId) {
      return;
    }
    const value = increase ? 1 : -1;
    manualVPUpdateAsync(gameId, factionId, value);
  }

  const editable = state?.phase !== "END";

  return (
    <div className={styles.FactionSummary}>
      {options.hideTechs ? null : (
        <TechSummary techs={ownedTechs} factionId={factionId} />
      )}
      <div className={styles.VPGrid}>
        {options.showIcon ? (
          <div
            className="flexColumn"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
            <div
              className="flexColumn"
              style={{
                position: "absolute",
                zIndex: -1,
                opacity: 0.5,
                width: "60px",
                height: "60px",
                userSelect: "none",
              }}
            >
              <FactionIcon factionId={factionId} size="100%" />
            </div>
          </div>
        ) : null}
        <div
          className="flexRow"
          style={{
            gap: "4px",
            justifyContent: "space-between",
            fontSize: "28px",
          }}
        >
          {VPs > 0 && editable ? (
            <div
              className="arrowDown"
              onClick={() => manualVpAdjust(false)}
            ></div>
          ) : (
            <div style={{ width: "12px" }}></div>
          )}
          <div className="flexRow" style={{ width: "24px" }}>
            {VPs}
          </div>
          {editable ? (
            <div className="arrowUp" onClick={() => manualVpAdjust(true)}></div>
          ) : (
            <div style={{ width: "12px" }}></div>
          )}
        </div>
        <div className="centered" style={{ fontSize: "20px" }}>
          <FormattedMessage
            id="PzyYtG"
            description="Shortened version of Victory Points."
            defaultMessage="{count, plural, =0 {VPs} one {VP} other {VPs}}"
            values={{ count: VPs }}
          />
        </div>
      </div>
      {options.hidePlanets ? null : (
        <PlanetSummary
          planets={updatedPlanets}
          hasXxchaHero={
            factionId === "Xxcha Kingdom" && factionHero === "readied"
          }
        />
      )}
    </div>
  );
}
