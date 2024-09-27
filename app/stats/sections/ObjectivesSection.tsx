import { Fragment, useState } from "react";
import { CollapsibleSection } from "../../../src/components/CollapsibleSection";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import GenericModal from "../../../src/components/GenericModal/GenericModal";
import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
import { Optional } from "../../../src/util/types/types";
import { objectEntries, objectKeys } from "../../../src/util/util";
import { ProcessedGame } from "../processor";
import { ObjectiveGameCounts } from "./types";
import styles from "./ObjectivesSection.module.scss";

export default function ObjectivesSection({
  games,
  baseData,
}: {
  games: Record<string, ProcessedGame>;
  baseData: BaseData;
}) {
  const [shownModal, setShownModal] = useState<Optional<ObjectiveId>>();
  const [tab, setTab] = useState<ObjectiveType>("STAGE ONE");

  let objectivesByScore: Partial<
    Record<
      ObjectiveId,
      {
        games: number;
        scorers: number;
        totalScorers: number;
        factionInfo: Partial<Record<FactionId, ObjectiveGameCounts>>;
        winners: number;
      }
    >
  > = {};
  const baseObjectives = baseData.objectives;
  const factionGames: Partial<Record<FactionId, number>> = {};
  let objectiveGames = 0;
  Object.values(games).forEach((game) => {
    if (!game.isObjectiveGame) {
      return;
    }
    objectiveGames++;
    for (const factionId of objectKeys(game.factions)) {
      let factionInfo = factionGames[factionId] ?? 0;
      factionInfo++;
      factionGames[factionId] = factionInfo;
    }
    objectEntries(game.objectives).forEach(([objId, obj]) => {
      const objInfo = objectivesByScore[objId] ?? {
        games: 0,
        scorers: 0,
        totalScorers: 0,
        factionInfo: {},
        winners: 0,
      };
      const baseObj = baseObjectives[objId];
      if (baseObj.type !== tab) {
        return;
      }
      const scorers = obj.scorers;
      for (const [factionId, gameFaction] of objectEntries(game.factions)) {
        const faction = objInfo.factionInfo[factionId] ?? {
          games: 0,
          wins: 0,
          points: 0,
          scored: 0,
        };
        faction.games++;
        if (scorers.includes(factionId)) {
          if (game.winner === factionId) {
            objInfo.winners++;
            faction.wins++;
          }
          faction.points += gameFaction.points;
          faction.scored++;
        }
        objInfo.factionInfo[factionId] = faction;
      }
      objInfo.games++;
      let numScorers = scorers.length;
      let dedupedScorers = new Set(scorers ?? []);
      objInfo.totalScorers += dedupedScorers.size;
      if (tab === "SECRET" || tab === "OTHER") {
        numScorers = Math.min(numScorers, 1);
      }
      objInfo.scorers += numScorers;
      objectivesByScore[objId] = objInfo;
    });
  });

  const orderedObjectives = objectEntries(objectivesByScore).sort((a, b) => {
    const aGames =
      tab === "SECRET" || tab === "OTHER" ? objectiveGames : a[1].games;
    const aScorePerc = a[1].scorers / aGames;
    const bGames =
      tab === "SECRET" || tab === "OTHER" ? objectiveGames : b[1].games;
    const bScorePerc = b[1].scorers / bGames;
    return bScorePerc - aScorePerc;
  });

  return (
    <div className={styles.ObjectivesSection}>
      <div className="flexRow">
        <button
          style={{ fontSize: "14px" }}
          className={tab === "STAGE ONE" ? "selected" : ""}
          onClick={() => setTab("STAGE ONE")}
        >
          Stage I
        </button>
        <button
          style={{ fontSize: "14px" }}
          className={tab === "STAGE TWO" ? "selected" : ""}
          onClick={() => setTab("STAGE TWO")}
        >
          Stage II
        </button>
        <button
          style={{ fontSize: "14px" }}
          className={tab === "SECRET" ? "selected" : ""}
          onClick={() => setTab("SECRET")}
        >
          Secrets
        </button>
        <button
          style={{ fontSize: "14px" }}
          className={tab === "OTHER" ? "selected" : ""}
          onClick={() => setTab("OTHER")}
        >
          Other
        </button>
      </div>

      {orderedObjectives.map(([objId, objInfo]) => {
        return (
          <Fragment key={objId}>
            <GenericModal
              visible={shownModal === objId}
              closeMenu={() => setShownModal(undefined)}
            >
              <div
                className="flexColumn"
                style={{
                  whiteSpace: "normal",
                  textShadow: "none",
                  width: `clamp(80vw, 1200px, calc(100vw - 24px))`,
                  justifyContent: "flex-start",
                  height: `calc(100dvh - 24px)`,
                }}
              >
                <div
                  className="flexColumn centered extraLargeFont"
                  style={{
                    backgroundColor: "#222",
                    padding: `4px 8px`,
                    borderRadius: "4px",
                    gap: 0,
                  }}
                >
                  {objId}
                  <div style={{ fontSize: "14px" }}>
                    {baseObjectives[objId].description}
                  </div>
                </div>
                <div
                  className="flexColumn largeFont"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: `clamp(80vw, 1200px, calc(100vw - 24px))`,
                    justifyContent: "flex-start",
                    overflow: "auto",
                    height: "fit-content",
                  }}
                >
                  <div className={styles.ObjectiveModal}>
                    <div></div>
                    <CollapsibleSection openedByDefault title="Factions">
                      <div
                        className="flexColumn"
                        style={{
                          width: "100%",
                          padding: `0 4px 4px`,
                          fontSize: "14px",
                        }}
                      >
                        <FactionsTable
                          factions={objInfo.factionInfo}
                          factionGames={factionGames}
                          objectiveType={baseObjectives[objId].type}
                        />
                      </div>
                    </CollapsibleSection>
                  </div>
                </div>
              </div>
            </GenericModal>
            <LabeledDiv key={objId} label={objId} style={{ gap: "4px" }}>
              <div style={{ fontFamily: "Source Sans", fontSize: "14px" }}>
                {baseObjectives[objId].description}
              </div>
              {tab !== "SECRET" && tab !== "OTHER" ? (
                <div style={{ width: "100%" }}>
                  Average Scorers per Game:{" "}
                  {Math.floor((objInfo.scorers / objInfo.games) * 100) / 100} -
                  ({objInfo.scorers} in {objInfo.games} Games)
                </div>
              ) : (
                <div>
                  Scored in{" "}
                  {Math.floor((objInfo.scorers / objectiveGames) * 10000) / 100}
                  % of games - ({objInfo.scorers} of {objectiveGames})
                </div>
              )}
              {tab === "OTHER" ? (
                <div style={{ width: "100%" }}>
                  Win % when scored:{" "}
                  {Math.round(
                    (objInfo.winners / objInfo.totalScorers) * 10000
                  ) / 100}
                  % ({objInfo.winners} of {objInfo.totalScorers})
                </div>
              ) : null}
              <button
                style={{ fontSize: "10px" }}
                onClick={() => setShownModal(objId)}
              >
                More Stats
              </button>
            </LabeledDiv>
          </Fragment>
        );
      })}
    </div>
  );
}

