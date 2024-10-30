import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./FactionSummary.module.scss";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import TechSummary from "./components/TechSummary/TechSummary";
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
import { manualVPUpdateAsync } from "./dynamic/api";
import { computeScoredVPs } from "./util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "./util/planets";
import { filterToOwnedTechs } from "./util/techs";
import { objectEntries, rem } from "./util/util";

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
      {options.hideTechs ? null : <TechSummary techs={ownedTechs} />}
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

  const stageOnes = {
    scored: 0,
    revealed: 0,
  };
  const stageTwos = {
    scored: 0,
    revealed: 0,
  };
  Object.values(objectives)
    .filter((obj) => obj.selected)
    .forEach((obj) => {
      if (obj.type === "STAGE ONE") {
        if (obj.scorers?.includes(factionId)) {
          stageOnes.scored++;
        }
        stageOnes.revealed++;
      } else if (obj.type === "STAGE TWO") {
        if (obj.scorers?.includes(factionId)) {
          stageTwos.scored++;
        }
        stageTwos.revealed++;
      }
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
        <div className="flexRow" style={{ gap: rem(2), height: rem(4) }}>
          {Array(stageOnes.revealed)
            .fill(0)
            .map((_, index) => {
              const scored = index < stageOnes.scored;
              return (
                <div
                  key={index}
                  style={{
                    width: rem(4),
                    height: rem(4),
                    border: "1px solid orange",
                    borderRadius: "100%",
                    backgroundColor: scored ? "orange" : undefined,
                  }}
                ></div>
              );
            })}
        </div>
        <div className="flexRow" style={{ gap: rem(2), height: rem(4) }}>
          {Array(stageTwos.revealed)
            .fill(0)
            .map((_, index) => {
              const scored = index < stageTwos.scored;
              return (
                <div
                  key={index}
                  style={{
                    width: rem(4),
                    height: rem(4),
                    border: "1px solid royalblue",
                    borderRadius: "100%",
                    backgroundColor: scored ? "royalblue" : undefined,
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

        <div className="flexRow" style={{ gap: rem(2) }}>
          {others.map((obj) => {
            if (obj.id === "Support for the Throne") {
              return (
                <React.Fragment key={obj.id}>
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
                </React.Fragment>
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
              <React.Fragment key={obj.id}>
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
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
