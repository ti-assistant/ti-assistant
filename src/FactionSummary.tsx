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
  horizontal,
}: {
  techs: Tech[];
  factionId: FactionId;
  horizontal?: boolean;
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

  const numberWidth = horizontal ? `${10.75 * 1.2}px` : `${10.75}px`;
  const techTreeSize = horizontal ? 6 : 4;
  const iconSize = horizontal ? 20 : 16;

  return (
    <>
      <div
        className={`${styles.TechSummaryGrid} ${
          horizontal ? styles.Horizontal : ""
        }`}
      >
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {greenTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"GREEN"} size={iconSize} />
        </div>
        <TechTree type="GREEN" factionId={factionId} size={techTreeSize} />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {blueTechs.length || "-"}
        </div>

        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"BLUE"} size={iconSize} />
        </div>
        <TechTree type="BLUE" factionId={factionId} size={techTreeSize} />
        {horizontal ? <div>&nbsp;</div> : null}
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {yellowTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"YELLOW"} size={iconSize} />
        </div>
        <TechTree type="YELLOW" factionId={factionId} size={techTreeSize} />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {redTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"RED"} size={iconSize} />
        </div>
        <TechTree type="RED" factionId={factionId} size={techTreeSize} />
        <div
          className={styles.UnitUpgradeText}
          style={{ whiteSpace: "nowrap" }}
        >
          {upgradeTechs.length || "-"}{" "}
          <FormattedMessage
            id="lGDH2d"
            description="Unit upgrade techs."
            defaultMessage="{count, plural, =0 {Upgrades} one {Upgrade} other {Upgrades}}"
            values={{ count: upgradeTechs.length }}
          />
        </div>
        <div className={styles.UnitUpgradeTree}>
          <TechTree type="UPGRADE" factionId={factionId} size={techTreeSize} />
        </div>
        <div className={styles.FactionTechTree}>
          <TechTree type="FACTION" factionId={factionId} size={techTreeSize} />
        </div>
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
