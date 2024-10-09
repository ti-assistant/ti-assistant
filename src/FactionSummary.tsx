import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./FactionSummary.module.scss";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import TechIcon from "./components/TechIcon/TechIcon";
import { GameIdContext } from "./context/Context";
import {
  useActionLog,
  useAttachments,
  useFaction,
  useFactions,
  useGameState,
  useObjectives,
  usePlanets,
  useTechs,
} from "./context/dataHooks";
import {
  manualVPUpdateAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "./dynamic/api";
import { computeScoredVPs, getFactionColor } from "./util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "./util/planets";
import { filterToOwnedTechs } from "./util/techs";
import TechTree from "./components/TechTree/TechTree";
import { objectEntries, rem } from "./util/util";

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

  const numberWidth = horizontal ? rem(10.75 * 1.2) : rem(10.75);
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
                opacity: 0.25,
                width: rem(60),
                height: rem(60),
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
            gap: rem(4),
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {VPs > 0 && editable ? (
            <div
              className="arrowDown"
              onClick={() => manualVpAdjust(false)}
            ></div>
          ) : (
            <div style={{ width: rem(12) }}></div>
          )}
          <div
            className="flexRow"
            style={{ width: rem(24), lineHeight: rem(20) }}
          >
            {VPs}
          </div>
          {editable ? (
            <div className="arrowUp" onClick={() => manualVpAdjust(true)}></div>
          ) : (
            <div style={{ width: rem(12) }}></div>
          )}
        </div>
        <div
          className="centered"
          style={{ fontSize: rem(20), lineHeight: rem(20) }}
        >
          <FormattedMessage
            id="PzyYtG"
            description="Shortened version of Victory Points."
            defaultMessage="{count, plural, =0 {VPs} one {VP} other {VPs}}"
            values={{ count: VPs }}
          />
        </div>
        <ObjectiveDots factionId={factionId} />
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

function ObjectiveDots({ factionId }: { factionId: FactionId }) {
  const actionLog = useActionLog();
  const gameId = useContext(GameIdContext);
  const objectives = useObjectives();
  const factions = useFactions();

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  const revealOrder: Partial<Record<ObjectiveId, number>> = {};
  let order = 1;
  [...(actionLog ?? [])]
    .reverse()
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .forEach((logEntry) => {
      const objectiveId = (logEntry.data as RevealObjectiveData).event
        .objective;
      revealOrder[objectiveId] = order;
      ++order;
    });

  const stageOnes = Object.values(objectives)
    .filter((obj) => obj.type === "STAGE ONE" && obj.selected)
    .sort((a, b) => {
      const aRevealOrder = revealOrder[a.id];
      const bRevealOrder = revealOrder[b.id];
      if (!aRevealOrder && !bRevealOrder) {
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }
      if (!aRevealOrder) {
        return -1;
      }
      if (!bRevealOrder) {
        return 1;
      }
      if (aRevealOrder > bRevealOrder) {
        return 1;
      }
      return -1;
    });
  const stageTwos = Object.values(objectives)
    .filter((obj) => obj.type === "STAGE TWO" && obj.selected)
    .sort((a, b) => {
      const aRevealOrder = revealOrder[a.id];
      const bRevealOrder = revealOrder[b.id];
      if (!aRevealOrder && !bRevealOrder) {
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }
      if (!aRevealOrder) {
        return -1;
      }
      if (!bRevealOrder) {
        return 1;
      }
      if (aRevealOrder > bRevealOrder) {
        return 1;
      }
      return -1;
    });

  const secrets = Object.values(objectives).filter(
    (obj) => obj.type === "SECRET" && (obj.scorers ?? []).includes(factionId)
  );

  const others = Object.values(objectives).filter(
    (obj) => obj.type === "OTHER" && (obj.scorers ?? []).includes(factionId)
  );

  return (
    <div className="flexColumn" style={{ width: "100%", gap: rem(4) }}>
      <div
        className="flexRow"
        style={{
          gap: rem(2),
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div className="flexRow" style={{ gap: rem(2) }}>
          {stageOnes.map((obj) => {
            const scored = (obj.scorers ?? []).includes(factionId);
            return (
              <div
                key={obj.id}
                title={obj.name}
                style={{
                  width: rem(4),
                  height: rem(4),
                  border: "1px solid orange",
                  borderRadius: "100%",
                  backgroundColor: scored ? "orange" : undefined,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (scored) {
                    unscoreObjectiveAsync(gameId, factionId, obj.id);
                  } else {
                    scoreObjectiveAsync(gameId, factionId, obj.id);
                  }
                }}
              ></div>
            );
          })}
        </div>

        <div className="flexRow" style={{ gap: rem(2) }}>
          {secrets.map((obj) => {
            return (
              <div
                key={obj.id}
                title={obj.name}
                style={{
                  width: rem(4),
                  height: rem(4),
                  border: "1px solid red",
                  borderRadius: "100%",
                  backgroundColor: "red",
                }}
              ></div>
            );
          })}
        </div>
      </div>
      <div
        className="flexRow"
        style={{
          gap: rem(2),
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div className="flexRow" style={{ gap: rem(2) }}>
          {stageTwos.map((obj) => {
            const scored = (obj.scorers ?? []).includes(factionId);

            return (
              <div
                key={obj.id}
                title={obj.name}
                style={{
                  width: rem(4),
                  height: rem(4),
                  border: "1px solid royalblue",
                  borderRadius: "100%",
                  backgroundColor: scored ? "royalblue" : undefined,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (scored) {
                    unscoreObjectiveAsync(gameId, factionId, obj.id);
                  } else {
                    scoreObjectiveAsync(gameId, factionId, obj.id);
                  }
                }}
              ></div>
            );
          })}
        </div>

        <div className="flexRow" style={{ gap: rem(2) }}>
          {others.map((obj) => {
            if (obj.id === "Support for the Throne") {
              return (
                <>
                  {objectEntries(obj.keyedScorers ?? {}).map(
                    ([faction, scorers]) => {
                      if (!scorers.includes(factionId)) {
                        return null;
                      }
                      return (
                        <div
                          key={`${obj.id} - ${faction}`}
                          title={`${obj.name} - ${faction}`}
                          style={{
                            width: rem(4),
                            height: rem(4),
                            border: `1px solid #ccc`,
                            borderRadius: "100%",
                            backgroundColor: "#ccc",
                          }}
                        ></div>
                      );
                    }
                  )}
                </>
              );
            }

            const scorers = obj.scorers ?? [];
            const color =
              obj.id === "Mutiny" && obj.points === -1 ? "#555" : "#ccc";
            const title =
              obj.id === "Mutiny"
                ? `${obj.name} - ${obj.points === 1 ? "For" : "Against"}`
                : obj.name;
            return (
              <>
                {scorers.map((scorer, index) => {
                  if (scorer !== factionId) {
                    return null;
                  }
                  return (
                    <div
                      key={`${obj.id} - ${index}`}
                      title={title}
                      style={{
                        width: rem(4),
                        height: rem(4),
                        border: `1px solid ${color}`,
                        borderRadius: "100%",
                        backgroundColor: color,
                      }}
                    ></div>
                  );
                })}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
