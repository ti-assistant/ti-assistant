import React from "react";
import { FormattedMessage } from "react-intl";
import styles from "./FactionSummary.module.scss";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import TechSummary from "./components/TechSummary/TechSummary";
import {
  useActionLog,
  useAttachments,
  useGameId,
  useLeader,
  usePlanets,
  useTechs,
  useViewOnly,
} from "./context/dataHooks";
import { useFactionTechs } from "./context/factionDataHooks";
import { useFactionVPs } from "./context/gameDataHooks";
import { useObjectives } from "./context/objectiveDataHooks";
import { useGameState } from "./context/stateDataHooks";
import {
  manualVPUpdateAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "./dynamic/api";
import { getLogEntries } from "./util/actionLog";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "./util/planets";
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
  const VPs = useFactionVPs(factionId);
  const gameId = useGameId();
  const state = useGameState();
  const viewOnly = useViewOnly();

  function manualVpAdjust(increase: boolean) {
    if (!gameId || !factionId) {
      return;
    }
    const value = increase ? 1 : -1;
    manualVPUpdateAsync(gameId, factionId, value);
  }

  const editable = state?.phase !== "END" && !viewOnly;

  return (
    <div className={styles.FactionSummary}>
      {options.hideTechs ? null : <FactionTechSummary factionId={factionId} />}
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
        <FactionPlanetSummary factionId={factionId} />
      )}
    </div>
  );
}

function ObjectiveDots({ factionId }: { factionId: FactionId }) {
  const actionLog = useActionLog();
  const gameId = useGameId();
  const objectives = useObjectives();
  const viewOnly = useViewOnly();

  const revealOrder: Partial<Record<ObjectiveId, number>> = {};
  let order = 1;
  getLogEntries<RevealObjectiveData>(
    [...actionLog].reverse(),
    "REVEAL_OBJECTIVE"
  ).forEach((logEntry) => {
    const objectiveId = logEntry.data.event.objective;
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

  const stageIs = Object.values(objectives).filter(
    (obj) => obj.type === "STAGE ONE" && obj.selected
  );
  stageIs.sort((a, b) =>
    (revealOrder[a.id] ?? 0) > (revealOrder[b.id] ?? 0) ? 1 : -1
  );

  const stageIIs = Object.values(objectives).filter(
    (obj) => obj.type === "STAGE TWO" && obj.selected
  );
  stageIIs.sort((a, b) =>
    (revealOrder[a.id] ?? 0) > (revealOrder[b.id] ?? 0) ? 1 : -1
  );

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
          {stageIs.map((obj) => {
            const scored = obj.scorers?.includes(factionId);
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
                  cursor: viewOnly ? undefined : "pointer",
                }}
                onClick={
                  viewOnly
                    ? undefined
                    : () => {
                        if (scored) {
                          unscoreObjectiveAsync(gameId, factionId, obj.id);
                        } else {
                          scoreObjectiveAsync(gameId, factionId, obj.id);
                        }
                      }
                }
              ></div>
            );
          })}
        </div>
        <div className="flexRow" style={{ gap: rem(2), height: rem(4) }}>
          {stageIIs.map((obj) => {
            const scored = obj.scorers?.includes(factionId);
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
                  cursor: viewOnly ? undefined : "pointer",
                }}
                onClick={
                  viewOnly
                    ? undefined
                    : () => {
                        if (scored) {
                          unscoreObjectiveAsync(gameId, factionId, obj.id);
                        } else {
                          scoreObjectiveAsync(gameId, factionId, obj.id);
                        }
                      }
                }
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

function FactionPlanetSummary({ factionId }: { factionId: FactionId }) {
  const attachments = useAttachments();
  const xxekirGrom = useLeader("Xxekir Grom");
  const planets = usePlanets();

  const ownedPlanets = factionId
    ? filterToClaimedPlanets(planets, factionId)
    : [];
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const hasXxchaHero =
    factionId === "Xxcha Kingdom" && xxekirGrom?.state === "readied";

  return (
    <PlanetSummary
      factionId={factionId}
      planets={updatedPlanets}
      hasXxchaHero={hasXxchaHero}
    />
  );
}

function FactionTechSummary({ factionId }: { factionId: FactionId }) {
  const factionTechs = useFactionTechs(factionId);
  const techs = useTechs();

  return (
    <TechSummary
      factionId={factionId}
      techs={techs}
      ownedTechs={factionTechs}
    />
  );
}