function FactionsTable({
  factions,
  factionGames,
  objectiveType,
}: {
  factions: Partial<Record<FactionId, ObjectiveGameCounts>>;
  factionGames: Partial<Record<FactionId, number>>;
  objectiveType: ObjectiveType;
}) {
  const orderedFactions = objectEntries(factions).sort((a, b) => {
    const aGames =
      objectiveType === "SECRET" || objectiveType === "OTHER"
        ? factionGames[a[0]] ?? 1
        : a[1].games;
    const bGames =
      objectiveType === "SECRET" || objectiveType === "OTHER"
        ? factionGames[b[0]] ?? 1
        : b[1].games;
    const aRatio = a[1].scored / aGames;
    const bRatio = b[1].scored / bGames;
    if (aRatio === bRatio) {
      return bGames - aGames;
    }
    return bRatio - aRatio;
  });
  return (
    <table style={{ fontSize: "12px", width: "100%", borderSpacing: "0" }}>
      <tbody>
        {orderedFactions.map(([factionId, info]) => {
          let games = info.games;
          if (objectiveType === "SECRET" || objectiveType === "OTHER") {
            games = factionGames[factionId] ?? 0;
          }
          return (
            <tr key={factionId} style={{ fontFamily: "Source Sans" }}>
              <td
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <FactionIcon factionId={factionId} size={18} />
                <div>{factionId}</div>
              </td>
              <td>
                {Math.floor(((1.0 * info.scored) / games) * 10000) / 100}% (
                {info.scored} of {games})
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
