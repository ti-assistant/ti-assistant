import { Fragment, useState } from "react";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
import { Optional } from "../../../src/util/types/types";
import { ProcessedGame } from "../processor";
import FactionModal from "./FactionModal";
import { PointsHistogram } from "./Histogram";
import { FactionSummary } from "./types";
import styles from "./FactionsSection.module.scss";
import { FormattedMessage } from "react-intl";
import { rem } from "../../../src/util/util";
import { useSharedModal } from "../../../src/data/SharedModal";

export default function FactionsSection({
  games,
  baseData,
  points,
}: {
  games: Record<string, ProcessedGame>;
  baseData: BaseData;
  points: number;
}) {
  const { openModal } = useSharedModal();

  const baseObjectives = baseData.objectives;
  const factionInfo: Partial<Record<FactionId, FactionSummary>> = {};
  Object.entries(games).forEach(([gameId, game]) => {
    const factions = game.factions;

    Object.entries(factions).forEach(([factionId, faction], index) => {
      let info = factionInfo[factionId as FactionId];
      if (!info) {
        info = {
          id: factionId as FactionId,
          name: baseData.factions[factionId as FactionId].name,
          games: { games: 0, wins: 0, points: 0, histogram: {} },
          techGames: { games: 0, wins: 0, points: 0 },
          objectiveGames: { games: 0, wins: 0, points: 0 },
          planetGames: { games: 0, wins: 0, points: 0 },
          techs: {},
          objectives: {},
          scoredSecrets: 0,
          imperialPoints: 0,
          aggressionScore: 0,
          planetsByRound: {},
          lostPlanetsByRound: {},
        };
      }
      const factionPoints = faction.points;

      if (game.isPlanetGame) {
        info.planetGames.games++;
        game.rounds.forEach((round, index) => {
          if (!info) {
            return;
          }
          const factionInfo = round.factionInfo[factionId as FactionId];
          if (!factionInfo) {
            return;
          }
          const planetsTaken = factionInfo.planetsTaken ?? {
            home: 0,
            all: 0,
            mecatol: 0,
          };
          const planetsLost = factionInfo.planetsLost ?? {
            home: 0,
            all: 0,
            mecatol: 0,
          };
          const planetsByRound = info.planetsByRound[index] ?? {
            home: 0,
            all: 0,
            mecatol: 0,
          };
          planetsByRound.all += planetsTaken.all;
          planetsByRound.home += planetsTaken.home;
          planetsByRound.mecatol += planetsTaken.mecatol;
          info.planetsByRound[index] = planetsByRound;
          const planetsLostByRound = info.lostPlanetsByRound[index] ?? {
            home: 0,
            all: 0,
            mecatol: 0,
          };
          planetsLostByRound.all += planetsLost.all;
          planetsLostByRound.home += planetsLost.home;
          planetsLostByRound.mecatol += planetsLost.mecatol;
          info.lostPlanetsByRound[index] = planetsLostByRound;
        });
      }

      if (game.isTechGame) {
        for (const techId of faction.endingTechs) {
          if (faction.startingTechs.includes(techId)) {
            continue;
          }
          let techCount = info.techs[techId] ?? {
            wins: 0,
            games: 0,
            points: 0,
          };
          techCount.games++;
          if (factionId === game.winner) {
            techCount.wins++;
          }
          techCount.points += factionPoints;
          info.techs[techId] = techCount;
        }
        info.techGames.games++;
        info.techGames.points += factionPoints;
        if (factionId === game.winner) {
          info.techGames.wins++;
        }
      }
      if (game.isObjectiveGame) {
        info.objectiveGames.games++;
        for (const [objectiveId, objective] of Object.entries(
          game.objectives
        )) {
          const baseObjective = baseObjectives[objectiveId as ObjectiveId];

          const objInfo = info.objectives[objectiveId as ObjectiveId] ?? {
            games: 0,
            scored: 0,
            wins: 0,
            points: 0,
          };
          objInfo.games++;
          if (objective.scorers.includes(factionId as FactionId)) {
            objInfo.scored = (objInfo.scored ?? 0) + 1;
            if (factionId === game.winner) {
              objInfo.wins++;
            }
            if (baseObjective.id === "Imperial Point") {
              info.imperialPoints += objective.scorers.reduce((count, val) => {
                return val === factionId ? count + 1 : count;
              }, 0);
            }
            if (baseObjective.type === "SECRET") {
              info.scoredSecrets++;
            }
          }
          info.objectives[objectiveId as ObjectiveId] = objInfo;
        }
      }

      if (factionId === game.winner) {
        info.games.wins++;
      }

      let sum = (info.games.histogram ?? {})[factionPoints] ?? 0;
      sum++;
      info.games.histogram[factionPoints] = sum;
      info.games.points += factionPoints;
      info.games.games++;
      factionInfo[factionId as FactionId] = info;
    });
  });

  function computeAggressionScore(
    planetsTaken: Record<
      number,
      { home: number; all: number; mecatol: number }
    >,
    numGames: number
  ) {
    let score = 0;
    const mecatolMultiplier = 0.5;
    const homeMultiplier = 4;
    Object.entries(planetsTaken).forEach(([index, planets]) => {
      let roundMultiplier = 0.75;
      switch (index) {
        case "0":
        case "1":
          roundMultiplier = 1.5;
          break;
        case "2":
          roundMultiplier = 1.25;
          break;
        case "3":
          roundMultiplier = 1;
          break;
        default:
          break;
      }
      score += planets.all * roundMultiplier;
      score += planets.home * homeMultiplier * roundMultiplier;
      score += planets.mecatol * mecatolMultiplier * roundMultiplier;
    });
    return Math.round((score / numGames) * 100) / 100;
  }

  function computeDefenseScore(
    planetsLost: Record<number, { home: number; all: number; mecatol: number }>,
    numGames: number
  ) {
    let score = 0;
    const mecatolMultiplier = 0.5;
    const homeMultiplier = 4;
    Object.entries(planetsLost).forEach(([index, planets]) => {
      let roundMultiplier = 0.75;
      switch (index) {
        case "0":
        case "1":
          roundMultiplier = 1.5;
          break;
        case "2":
          roundMultiplier = 1.25;
          break;
        case "3":
          roundMultiplier = 1;
          break;
        default:
          break;
      }
      score += planets.all * roundMultiplier;
      score += planets.home * homeMultiplier * roundMultiplier;
      score += planets.mecatol * mecatolMultiplier * roundMultiplier;
    });
    return (500 - Math.round((score / numGames) * 100)) / 100;
  }

  const aggressionOrder = Object.entries(factionInfo)
    .sort(([_, a], [__, b]) => {
      const aScore = computeAggressionScore(
        a.planetsByRound,
        a.planetGames.games
      );
      const bScore = computeAggressionScore(
        b.planetsByRound,
        b.planetGames.games
      );
      if (aScore === bScore) {
        return b.planetGames.games - a.planetGames.games;
      }
      return bScore - aScore;
    })
    .map(([aName, _]) => aName);
  const defenseOrder = Object.entries(factionInfo)
    .sort(([_, a], [__, b]) => {
      const aScore = computeDefenseScore(
        a.lostPlanetsByRound,
        a.planetGames.games
      );
      const bScore = computeDefenseScore(
        b.lostPlanetsByRound,
        b.planetGames.games
      );
      if (aScore === bScore) {
        return b.planetGames.games - a.planetGames.games;
      }
      return bScore - aScore;
    })
    .map(([aName, _]) => aName);

  const orderedInfo = Object.entries(factionInfo).sort(([_, a], [__, b]) => {
    const aWinRate = (1.0 * a.games.wins) / a.games.games;
    const bWinRate = (1.0 * b.games.wins) / b.games.games;
    return bWinRate - aWinRate;
  });

  return (
    <>
      <div className={styles.FactionsSection}>
        {orderedInfo.map(([id, info]) => {
          return (
            <Fragment key={id}>
              <LabeledDiv
                key={id}
                label={
                  <div className="flexRow" style={{ gap: rem(4) }}>
                    <FactionIcon factionId={id as FactionId} size={20} />
                    {id}
                    <FactionIcon factionId={id as FactionId} size={20} />
                  </div>
                }
                style={{ gap: rem(2) }}
              >
                <div className={styles.FactionSection}>
                  <div
                    className="flexRow"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      opacity: 0.3,
                      zIndex: -1,
                    }}
                  >
                    <FactionIcon factionId={id as FactionId} size={80} />
                  </div>
                  <div
                    className="flexColumn"
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: rem(2),
                      width: "100%",
                    }}
                  >
                    <div>
                      <FormattedMessage
                        id="8ntyP0"
                        defaultMessage="Win Rate"
                        description="Label for a section describing the win rate."
                      />
                      :{" "}
                      {Math.floor(
                        ((1.0 * info.games.wins) / info.games.games) * 10000
                      ) / 100}
                      % ({info.games.wins} of {info.games.games})
                    </div>
                    <div style={{ fontSize: rem(14) }}>
                      <FormattedMessage
                        id="/LAhkb"
                        defaultMessage="Aggression Ranking: {val} of {count}"
                        description="Statistic ranking how aggressive a faction is."
                        values={{
                          val:
                            aggressionOrder.findIndex((val) => val === id) + 1,
                          count: aggressionOrder.length,
                        }}
                      />{" "}
                      (
                      {computeAggressionScore(
                        info.planetsByRound,
                        info.planetGames.games
                      )}
                      )
                    </div>
                    <div style={{ fontSize: rem(14) }}>
                      <FormattedMessage
                        id="PWXbsW"
                        defaultMessage="Defense Ranking: {val} of {count}"
                        description="Statistic ranking how defensive a faction is."
                        values={{
                          val: defenseOrder.findIndex((val) => val === id) + 1,
                          count: defenseOrder.length,
                        }}
                      />{" "}
                      (
                      {computeDefenseScore(
                        info.lostPlanetsByRound,
                        info.planetGames.games
                      )}
                      )
                    </div>
                    <div style={{ fontSize: rem(14) }}>
                      <FormattedMessage
                        id="fW7Ivs"
                        defaultMessage="Average scored secrets: {number}"
                        description="Statistic for the average number of scored secrets."
                        values={{
                          number:
                            Math.round(
                              (info.scoredSecrets / info.objectiveGames.games) *
                                100
                            ) / 100,
                        }}
                      />
                    </div>
                  </div>
                  <PointsHistogram
                    histogram={info.games.histogram}
                    points={points}
                  />
                </div>
                <button
                  style={{ fontSize: rem(10), marginTop: rem(2) }}
                  onClick={() => {
                    openModal(<FactionModal baseData={baseData} info={info} />);
                  }}
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
    </>
  );
}
