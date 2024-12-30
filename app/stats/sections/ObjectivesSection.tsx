import { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { CollapsibleSection } from "../../../src/components/CollapsibleSection";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import GenericModal from "../../../src/components/GenericModal/GenericModal";
import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
import { Optional } from "../../../src/util/types/types";
import { objectEntries, objectKeys, rem } from "../../../src/util/util";
import { ProcessedGame } from "../processor";
import styles from "./ObjectivesSection.module.scss";
import { ObjectiveGameCounts } from "./types";
import Chip from "../../../src/components/Chip/Chip";
import { useSharedModal } from "../../../src/data/SharedModal";

interface ObjectiveInfo {
  games: number;
  scorers: number;
  totalScorers: number;
  factionInfo: Partial<Record<FactionId, ObjectiveGameCounts>>;
  winners: number;
}

export default function ObjectivesSection({
  games,
  baseData,
}: {
  games: Record<string, ProcessedGame>;
  baseData: BaseData;
}) {
  const { openModal } = useSharedModal();
  const [tab, setTab] = useState<ObjectiveType>("STAGE ONE");

  let objectivesByScore: Partial<Record<ObjectiveId, ObjectiveInfo>> = {};
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
      <div
        className="flexRow"
        style={{
          gap: rem(4),
          position: "sticky",
          top: 0,
          backgroundColor: "var(--background-color)",
          zIndex: 1,
          width: "100%",
          justifyContent: "center",
          paddingBottom: rem(8),
        }}
      >
        <Chip
          style={{ fontSize: rem(14) }}
          selected={tab === "STAGE ONE"}
          toggleFn={() => setTab("STAGE ONE")}
        >
          Stage I
        </Chip>
        <Chip
          style={{ fontSize: rem(14) }}
          selected={tab === "STAGE TWO"}
          toggleFn={() => setTab("STAGE TWO")}
        >
          Stage II
        </Chip>
        <Chip
          style={{ fontSize: rem(14) }}
          selected={tab === "SECRET"}
          toggleFn={() => setTab("SECRET")}
        >
          Secrets
        </Chip>
        <Chip
          style={{ fontSize: rem(14) }}
          selected={tab === "OTHER"}
          toggleFn={() => setTab("OTHER")}
        >
          Other
        </Chip>
      </div>

      {orderedObjectives.map(([objId, objInfo]) => {
        return (
          <Fragment key={objId}>
            <LabeledDiv key={objId} label={objId} innerStyle={{ gap: rem(4) }}>
              <div style={{ fontFamily: "Source Sans", fontSize: rem(14) }}>
                {baseObjectives[objId].description}
              </div>
              {tab !== "SECRET" && tab !== "OTHER" ? (
                <div style={{ width: "100%" }}>
                  <FormattedMessage
                    id="J2lfJ4"
                    defaultMessage="Average Scorers per game: {number} - ({total} in {games} games)"
                    description="Statistic about the number of scorers of a public objective."
                    values={{
                      number:
                        Math.round((objInfo.scorers / objInfo.games) * 100) /
                        100,
                      total: objInfo.scorers,
                      games: objInfo.games,
                    }}
                  />
                </div>
              ) : (
                <div>
                  <FormattedMessage
                    id="Q+AbUi"
                    defaultMessage="Scored in {number}% of games - ({total} of {games})"
                    description="Statistic about the number of games a secret objective was scored in."
                    values={{
                      number:
                        Math.round((objInfo.scorers / objectiveGames) * 10000) /
                        100,
                      total: objInfo.scorers,
                      games: objectiveGames,
                    }}
                  />
                </div>
              )}
              {tab === "OTHER" ? (
                <div style={{ width: "100%" }}>
                  <FormattedMessage
                    id="OaywdC"
                    defaultMessage="Win Rate when scored: {number}% - ({total} of {games})"
                    description="Statistic about the win rate when an objective was scored."
                    values={{
                      number:
                        Math.round(
                          (objInfo.winners / objInfo.totalScorers) * 10000
                        ) / 100,
                      total: objInfo.winners,
                      games: objInfo.totalScorers,
                    }}
                  />
                </div>
              ) : null}
              <button
                style={{ fontSize: rem(10) }}
                onClick={() =>
                  openModal(
                    <ObjectiveModalContent
                      objId={objId}
                      factionGames={factionGames}
                      objInfo={objInfo}
                      baseObjectives={baseObjectives}
                    />
                  )
                }
              >
                <FormattedMessage
                  id="8NMXES"
                  defaultMessage="More Stats"
                  description="Text on a button that opens a modal with more statistics."
                />
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
    <table style={{ fontSize: rem(12), width: "100%", borderSpacing: "0" }}>
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
                  gap: rem(8),
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

function ObjectiveModalContent({
  objId,
  baseObjectives,
  factionGames,
  objInfo,
}: {
  objId: ObjectiveId;
  baseObjectives: Record<ObjectiveId, BaseObjective>;
  objInfo: ObjectiveInfo;
  factionGames: Partial<Record<FactionId, number>>;
}) {
  return (
    <div
      className="flexColumn"
      style={{
        whiteSpace: "normal",
        textShadow: "none",
        width: `clamp(80vw, ${rem(1200)}, calc(100vw - ${rem(24)}))`,
        justifyContent: "flex-start",
        height: `calc(100dvh - ${rem(24)})`,
      }}
    >
      <div
        className="flexColumn centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          padding: `${rem(4)} ${rem(8)}`,
          borderRadius: rem(4),
          gap: 0,
          border: "1px solid var(--neutral-border)",
        }}
      >
        {objId}
        <div style={{ fontSize: rem(14) }}>
          {baseObjectives[objId].description}
        </div>
      </div>
      <div
        className="flexColumn largeFont"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `clamp(80vw, ${rem(1200)}, calc(100vw - ${rem(24)}))`,
          justifyContent: "flex-start",
          overflow: "auto",
          height: "fit-content",
        }}
      >
        <div className={styles.ObjectiveModal}>
          <div></div>
          <CollapsibleSection
            openedByDefault
            title={
              <FormattedMessage
                id="r2htpd"
                description="Text on a button that will randomize factions."
                defaultMessage="Factions"
              />
            }
          >
            <div
              className="flexColumn"
              style={{
                width: "100%",
                padding: `0 ${rem(4)} ${rem(4)}`,
                fontSize: rem(14),
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
  );
}
