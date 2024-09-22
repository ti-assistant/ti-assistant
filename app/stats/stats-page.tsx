"use client";

import {
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { getBaseObjectives } from "../../server/data/objectives";
import FactionIcon from "../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import TechIcon from "../../src/components/TechIcon/TechIcon";
import TimerDisplay from "../../src/components/TimerDisplay/TimerDisplay";
import Toggle from "../../src/components/Toggle/Toggle";
import { computeVPs } from "../../src/util/factions";
import { Optional } from "../../src/util/types/types";
import LabeledLine from "../../src/components/LabeledLine/LabeledLine";
import GenericModal from "../../src/components/GenericModal/GenericModal";
import { CollapsibleSection } from "../../src/components/CollapsibleSection";
import { buildObjectives } from "../../src/data/gameDataBuilder";

function orderFactionsByVP(
  factions: Partial<Record<FactionId, GameFaction>>,
  objectives: Partial<Record<ObjectiveId, Objective>>
) {
  const sortFunction = (a: [string, GameFaction], b: [string, GameFaction]) => {
    const aVPs = computeVPs(factions, a[0] as FactionId, objectives);
    const bVPs = computeVPs(factions, b[0] as FactionId, objectives);
    if (aVPs !== bVPs) {
      if (bVPs > aVPs) {
        return 1;
      }
      return -1;
    }
    return 0;
  };

  return Object.entries(factions).sort(sortFunction);
}

function FilterButton<T extends string | number>({
  filter,
  filters,
  setFilters,
}: {
  filter: T;
  filters: Set<T>;
  setFilters: Dispatch<SetStateAction<Set<T>>>;
}) {
  return (
    <Toggle
      selected={filters.has(filter)}
      toggleFn={(prevValue) => {
        setFilters((filters) => {
          const newSet = new Set(filters);
          if (prevValue) {
            newSet.delete(filter);
          } else {
            newSet.add(filter);
          }
          return newSet;
        });
      }}
    >
      {filter}
    </Toggle>
  );
}

function wereObjectivesRecorded(
  gameId: string,
  game: StoredGameData,
  baseData: BaseData
) {
  const foundTypes = new Set<ObjectiveType>();
  const baseObjectives = baseData.objectives;
  return Object.entries(game.objectives ?? {}).reduce(
    (isObjGame, [id, curr]) => {
      if ((curr.scorers ?? []).length !== 0) {
        const type = baseObjectives[id as ObjectiveId].type;
        foundTypes.add(type);
        switch (foundTypes.size) {
          // Consider games without stage 2, but not without any other.
          case 3:
            return !foundTypes.has("STAGE TWO");
          case 4:
            return true;
        }
      }
      return isObjGame;
    },
    false
  );
}

function CountButton<T extends string | number>({
  filter,
  filters,
  setFilters,
}: {
  filter: T;
  filters: T;
  setFilters: (value: T) => void;
}) {
  return (
    <Toggle
      selected={filters === filter}
      toggleFn={(prevValue) => {
        setFilters(filter);
      }}
    >
      {filter}
    </Toggle>
  );
}

export interface StrategyCardPick {
  card: StrategyCardId;
  faction: FactionId;
}

export interface ProcessedRound {
  cardPicks: StrategyCardPick[];
  // The number of planets taken from other players.
  planetsTaken: Partial<
    Record<
      FactionId,
      {
        all: number;
        home: number;
        mecatol: number;
      }
    >
  >;
}

export interface ProcessedLog {
  rounds: ProcessedRound[];
}

type GameFilter =
  | "BASE_GAME"
  | "PROPHECY_OF_KINGS"
  | "CODEX_ONE"
  | "CODEX_TWO"
  | "CODEX_THREE"
  | "DISCORDANT_STARS";

function applyFilters(
  games: Record<string, StoredGameData>,
  baseData: BaseData,
  filters: {
    expansions: Set<Expansion>;
    playerCount: number;
    victoryPoints: Set<number>;
  }
) {
  const filteredGames: Record<string, StoredGameData> = {};

  Object.entries(games).forEach(([id, game]) => {
    // Expansion Filter
    for (const expansion of game.options.expansions) {
      if (!filters.expansions.has(expansion)) {
        return;
      }
    }
    for (const expansion of Array.from(filters.expansions)) {
      if (expansion === "BASE" || expansion === "BASE ONLY") {
        continue;
      }
      if (!game.options.expansions.includes(expansion)) {
        return;
      }
    }

    // Player Count filter
    if (filters.playerCount !== Object.keys(game.factions).length) {
      return;
    }

    const objectives = buildObjectives(game, baseData);
    const maxVPs = Object.keys(game.factions).reduce((max, factionId) => {
      return Math.max(
        max,
        computeVPs(game.factions, factionId as FactionId, objectives)
      );
    }, 0);

    // Victory point filter
    if (
      !filters.victoryPoints.has(maxVPs) &&
      !filters.victoryPoints.has(maxVPs - 1)
    ) {
      return;
    }

    filteredGames[id] = game;
  });

  return filteredGames;
}

export default function StatsPage({
  completedGames,
  baseData,
  processedLogs,
}: {
  completedGames: Record<string, StoredGameData>;
  baseData: BaseData;
  processedLogs: Record<string, ProcessedLog>;
}) {
  const [expansions, setExpansions] = useState<Set<Expansion>>(
    new Set(["BASE", "POK", "CODEX ONE", "CODEX TWO", "CODEX THREE"])
  );

  const [playerCounts, setPlayerCounts] = useState<Set<number>>(new Set([6]));
  const [victoryPoints, setVictoryPoints] = useState<Set<number>>(
    new Set([10])
  );
  const [playerCount, setPlayerCount] = useState<number>(6);

  const [localGames, setLocalGames] = useState(
    applyFilters(completedGames, baseData, {
      expansions,
      playerCount,
      victoryPoints,
    })
  );

  useEffect(() => {
    setLocalGames(
      applyFilters(completedGames, baseData, {
        expansions,
        playerCount,
        victoryPoints,
      })
    );
  }, [completedGames, baseData, expansions, playerCount, victoryPoints]);

  // interface winGames {
  //   wins: number;
  //   games: number;
  // }

  // const winningFactions: Partial<Record<FactionId, winGames>> = {};
  // Object.entries(localGames).forEach(([id, game]) => {
  //   const factions = game.factions;
  //   const objectives = game.objectives ?? {};
  //   const sortFunction = (a: GameFaction, b: GameFaction) => {
  //     const aVPs = computeVPs(factions, a.id, objectives);
  //     const bVPs = computeVPs(factions, b.id, objectives);
  //     if (aVPs !== bVPs) {
  //       if (bVPs > aVPs) {
  //         return 1;
  //       }
  //       return -1;
  //     }
  //     return 0;
  //   };

  //   const orderedFactions = Object.values(factions).sort(sortFunction);

  //   orderedFactions.forEach((faction, index) => {
  //     let wins = winningFactions[faction.id];
  //     if (!wins) {
  //       wins = {
  //         games: 0,
  //         wins: 0,
  //       };
  //     }
  //     if (index === 0) {
  //       wins.wins++;
  //     }
  //     wins.games++;
  //     winningFactions[faction.id] = wins;
  //   });
  // const winningFaction = orderedFactions[0];
  // if (!winningFaction) {
  //   return;
  // }
  // if (!winningFactions[winningFaction.id]) {
  //   winningFactions[winningFaction.id] = 0;
  // }
  // winningFactions[winningFaction.id]++;
  // });

  const points = Array.from(victoryPoints).reduce(
    (max, curr) => Math.max(max, curr),
    0
  );

  return (
    <>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="STATS (BETA)" />
      <div
        // className="flexColumn"
        style={{
          width: "100%",
          height: "calc(100dvh - 60px)",
          marginTop: "60px",
          paddingTop: "4px",
          fontFamily: "Source Sans",
          // justifyContent: "flex-start",
          // alignItems: "flex-start",
          // overflowY: "scroll",
        }}
      >
        <div
          className="flexColumn"
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <LabeledDiv
            label="Filters"
            style={{
              position: "fixed",
              top: "64px",
              width: "calc(100dvw - 208px)",
            }}
          >
            <div className="flexRow" style={{ fontSize: "12px", gap: "4px" }}>
              Expansions:
              <FilterButton
                filters={expansions}
                filter="POK"
                setFilters={setExpansions}
              />
              <FilterButton
                filters={expansions}
                filter="CODEX ONE"
                setFilters={setExpansions}
              />
              <FilterButton
                filters={expansions}
                filter="CODEX TWO"
                setFilters={setExpansions}
              />
              <FilterButton
                filters={expansions}
                filter="CODEX THREE"
                setFilters={setExpansions}
              />
              <FilterButton
                filters={expansions}
                filter="DISCORDANT STARS"
                setFilters={setExpansions}
              />
            </div>
            <div className="flexRow" style={{ fontSize: "12px", gap: "4px" }}>
              Players:
              <CountButton
                filters={playerCount}
                filter={3}
                setFilters={setPlayerCount}
              />
              <CountButton
                filters={playerCount}
                filter={4}
                setFilters={setPlayerCount}
              />
              <CountButton
                filters={playerCount}
                filter={5}
                setFilters={setPlayerCount}
              />
              <CountButton
                filters={playerCount}
                filter={6}
                setFilters={setPlayerCount}
              />
              <CountButton
                filters={playerCount}
                filter={7}
                setFilters={setPlayerCount}
              />
              <CountButton
                filters={playerCount}
                filter={8}
                setFilters={setPlayerCount}
              />
            </div>
            <div className="flexRow" style={{ fontSize: "12px", gap: "4px" }}>
              Victory Points:
              <FilterButton
                filters={victoryPoints}
                filter={10}
                setFilters={setVictoryPoints}
              />
              <FilterButton
                filters={victoryPoints}
                filter={12}
                setFilters={setVictoryPoints}
              />
              <FilterButton
                filters={victoryPoints}
                filter={14}
                setFilters={setVictoryPoints}
              />
            </div>
          </LabeledDiv>
          <div
            className="flexRow"
            style={{
              // display: "grid",
              // gridAutoFlow: "row",
              // gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "space-evenly",
              marginTop: "120px",
            }}
          >
            <GameDataSection
              games={localGames}
              baseData={baseData}
              actionLogs={{}}
              points={points}
            />
            <div style={{ width: "500px" }}></div>
            <DetailsSection
              games={localGames}
              baseData={baseData}
              actionLogs={{}}
              processedLogs={processedLogs}
              playerCount={playerCount}
              points={points}
            />
            {/* <FactionsSection games={localGames} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

function DetailsSection({
  games,
  baseData,
  actionLogs,
  processedLogs,
  playerCount,
  points,
}: {
  games: Record<string, StoredGameData>;
  baseData: BaseData;
  actionLogs: Record<string, ActionLogEntry[]>;
  processedLogs: Record<string, ProcessedLog>;
  playerCount: number;
  points: number;
}) {
  const [tab, setTab] = useState("Factions");

  let tabContent: Optional<ReactNode>;

  switch (tab) {
    case "Strategy Cards":
      tabContent = (
        <StrategyCardSection
          games={games}
          baseData={baseData}
          processedLogs={processedLogs}
          playerCount={playerCount}
        />
      );
      break;
    case "Techs":
      tabContent = (
        <TechsSection games={games} baseData={baseData} points={points} />
      );
      break;
    case "Factions":
      tabContent = (
        <FactionsSection
          games={games}
          baseData={baseData}
          processedLogs={processedLogs}
          points={points}
        />
      );
      break;
    case "Objectives":
      tabContent = (
        <ObjectivesSection games={games} baseData={baseData} points={points} />
      );
      break;
  }

  return (
    <div className="flexColumn" style={{ paddingBottom: "8px" }}>
      <div className="flexRow">
        <button
          className={tab === "Strategy Cards" ? "selected" : ""}
          onClick={() => setTab("Strategy Cards")}
        >
          Strategy Cards
        </button>
        <button
          className={tab === "Factions" ? "selected" : ""}
          onClick={() => setTab("Factions")}
        >
          Factions
        </button>
        <button
          className={tab === "Objectives" ? "selected" : ""}
          onClick={() => setTab("Objectives")}
        >
          Objectives
        </button>
        <button
          className={tab === "Techs" ? "selected" : ""}
          onClick={() => setTab("Techs")}
        >
          Techs
        </button>
      </div>
      <div
        className="flexColumn"
        style={{
          justifyContent: "flex-start",
          padding: "4px",
          height: "calc(100dvh - 230px)",
          overflowY: "scroll",
        }}
      >
        {tabContent}
      </div>
    </div>
  );
}

interface TechInfo {
  games: number;
  wins: number;
  histogram: Histogram;
  points: number;
}

interface FactionInfo {
  wins: number;
  games: number;
  points: number;
  histogram: Histogram;
  techs: Partial<Record<TechId, TechInfo>>;
  techGames: number;
  techWins: number;
  techPoints: number;
  techPaths: TechEntry[][];
  objectives: Partial<Record<ObjectiveId, ObjectiveInfo>>;
  objectiveGames: number;
  scoredSecrets: number;
  imperialPoints: number;
  planetGames: number;
  planetsByRound: Record<
    number,
    { all: number; home: number; mecatol: number }
  >;
  aggressionScore: number;
}

interface TechEntry {
  round: number;
  tech: TechId;
}

// function getTechPath(factionId: FactionId, actionLog: ActionLogEntry[]) {
//   const techPath: TechEntry[] = [];
//   let round = 0;
//   for (const logEntry of actionLog.toReversed()) {
//     if (
//       logEntry.data.action === "ADVANCE_PHASE" &&
//       logEntry.data.event.state?.phase === "STRATEGY"
//     ) {
//       round++;
//     }
//     if (
//       logEntry.data.action === "CHOOSE_STARTING_TECH" &&
//       logEntry.data.event.faction === factionId
//     ) {
//       techPath.push({ tech: logEntry.data.event.tech, round });
//     }
//     if (
//       logEntry.data.action === "ADD_TECH" &&
//       logEntry.data.event.faction === factionId
//     ) {
//       techPath.push({ tech: logEntry.data.event.tech, round });
//     }
//     if (
//       logEntry.data.action === "REMOVE_TECH" &&
//       logEntry.data.event.faction === factionId
//     ) {
//       console.log("Removed tech", logEntry.data.event.tech);
//     }
//   }
//   return techPath;
// }

function getMostCommonTechPath(techPaths: TechEntry[][]) {
  const result: TechId[] = [];
  let endOfPaths = false;
  let index = 0;
  while (!endOfPaths) {
    endOfPaths = true;

    let noneCount = 0;
    let countPerTech: Partial<Record<TechId, number>> = {};
    for (const path of techPaths) {
      const tech = path[index];
      if (!tech) {
        noneCount++;
        continue;
      }
      endOfPaths = false;
      let techCount = countPerTech[tech.tech] ?? 0;
      techCount++;
      countPerTech[tech.tech] = techCount;
    }

    let winningCount = 0;
    let winningTech: Optional<TechId>;
    for (const [techId, count] of Object.entries(countPerTech)) {
      if (
        count > noneCount &&
        count > winningCount &&
        !result.includes(techId as TechId)
      ) {
        winningCount = count;
        winningTech = techId as TechId;
      }
    }
    if (!winningTech) {
      return result;
    }
    result.push(winningTech);
    index++;
  }
  return result;
}

interface StrategyCardInfo {
  rounds: {
    pickCount: number;
    winCount: number;
    points: number;
  }[][];
}

function StrategyCardSection({
  games,
  baseData,
  processedLogs,
  playerCount,
}: {
  games: Record<string, StoredGameData>;
  baseData: BaseData;
  processedLogs: Record<string, ProcessedLog>;
  playerCount: number;
}) {
  const strategyCardInfo: Partial<Record<StrategyCardId, StrategyCardInfo>> =
    {};
  const numRounds: Record<number, number> = {};
  Object.entries(games).forEach(([gameId, game]) => {
    const objectives = buildObjectives(game, baseData);

    const factions = orderFactionsByVP(game.factions, objectives);

    const winner = factions[0] as [FactionId, GameFaction];
    const winnerVPs = computeVPs(
      game.factions,
      winner[0] as FactionId,
      objectives
    );
    const second = factions[1] as [FactionId, GameFaction];
    const secondVPs = computeVPs(
      game.factions,
      second[0] as FactionId,
      objectives
    );

    if (winnerVPs === secondVPs) {
      console.log("Bad game", gameId);
    }
    const winnerId = (winner ?? [])[0] ?? "Vuil'raith Cabal";
    const log = processedLogs[gameId];
    if (!log) {
      return;
    }

    let roundNum = 1;
    for (const round of log.rounds) {
      let roundCount = numRounds[roundNum] ?? 0;
      roundCount++;
      let pickOrder = 1;
      for (const card of round.cardPicks) {
        if (!card.card) {
          roundCount--;
          break;
        }
        const info = strategyCardInfo[card.card] ?? { rounds: [] };
        const roundInfo = info.rounds[roundNum] ?? [];
        const pickRate = roundInfo[pickOrder] ?? {
          pickCount: 0,
          winCount: 0,
          points: 0,
        };

        const points = computeVPs(game.factions, card.faction, objectives);
        pickRate.points += points;

        pickRate.pickCount++;
        if (card.faction === winnerId) {
          pickRate.winCount++;
        }
        roundInfo[pickOrder] = pickRate;
        info.rounds[roundNum] = roundInfo;
        strategyCardInfo[card.card] = info;
        pickOrder++;
      }
      numRounds[roundNum] = roundCount;
      roundNum++;
    }
  });

  const factionIndexes: number[] = [];
  const numCards =
    playerCount === 3 || playerCount === 4 ? playerCount * 2 : playerCount;
  for (let i = 1; i <= numCards; i++) {
    factionIndexes.push(i);
  }

  const orderedCards = Object.entries(strategyCardInfo).sort(
    ([aCard, _], [bCard, __]) => {
      switch (bCard) {
        case "Leadership":
          return 1;
        case "Diplomacy":
          switch (aCard) {
            case "Leadership":
              return -1;
          }
          return 1;
        case "Politics":
          switch (aCard) {
            case "Leadership":
            case "Diplomacy":
              return -1;
          }
          return 1;
        case "Construction":
          switch (aCard) {
            case "Leadership":
            case "Diplomacy":
            case "Politics":
              return -1;
          }
          return 1;
        case "Trade":
          switch (aCard) {
            case "Leadership":
            case "Diplomacy":
            case "Politics":
            case "Construction":
              return -1;
          }
          return 1;
        case "Warfare":
          switch (aCard) {
            case "Leadership":
            case "Diplomacy":
            case "Politics":
            case "Construction":
            case "Trade":
              return -1;
          }
          return 1;
        case "Technology":
          switch (aCard) {
            case "Leadership":
            case "Diplomacy":
            case "Politics":
            case "Construction":
            case "Trade":
            case "Warfare":
              return -1;
          }
          return 1;
        case "Imperial":
          return -1;
      }
      return 0;
    }
  );

  return (
    <div className="flexColumn" style={{ width: "550px" }}>
      {orderedCards.map(([card, info]) => {
        return (
          <LabeledDiv key={card} label={card}>
            <table style={{ borderSpacing: "6px" }}>
              <thead>
                <tr>
                  <th style={{ fontWeight: "normal" }}></th>
                  {factionIndexes.map((index) => {
                    return (
                      <th key={index}>
                        {index === 1
                          ? "1st"
                          : index === 2
                          ? "2nd"
                          : index === 3
                          ? "3rd"
                          : `${index}th`}
                      </th>
                    );
                  })}
                  <th>Unpicked</th>
                  <th>Win Rate</th>
                  <th>Avg Points</th>
                </tr>
              </thead>
              {info.rounds.map((round, index) => {
                let totalRounds = numRounds[index] ?? 0;
                if (totalRounds < 5) {
                  return null;
                }
                let remainingRounds = numRounds[index] ?? 0;
                let winRounds = 0;
                let totalPoints = 0;
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: "bold" }}>Round {index}</td>
                    {factionIndexes.map((index) => {
                      const pickRate = round[index];
                      winRounds += pickRate?.winCount ?? 0;
                      remainingRounds -= pickRate?.pickCount ?? 0;
                      totalPoints += pickRate?.points ?? 0;
                      if (!pickRate) {
                        return (
                          <td
                            key={index}
                            style={{
                              textAlign: "right",
                              fontFamily: "Source Sans",
                            }}
                          >
                            0%
                          </td>
                        );
                      }
                      return (
                        <td
                          key={index}
                          style={{
                            textAlign: "right",
                            fontFamily: "Source Sans",
                          }}
                        >
                          {/* {Math.floor(
                            (pickRate.winCount / pickRate.pickCount) * 100
                          )}
                          %  */}
                          {Math.round((pickRate.pickCount / totalRounds) * 100)}
                          %
                        </td>
                      );
                    })}
                    <td
                      style={{ textAlign: "center", fontFamily: "Source Sans" }}
                    >
                      {Math.round((remainingRounds / totalRounds) * 100)}%
                    </td>
                    <td
                      style={{ textAlign: "center", fontFamily: "Source Sans" }}
                    >
                      {Math.round((winRounds / totalRounds) * 100)}%
                    </td>
                    <td
                      style={{ textAlign: "center", fontFamily: "Source Sans" }}
                    >
                      {Math.round(
                        (totalPoints / (totalRounds - remainingRounds)) * 100
                      ) / 100}
                    </td>
                  </tr>
                );
              })}
            </table>
          </LabeledDiv>
        );
      })}
    </div>
  );
}

function FactionsSection({
  games,
  baseData,
  processedLogs,
  points,
}: {
  games: Record<string, StoredGameData>;
  baseData: BaseData;
  processedLogs: Record<string, ProcessedLog>;
  points: number;
}) {
  const [shownModal, setShownModal] = useState<Optional<FactionId>>();
  const [objectiveType, setObjectiveType] =
    useState<ObjectiveType>("STAGE ONE");

  const baseObjectives = baseData.objectives;
  const factionInfo: Partial<Record<FactionId, FactionInfo>> = {};
  let techGames = 0;
  Object.entries(games).forEach(([gameId, game]) => {
    const factions = game.factions;
    const objectives = buildObjectives(game, baseData);

    const isTechGame = Object.values(factions).reduce((isTechGame, faction) => {
      for (const techId of Object.keys(faction.techs) as TechId[]) {
        if (!(faction.startswith.techs ?? []).includes(techId)) {
          return isTechGame;
        }
      }
      return false;
    }, true);

    const isObjectiveGame = wereObjectivesRecorded(gameId, game, baseData);

    const isPlanetGame = Object.keys(game.planets).length > 30;

    const orderedFactions = orderFactionsByVP(factions, objectives);

    orderedFactions.forEach(([factionId, faction], index) => {
      let info = factionInfo[factionId as FactionId];
      if (!info) {
        info = {
          games: 0,
          wins: 0,
          points: 0,
          techs: {},
          techGames: 0,
          techWins: 0,
          techPoints: 0,
          techPaths: [],
          objectives: {},
          objectiveGames: 0,
          scoredSecrets: 0,
          imperialPoints: 0,
          histogram: {},
          planetGames: 0,
          aggressionScore: 0,
          planetsByRound: {},
        };
      }
      const factionPoints = Math.min(
        points,
        computeVPs(factions, factionId as FactionId, objectives)
      );

      if (isPlanetGame) {
        const log = processedLogs[gameId];
        if (log) {
          info.planetGames++;
          log.rounds.forEach((round, index) => {
            const planetsTaken = round.planetsTaken[factionId as FactionId] ?? {
              home: 0,
              all: 0,
              mecatol: 0,
            };
            const planetsByRound = (info as FactionInfo).planetsByRound[
              index
            ] ?? {
              home: 0,
              all: 0,
              mecatol: 0,
            };
            planetsByRound.all += planetsTaken.all;
            planetsByRound.home += planetsTaken.home;
            planetsByRound.mecatol += planetsTaken.mecatol;
            (info as FactionInfo).planetsByRound[index] = planetsByRound;
          });
        }
      }

      if (isTechGame) {
        for (const techId of Object.keys(faction.techs ?? {}) as TechId[]) {
          if (faction.startswith.techs?.includes(techId)) {
            continue;
          }
          let techCount = info.techs[techId] ?? {
            wins: 0,
            games: 0,
            histogram: {},
            points: 0,
          };
          techCount.games++;
          if (index === 0) {
            techCount.wins++;
          }
          techCount.points += factionPoints;
          let sum = techCount.histogram[factionPoints] ?? 0;
          sum++;
          techCount.histogram[factionPoints] = sum;
          info.techs[techId] = techCount;
        }
        // if (factionId === "Vuil'raith Cabal") {
        //   const log = actionLogs[gameId];
        //   if (!log) {
        //     console.log("Missing log", gameId);
        //   } else {
        //     const techPath = getTechPath(factionId, log);
        //     info.techPaths.push(techPath);
        //   }
        // }
        info.techPoints += factionPoints;
        info.techGames++;
        if (index === 0) {
          info.techWins++;
        }
      }
      if (isObjectiveGame) {
        info.objectiveGames++;
        for (const [objectiveId, objective] of Object.entries(
          game.objectives ?? {}
        )) {
          const baseObjective = baseObjectives[objectiveId as ObjectiveId];

          if (
            (baseObjective.type === "STAGE ONE" ||
              baseObjective.type === "STAGE TWO") &&
            !objective.selected
          ) {
            continue;
          }
          const objInfo = info.objectives[objectiveId as ObjectiveId] ?? {
            games: 0,
            scored: 0,
            type: baseObjective.type,
            wins: 0,
          };
          objInfo.games++;
          const scoreCount = (objective.scorers ?? []).reduce((count, curr) => {
            if (curr === factionId) {
              return count + 1;
            }
            return count;
          }, 0);
          if ((objective.scorers ?? []).includes(factionId as FactionId)) {
            objInfo.scored += scoreCount;
            if (index === 0) {
              objInfo.wins++;
            }
          }
          if (baseObjective.id === "Imperial Point") {
            info.imperialPoints += (objective.scorers ?? []).filter(
              (id) => id === factionId
            ).length;
          }
          if (baseObjective.type === "SECRET") {
            if ((objective.scorers ?? []).includes(factionId as FactionId)) {
              info.scoredSecrets++;
            }
          }
          info.objectives[objectiveId as ObjectiveId] = objInfo;
        }
      }

      if (index === 0) {
        info.wins++;
      }

      let sum = info.histogram[factionPoints] ?? 0;
      sum++;
      info.histogram[factionPoints] = sum;
      info.points += factionPoints;
      info.games++;
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

  const aggressionOrder = Object.entries(factionInfo)
    .sort(([aName, a], [bName, b]) => {
      const aScore = computeAggressionScore(a.planetsByRound, a.planetGames);
      const bScore = computeAggressionScore(b.planetsByRound, b.planetGames);
      if (aScore === bScore) {
        return b.planetGames - a.planetGames;
      }
      return bScore - aScore;
    })
    .map(([aName, _]) => aName);

  const orderedInfo = Object.entries(factionInfo).sort(
    ([aName, a], [__, b]) => {
      const aWinRate = (1.0 * a.wins) / a.games;
      const bWinRate = (1.0 * b.wins) / b.games;
      return bWinRate - aWinRate;
    }
  );

  return (
    <div className="flexColumn" style={{ width: "550px" }}>
      {orderedInfo.map(([id, info]) => {
        let topPerc = 0;
        const mostCommonTechs = Object.entries(info.techs).reduce(
          (prev: [string, TechInfo][], curr) => {
            const firstElement: [string, TechInfo] = prev[0] ?? [
              "",
              { wins: 0, games: 0, histogram: {}, points: 0 },
            ];
            const prevPercentage = firstElement[1] ?? 0;

            if (curr[1].games > prevPercentage.games) {
              topPerc = curr[1].games;
              return [curr];
            }
            if (curr[1].games === prevPercentage.games) {
              return [...prev, curr];
            }
            return prev;
          },
          [["", { wins: 0, games: 0, histogram: {}, points: 0 }]]
        );
        // if (info.techPaths.length > 0) {
        //   const mostCommon = getMostCommonTechPath(info.techPaths);
        //   console.log("Most common", mostCommon);
        // }
        return (
          <Fragment key={id}>
            <GenericModal
              visible={shownModal === id}
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
                  className="flexRow centered extraLargeFont"
                  style={{
                    backgroundColor: "#222",
                    padding: `4px 8px`,
                    borderRadius: "4px",
                  }}
                >
                  <FactionIcon factionId={id as FactionId} size={36} />
                  {id}
                  <FactionIcon factionId={id as FactionId} size={36} />
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
                  <div
                    style={{
                      display: "grid",
                      width: "100%",
                      gap: "8px",
                      gridAutoFlow: "row",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      alignItems: "flex-start",
                    }}
                  >
                    <CollapsibleSection
                      title={
                        <div
                          className="flexRow"
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Objectives
                          <button
                            style={{ fontSize: "10px" }}
                            className={
                              objectiveType === "STAGE ONE" ? "selected" : ""
                            }
                            onClick={() => setObjectiveType("STAGE ONE")}
                          >
                            Stage I
                          </button>
                          <button
                            style={{ fontSize: "10px" }}
                            className={
                              objectiveType === "STAGE TWO" ? "selected" : ""
                            }
                            onClick={() => setObjectiveType("STAGE TWO")}
                          >
                            Stage II
                          </button>
                          <button
                            style={{ fontSize: "10px" }}
                            className={
                              objectiveType === "OTHER" ? "selected" : ""
                            }
                            onClick={() => setObjectiveType("OTHER")}
                          >
                            Other
                          </button>
                        </div>
                      }
                    >
                      <div
                        className="flexColumn"
                        style={{
                          width: "100%",
                          gap: "4px",
                          padding: `0 4px 4px`,
                          fontSize: "14px",
                        }}
                      >
                        <ObjectiveTable
                          objectives={info.objectives}
                          objectiveGames={info.objectiveGames}
                          objectiveType={objectiveType}
                          baseData={baseData}
                        />
                      </div>
                    </CollapsibleSection>
                    <CollapsibleSection
                      title={
                        <div
                          className="flexRow"
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Techs
                        </div>
                      }
                    >
                      <div
                        className="flexColumn"
                        style={{
                          width: "100%",
                          gap: "4px",
                          padding: `0 4px 4px`,
                          fontSize: "14px",
                        }}
                      >
                        <TechTable
                          techs={info.techs}
                          techGames={info.techGames}
                          techWins={info.techWins}
                          techPoints={info.techPoints}
                          baseData={baseData}
                        />
                      </div>
                    </CollapsibleSection>
                  </div>
                  {/* <FactionPanelContent faction={faction} options={options} /> */}
                </div>
              </div>
            </GenericModal>
            <LabeledDiv
              key={id}
              label={
                <div className="flexRow" style={{ gap: "4px" }}>
                  <FactionIcon factionId={id as FactionId} size={20} />
                  {id}
                  <FactionIcon factionId={id as FactionId} size={20} />
                </div>
              }
              style={{ gap: "2px" }}
            >
              <div
                className="flexRow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gridAutoFlow: "row",
                  alignItems: "flex-start",
                  width: "100%",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "4px",
                  }}
                >
                  <div>
                    Win Rate:{" "}
                    {Math.floor(((1.0 * info.wins) / info.games) * 10000) / 100}
                    % ({info.wins} of {info.games})
                  </div>

                  <div style={{ fontSize: "14px" }}>
                    Most Common (non-starting) Tech(s):{" "}
                    {mostCommonTechs.map((tech) => tech[0]).join(", ")} (
                    {Math.floor(((1.0 * topPerc) / info.techGames) * 10000) /
                      100}
                    %)
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    Aggression Ranking:{" "}
                    {aggressionOrder.findIndex((val) => val === id) + 1} of{" "}
                    {aggressionOrder.length} (Score:{" "}
                    {computeAggressionScore(
                      info.planetsByRound,
                      info.planetGames
                    )}
                    )
                  </div>
                  <div style={{ fontSize: "14px" }}>
                    Scored secrets per game:{" "}
                    {Math.round(
                      (info.scoredSecrets / info.objectiveGames) * 100
                    ) / 100}
                  </div>
                  <button
                    style={{ fontSize: "10px" }}
                    onClick={() => setShownModal(id as FactionId)}
                  >
                    More Stats
                  </button>
                </div>
                <PointsHistogram
                  histogram={info.histogram}
                  suffix="per Game"
                  points={points}
                />
              </div>
              {/* <TechTable
              techs={info.techs}
              techGames={info.techGames}
              techWins={info.techWins}
            /> */}
              {/* <ObjectiveTable
                objectives={info.objectives}
                objectiveGames={info.objectiveGames}
                objectiveType={objectiveType}
              /> */}
              {/* {info.techPaths.length > 0
              ? info.techPaths.map((techPath) => {
                  return (
                    <div>
                      {techPath
                        .map(
                          (techEntry) => `${techEntry.round}: ${techEntry.tech}`
                        )
                        .join(",")}
                    </div>
                  );
                })
              : null} */}
            </LabeledDiv>
          </Fragment>
        );
      })}
    </div>
  );
}

interface ObjectiveInfo {
  games: number;
  wins: number;
  scored: number;
  type: ObjectiveType;
}

function ObjectiveTable({
  objectives,
  objectiveGames,
  objectiveType,
  baseData,
}: {
  objectives: Record<string, ObjectiveInfo>;
  objectiveGames: number;
  objectiveType: ObjectiveType;
  baseData: BaseData;
}) {
  const intl = useIntl();
  const baseObjectives = baseData.objectives;
  const orderedObjectives = Object.entries(objectives).sort((a, b) => {
    const aGames =
      a[1].type === "STAGE ONE" || a[1].type === "STAGE TWO"
        ? a[1].games
        : objectiveGames;
    const bGames =
      b[1].type === "STAGE ONE" || b[1].type === "STAGE TWO"
        ? b[1].games
        : objectiveGames;
    const aRatio = a[1].scored / aGames;
    const bRatio = b[1].scored / bGames;
    if (aRatio === bRatio) {
      return bGames - aGames;
    }
    return bRatio - aRatio;
  });
  const filteredObjectives = orderedObjectives.filter(
    ([_, info]) => info.type === objectiveType && info.games >= 2
  );
  // const stageTwoObjectives = orderedObjectives.filter(
  //   ([_, info]) => info.type === "STAGE TWO" && info.games >= 2
  // );

  if (objectiveType === "OTHER") {
    const custodians = objectives["Custodians Token"];
    const imperialPoints = objectives["Imperial Point"];

    return (
      <div
        className="flexColumn"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {custodians ? (
          <>
            <div>
              Custodians Token taken in{" "}
              {Math.floor(
                ((1.0 * custodians.scored) / objectiveGames) * 10000
              ) / 100}
              % of games ({custodians.scored} of {objectiveGames})
            </div>
            <div>
              Win % with Custodians Token:{" "}
              {custodians.scored === 0
                ? 0
                : Math.floor(
                    ((1.0 * custodians.wins) / custodians.scored) * 10000
                  ) / 100}
              % ({custodians.wins} of {custodians.scored})
            </div>
          </>
        ) : null}
        {imperialPoints ? (
          <div>
            Imperial Points per game:{" "}
            {Math.floor(
              ((1.0 * imperialPoints.scored) / objectiveGames) * 100
            ) / 100}{" "}
            per game ({imperialPoints.scored} in {objectiveGames})
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <table style={{ fontSize: "12px", width: "100%", borderSpacing: "0" }}>
      <tbody>
        {/* {stageOneObjectives.length > 0 ? (
          <tr>
            <td style={{ textAlign: "center" }} colSpan={2}>
              STAGE I
            </td>
          </tr>
        ) : null} */}
        {filteredObjectives.map(([objective, info]) => {
          const games =
            info.type === "STAGE ONE" || info.type === "STAGE TWO"
              ? info.games
              : objectiveGames;

          if (games < 2) {
            return null;
          }
          const baseObj = baseObjectives[objective as ObjectiveId];
          return (
            <tr key={objective} style={{ fontFamily: "Source Sans" }}>
              <td
                className="flexColumn"
                style={{
                  alignItems: "flex-start",
                  gap: 0,
                }}
              >
                <div>{baseObj.name}</div>
                <div style={{ fontFamily: "Source Sans", fontSize: "10px" }}>
                  {baseObj.description}
                </div>
              </td>
              <td>
                {Math.floor(((1.0 * info.scored) / games) * 10000) / 100}% (
                {info.scored} of {games})
              </td>
            </tr>
          );
        })}
        {/* {stageTwoObjectives.length > 0 ? (
          <tr>
            <td style={{ textAlign: "center" }} colSpan={2}>
              STAGE II
            </td>
          </tr>
        ) : null} */}
      </tbody>
    </table>
  );
}

function TechTable({
  techs,
  techGames,
  techWins,
  techPoints,
  baseData,
}: {
  techs: Record<string, TechInfo>;
  techGames: number;
  techWins: number;
  techPoints: number;
  baseData: BaseData;
}) {
  const intl = useIntl();
  const baseTechs = baseData.techs;
  const orderedTechs = Object.entries(techs).sort((a, b) => {
    return b[1].games - a[1].games;
  });
  return (
    <table style={{ fontSize: "12px", width: "100%" }}>
      <thead style={{ textAlign: "left", fontSize: "14px" }}>
        <tr>
          <th style={{ fontWeight: "normal" }}></th>
          <th style={{ fontWeight: "normal" }}>Research %</th>
          <th style={{ fontWeight: "normal" }}>Win % w/</th>
          <th style={{ fontWeight: "normal" }}>Win % w/o</th>
          <th style={{ fontWeight: "normal" }}>Points w/</th>
          <th style={{ fontWeight: "normal" }}>Points w/o</th>
        </tr>
      </thead>
      <tbody>
        {orderedTechs.map(([tech, info]) => {
          const baseTech = baseTechs[tech as TechId];
          if (!baseTech) {
            return null;
          }
          return (
            <Fragment key={tech}>
              <tr key={tech} style={{ fontFamily: "Source Sans" }}>
                <td>{baseTech.name}</td>
                <td>
                  {Math.floor(((1.0 * info.games) / techGames) * 10000) / 100}%
                  ({info.games} of {techGames})
                </td>
                {info.games < 3 ? (
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(((1.0 * info.wins) / info.games) * 10000) / 100}
                    % ({info.wins} of {info.games})
                  </td>
                )}
                {techGames - info.games < 3 ? (
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(
                      ((1.0 * (techWins - info.wins)) /
                        (techGames - info.games)) *
                        10000
                    ) / 100}
                    % ({techWins - info.wins} of {techGames - info.games})
                  </td>
                )}
                {info.games < 3 ? (
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(((1.0 * info.points) / info.games) * 100) / 100}
                  </td>
                )}
                {techGames - info.games < 3 ? (
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(
                      ((1.0 * (techPoints - info.points)) /
                        (techGames - info.games)) *
                        100
                    ) / 100}
                  </td>
                )}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

interface FactionObjectiveInfo {
  games: number;
  scored: number;
}

function FactionsTable({
  factions,
  factionGames,
  objectiveType,
  points,
}: {
  factions: Record<string, FactionObjectiveInfo>;
  factionGames: Record<string, number>;
  objectiveType: ObjectiveType;
  points: number;
}) {
  const orderedFactions = Object.entries(factions).sort((a, b) => {
    const aGames =
      objectiveType === "SECRET" || objectiveType === "OTHER"
        ? factionGames[a[0] as FactionId] ?? 1
        : a[1].games;
    const bGames =
      objectiveType === "SECRET" || objectiveType === "OTHER"
        ? factionGames[b[0] as FactionId] ?? 1
        : b[1].games;
    const aRatio = a[1].scored / aGames;
    const bRatio = b[1].scored / bGames;
    if (aRatio === bRatio) {
      return bGames - aGames;
    }
    return bRatio - aRatio;
  });
  // const stageTwoObjectives = orderedObjectives.filter(
  //   ([_, info]) => info.type === "STAGE TWO" && info.games >= 2
  // );
  return (
    <table style={{ fontSize: "12px", width: "100%", borderSpacing: "0" }}>
      <tbody>
        {/* {stageOneObjectives.length > 0 ? (
          <tr>
            <td style={{ textAlign: "center" }} colSpan={2}>
              STAGE I
            </td>
          </tr>
        ) : null} */}
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
                <FactionIcon factionId={factionId as FactionId} size={18} />
                <div>{factionId}</div>
                {/* <FactionIcon factionId={factionId as FactionId} size={20} /> */}
              </td>
              <td>
                {Math.floor(((1.0 * info.scored) / games) * 10000) / 100}% (
                {info.scored} of {games})
              </td>
            </tr>
          );
        })}
        {/* {stageTwoObjectives.length > 0 ? (
          <tr>
            <td style={{ textAlign: "center" }} colSpan={2}>
              STAGE II
            </td>
          </tr>
        ) : null} */}
      </tbody>
    </table>
  );
}

function TechsSection({
  games,
  baseData,
  points,
}: {
  games: Record<string, StoredGameData>;
  baseData: BaseData;
  points: number;
}) {
  const intl = useIntl();
  const [tab, setTab] = useState("Non-Faction");
  const techInfo: Partial<
    Record<
      TechId,
      {
        researchers: number;
        winners: number;
        owners: number;
        ownedWinners: number;
        histogram: Histogram;
        ownedHistogram: Histogram;
      }
    >
  > = {};
  const baseTechs = baseData.techs;
  let techGames = 0;
  let factionGames: Partial<Record<FactionId, number>> = {};
  Object.entries(games).forEach(([gameId, game]) => {
    const factions = game.factions;
    const objectives = buildObjectives(game, baseData);

    const isTechGame = Object.values(factions).reduce((isTechGame, faction) => {
      for (const techId of Object.keys(faction.techs) as TechId[]) {
        if (!(faction.startswith.techs ?? []).includes(techId)) {
          return isTechGame;
        }
      }
      return false;
    }, true);

    if (isTechGame) {
      techGames++;
    }

    const orderedFactions = orderFactionsByVP(factions, objectives);

    orderedFactions.forEach(([factionId, faction], index) => {
      if (isTechGame) {
        let factionGame = factionGames[factionId as FactionId] ?? 0;
        factionGame++;
        factionGames[factionId as FactionId] = factionGame;

        for (const techId of Object.keys(faction.techs ?? {}) as TechId[]) {
          const baseTech = baseTechs[techId];

          if (!baseTech) {
            continue;
          }
          if (tab === "Non-Faction" && baseTech.faction) {
            continue;
          }
          if (tab === "Faction" && !baseTech.faction) {
            continue;
          }
          // Ignore Nekro for now
          if (baseTech.faction && factionId !== baseTech.faction) {
            continue;
          }
          let tech = techInfo[techId] ?? {
            winners: 0,
            researchers: 0,
            owners: 0,
            ownedWinners: 0,
            histogram: {},
            ownedHistogram: {},
          };
          const factionPoints = Math.min(
            points,
            computeVPs(factions, factionId as FactionId, objectives)
          );
          if (faction.startswith.techs?.includes(techId)) {
            if (index === 0) {
              tech.ownedWinners++;
            }
            tech.owners++;
            let sum = tech.ownedHistogram[factionPoints] ?? 0;
            sum++;
            tech.ownedHistogram[factionPoints] = sum;
          } else {
            if (index === 0) {
              tech.ownedWinners++;
              tech.winners++;
            }
            let sum = tech.histogram[factionPoints] ?? 0;
            sum++;
            tech.histogram[factionPoints] = sum;
            let ownedSum = tech.ownedHistogram[factionPoints] ?? 0;
            ownedSum++;
            tech.ownedHistogram[factionPoints] = ownedSum;
            tech.researchers++;
            tech.owners++;
          }
          techInfo[techId] = tech;
        }
      }
    });
  });

  const orderedInfo = Object.entries(techInfo).sort(([_, a], [__, b]) => {
    const aWinRate = (1.0 * a.winners) / a.researchers;
    const bWinRate = (1.0 * b.winners) / b.researchers;
    return bWinRate - aWinRate;
  });

  return (
    <div className="flexColumn" style={{ width: "550px" }}>
      <div className="flexRow">
        <button
          className={tab === "Non-Faction" ? "selected" : ""}
          onClick={() => setTab("Non-Faction")}
        >
          Non-Faction
        </button>
        <button
          className={tab === "Faction" ? "selected" : ""}
          onClick={() => setTab("Faction")}
        >
          Faction
        </button>
      </div>
      {orderedInfo.map(([id, info]) => {
        const tech = baseTechs[id as TechId];
        if (!tech) {
          return null;
        }
        let numGames = techGames;
        if (tab === "Faction") {
          numGames = factionGames[tech.faction as FactionId] ?? 0;
        }
        return (
          <LabeledDiv
            key={id}
            label={
              <div className="flexRow" style={{ gap: "4px" }}>
                {tech.type !== "UPGRADE" ? (
                  <TechIcon type={tech.type} size={20} />
                ) : null}
                {tech.name}
                {tech.type !== "UPGRADE" ? (
                  <TechIcon type={tech.type} size={20} />
                ) : null}
              </div>
            }
            rightLabel={
              <div>
                Win Rate:{" "}
                {Math.floor(((1.0 * info.winners) / info.researchers) * 10000) /
                  100}
                % ({info.winners} of {info.researchers})
              </div>
            }
            style={{ gap: 0 }}
          >
            <div
              className="flexColumn"
              style={{
                fontFamily: "Source Sans",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 0,
                width: "100%",
              }}
            >
              <div>
                Researched by Winner in{" "}
                {Math.floor(((1.0 * info.winners) / numGames) * 10000) / 100}%
                of Games ({info.winners} of {numGames})
              </div>
              {info.winners !== info.ownedWinners ? (
                <div style={{ fontSize: "14px" }}>
                  Owned by Winner in{" "}
                  {Math.floor(((1.0 * info.ownedWinners) / numGames) * 10000) /
                    100}
                  % of Games ({info.ownedWinners} of {numGames})
                </div>
              ) : null}
              <div
                className="flexRow"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  gap: "32px",
                }}
              >
                <PointsHistogram
                  histogram={info.histogram}
                  suffix="when researched"
                  points={points}
                />
                {info.winners !== info.ownedWinners ? (
                  <PointsHistogram
                    histogram={info.ownedHistogram}
                    suffix="when owned"
                    points={points}
                  />
                ) : null}
              </div>
            </div>
            {tab === "Faction" ? (
              <div>
                Researched in{" "}
                {Math.floor(((1.0 * info.researchers) / numGames) * 10000) /
                  100}
                % of games ({info.researchers} of {numGames})
              </div>
            ) : (
              <div
                className="flexColumn"
                style={{
                  fontFamily: "Source Sans",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 0,
                }}
              >
                <div>
                  Average Researchers per Game:{" "}
                  {Math.floor(((1.0 * info.researchers) / numGames) * 100) /
                    100}{" "}
                  ({info.researchers} in {numGames})
                </div>
              </div>
            )}
          </LabeledDiv>
        );
      })}
    </div>
  );
}

function ObjectivesSection({
  games,
  baseData,
  points,
}: {
  games: Record<string, StoredGameData>;
  baseData: BaseData;
  points: number;
}) {
  const [shownModal, setShownModal] = useState<Optional<ObjectiveId>>();
  const [tab, setTab] = useState<ObjectiveType>("STAGE ONE");

  const intl = useIntl();
  let objectivesByScore: Partial<
    Record<
      ObjectiveId,
      {
        games: number;
        scorers: number;
        totalScorers: number;
        scoredHistogram: Histogram;
        unscoredHistogram: Histogram;
        factionInfo: Partial<Record<FactionId, FactionObjectiveInfo>>;
        winners: number;
      }
    >
  > = {};
  const baseObjectives = baseData.objectives;
  const factionGames: Partial<Record<FactionId, number>> = {};
  let objectiveGames = 0;
  const foundTypes = new Set<ObjectiveType>();
  Object.entries(games).forEach(([gameId, game]) => {
    let isObjectiveGame = wereObjectivesRecorded(gameId, game, baseData);

    if (isObjectiveGame) {
      const objectives = buildObjectives(game, baseData);
      const winner = orderFactionsByVP(game.factions, objectives)[0];
      objectiveGames++;
      for (const factionId of Object.keys(game.factions)) {
        let factionInfo = factionGames[factionId as FactionId] ?? 0;
        factionInfo++;
        factionGames[factionId as FactionId] = factionInfo;
      }
      Object.entries(game.objectives ?? {}).forEach(([objId, obj]) => {
        const objInfo = objectivesByScore[objId as ObjectiveId] ?? {
          games: 0,
          scorers: 0,
          totalScorers: 0,
          scoredHistogram: {},
          unscoredHistogram: {},
          factionInfo: {},
          winners: 0,
        };
        const baseObj = baseObjectives[objId as ObjectiveId];
        if (
          (tab !== "SECRET" && tab !== "OTHER" && !obj.selected) ||
          baseObj.type !== tab
        ) {
          return;
        }
        const scorers = obj.scorers ?? [];
        for (const factionId of Object.keys(game.factions)) {
          // let factionInfo = factionGames[factionId as FactionId] ?? 0;
          // factionInfo++;
          // factionGames[factionId as FactionId] = factionInfo;
          const points = computeVPs(
            game.factions,
            factionId as FactionId,
            objectives
          );
          const faction = objInfo.factionInfo[factionId as FactionId] ?? {
            games: 0,
            scored: 0,
          };
          faction.games++;
          if (scorers.includes(factionId as FactionId)) {
            if (winner && winner[0] === factionId) {
              objInfo.winners++;
            }
            faction.scored++;
            let sum = objInfo.scoredHistogram[points] ?? 0;
            sum++;
            objInfo.scoredHistogram[points] = sum;
          } else {
            let sum = objInfo.unscoredHistogram[points] ?? 0;
            sum++;
            objInfo.unscoredHistogram[points] = sum;
          }
          objInfo.factionInfo[factionId as FactionId] = faction;
        }
        objInfo.games++;
        let numScorers = scorers.length;
        let dedupedScorers = new Set(scorers ?? []);
        objInfo.totalScorers += dedupedScorers.size;
        if (tab === "SECRET" || tab === "OTHER") {
          numScorers = Math.min(numScorers, 1);
        }
        objInfo.scorers += numScorers;
        objectivesByScore[objId as ObjectiveId] = objInfo;
      });
    }
  });

  const orderedObjectives = Object.entries(objectivesByScore).sort((a, b) => {
    const aGames =
      tab === "SECRET" || tab === "OTHER" ? objectiveGames : a[1].games;
    const aScorePerc = a[1].scorers / aGames;
    const bGames =
      tab === "SECRET" || tab === "OTHER" ? objectiveGames : b[1].games;
    const bScorePerc = b[1].scorers / bGames;
    return bScorePerc - aScorePerc;
  });

  return (
    <div className="flexColumn" style={{ width: "550px" }}>
      <div className="flexRow">
        <button
          className={tab === "STAGE ONE" ? "selected" : ""}
          onClick={() => setTab("STAGE ONE")}
        >
          Stage I
        </button>
        <button
          className={tab === "STAGE TWO" ? "selected" : ""}
          onClick={() => setTab("STAGE TWO")}
        >
          Stage II
        </button>
        <button
          className={tab === "SECRET" ? "selected" : ""}
          onClick={() => setTab("SECRET")}
        >
          Secrets
        </button>
        <button
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
                    {baseObjectives[objId as ObjectiveId].description}
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
                  <div
                    style={{
                      display: "grid",
                      width: "100%",
                      gap: "8px",
                      gridAutoFlow: "row",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      alignItems: "flex-start",
                    }}
                  >
                    <div></div>
                    <CollapsibleSection title="Factions">
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
                          objectiveType={
                            baseObjectives[objId as ObjectiveId].type
                          }
                          points={points}
                        />
                      </div>
                    </CollapsibleSection>
                  </div>
                  {/* <FactionPanelContent faction={faction} options={options} /> */}
                </div>
              </div>
            </GenericModal>
            <LabeledDiv key={objId} label={objId}>
              <div style={{ fontFamily: "Source Sans", fontSize: "14px" }}>
                {baseObjectives[objId as ObjectiveId].description}
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
                onClick={() => setShownModal(objId as ObjectiveId)}
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

function GameDataSection({
  games,
  baseData,
  actionLogs,
  points,
}: {
  games: Record<string, StoredGameData>;
  baseData: BaseData;
  actionLogs: Record<string, ActionLogEntry[]>;
  points: number;
}) {
  const intl = useIntl();
  let shortestGame = Number.MAX_SAFE_INTEGER;
  let longestGame = Number.MIN_SAFE_INTEGER;
  let totalGameLength = 0;
  let numGames = 0;
  let totalRounds = 0;
  let roundGames = 0;
  let objectiveGames = 0;
  let pointsHistogram: Histogram = {};
  let custodianWinners = 0;
  let custodianHistogram: Record<number, number> = {};
  let custodianPoints = 0;
  let custodianFactions = 0;
  let nonCustodianHistogram: Record<number, number> = {};
  let nonCustodianPoints = 0;
  let nonCustodianFactions = 0;
  const factionWinsHistogram: Partial<Record<FactionId, number>> = {};
  const factionsHistogram: Partial<Record<FactionId, number>> = {};
  const factionWinRateHistogram: Partial<Record<FactionId, number>> = {};
  Object.entries(games).forEach(([gameId, game]) => {
    // if (numGames === 0) {
    //   const log = actionLogs[id];
    //   if (log) {
    //     console.log(id);
    //     for (const faction of Object.keys(game.factions)) {
    //       const path = getTechPath(faction as FactionId, log);
    //       console.log(`Path for ${faction}`, path);
    //     }
    //   }
    // }
    if (game.state.round > 1) {
      totalRounds += game.state.round;
      roundGames++;
    }
    const isObjectiveGame = wereObjectivesRecorded(gameId, game, baseData);

    if (isObjectiveGame) {
      const objectives = buildObjectives(game, baseData);
      const winner = orderFactionsByVP(game.factions, objectives)[0];
      for (const factionId of Object.keys(game.factions)) {
        const factionPoints = Math.min(
          points,
          computeVPs(game.factions, factionId as FactionId, objectives)
        );
        let count = pointsHistogram[factionPoints] ?? 0;
        count++;
        pointsHistogram[factionPoints] = count;
        let sum = factionsHistogram[factionId as FactionId] ?? 0;
        sum++;
        factionsHistogram[factionId as FactionId] = sum;
        let numWins = factionWinsHistogram[factionId as FactionId] ?? 0;

        if (winner && factionId === winner[0]) {
          numWins++;
        }
        factionWinsHistogram[factionId as FactionId] = numWins;
      }
      objectiveGames++;
      const custodiansScorer = ((game.objectives ?? {})["Custodians Token"]
        ?.scorers ?? [])[0];
      if (custodiansScorer) {
        Object.keys(game.factions).forEach((factionId) => {
          if (factionId === custodiansScorer) {
            const factionPoints = Math.min(
              points,
              computeVPs(game.factions, factionId, objectives)
            );
            custodianPoints += factionPoints;
            let sum = custodianHistogram[factionPoints] ?? 0;
            sum++;
            custodianHistogram[factionPoints] = sum;
            custodianFactions++;
          } else {
            const factionPoints = Math.min(
              points,
              computeVPs(game.factions, factionId as FactionId, objectives)
            );
            nonCustodianPoints += factionPoints;
            let sum = nonCustodianHistogram[factionPoints] ?? 0;
            sum++;
            nonCustodianHistogram[factionPoints] = sum;

            nonCustodianFactions++;
          }
        });
        if (winner && winner[0] === custodiansScorer) {
          custodianWinners++;
        }
      }
    }

    const gameTime = game.timers?.game;
    if (!gameTime) {
      return;
    }
    longestGame = Math.max(longestGame, gameTime);
    shortestGame = Math.min(shortestGame, gameTime);
    totalGameLength += gameTime;
    numGames++;
  });

  Object.entries(factionWinsHistogram).forEach(([factionId, wins]) => {
    const games = factionsHistogram[factionId as FactionId];
    if (!games) {
      factionWinRateHistogram[factionId as FactionId] = 0;
      return;
    }
    factionWinRateHistogram[factionId as FactionId] = wins / games;
  });

  return (
    <div
      className="flexColumn"
      style={{ gap: "2px", position: "fixed", top: "180px", left: "96px" }}
    >
      <div className="flexColumn" style={{ alignItems: "stretch", gap: "2px" }}>
        <div className="flexRow" style={{ justifyContent: "space-between " }}>
          Completed Games:<div>{Object.keys(games).length}</div>
        </div>
        <div className="flexRow" style={{ justifyContent: "space-between" }}>
          Average Game Length:{" "}
          <TimerDisplay
            time={Math.floor(totalGameLength / numGames)}
            width={72}
            style={{ fontSize: "16px", fontFamily: "Source Sans" }}
          />
        </div>
        <div className="flexRow" style={{ justifyContent: "space-between" }}>
          Quickest Game:{" "}
          <TimerDisplay
            time={shortestGame}
            width={72}
            style={{ fontSize: "16px", fontFamily: "Source Sans" }}
          />
        </div>
        <div className="flexRow" style={{ justifyContent: "space-between" }}>
          Slowest Game:{" "}
          <TimerDisplay
            time={longestGame}
            width={72}
            style={{ fontSize: "16px", fontFamily: "Source Sans" }}
          />
        </div>
        <div className="flexRow" style={{ justifyContent: "space-between" }}>
          Average Number of Rounds:{" "}
          <div>{Math.floor((totalRounds / roundGames) * 100) / 100}</div>
        </div>
        <PointsHistogram
          histogram={pointsHistogram}
          points={points}
          suffix=""
        />
      </div>
      <div className="flexColumn">
        {/* <LabeledDiv label="Custodians">
          <div className="flexRow" style={{ justifyContent: "space-between" }}>
            Win % with Custodians Token:{" "}
            <div>
              {Math.floor((custodianWinners / objectiveGames) * 10000) / 100}%
            </div>
          </div>
          <div className="flexRow">
            <PointsHistogram
              histogram={custodianHistogram}
              suffix="w/ Custodians"
            />
            <PointsHistogram
              histogram={nonCustodianHistogram}
              suffix="w/o Custodians"
            />
          </div>
        </LabeledDiv> */}
        <div>
          Faction Games:
          <FactionHistogram histogram={factionsHistogram} />
        </div>
        <div>
          Faction Win Rates:
          <FactionHistogram histogram={factionWinRateHistogram} />
        </div>
      </div>
    </div>
  );
}

type Histogram = Record<number, number>;

function PointsHistogram({
  histogram,
  points,
  suffix,
}: {
  histogram: Record<number, number>;
  points: number;
  suffix: string;
}) {
  let maxVal = Number.MIN_SAFE_INTEGER;
  let minVal = Number.MAX_SAFE_INTEGER;
  let sum = 0;
  let total = 0;
  const fullHistogram: Histogram = {};
  for (let i = 0; i <= points; i++) {
    const val = histogram[i] ?? 0;
    minVal = Math.min(val, minVal);
    maxVal = Math.max(val, maxVal);
    total += val;
    sum += val * i;
    fullHistogram[i] = val;
  }
  // const orderedHistogram = Object.entries(histogram).sort(([a, _], [b, __]) => {
  //   return (a as unknown as number) - (b as unknown as number);
  // });

  // const maxVal = orderedHistogram.reduce(
  //   (max, curr) => Math.max(max, curr[1]),
  //   0
  // );
  // const minVal = orderedHistogram.reduce(
  //   (min, curr) => Math.min(min, curr[1]),
  //   Number.MAX_SAFE_INTEGER
  // );

  return (
    <div
      className="flexColumn"
      style={{ gap: "2px", width: "fit-content", alignItems: "flex-start" }}
    >
      <div>
        Average points{suffix ? ` ${suffix}` : ""}:{" "}
        {Math.round((sum / total) * 100) / 100}
      </div>
      <div
        className="flexRow"
        style={{
          position: "relative",
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(1, minmax(0, 1fr))",
          height: "80px",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          gap: "4px",
        }}
      >
        {Object.entries(fullHistogram).map(([key, value]) => {
          const height = (value / maxVal) * 100;
          // const color = height > 40 ? height > 60 ? "#222" : "#eee" : "#"
          return (
            <div
              key={key}
              className="flexColumn"
              style={{ height: "100%", gap: "2px" }}
            >
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  height: "100%",
                  width: "16px",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    height: `${height}%`,
                    width: "20px",
                    backgroundColor: "#666",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                  }}
                ></div>
              </div>
              <div
                className="flexRow"
                style={{
                  color: "#666",
                  width: "16px",
                }}
              >
                {key}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FactionHistogram({
  histogram,
}: {
  histogram: Partial<Record<FactionId, number>>;
}) {
  let maxVal = Number.MIN_SAFE_INTEGER;
  let minVal = Number.MAX_SAFE_INTEGER;
  let sum = 0;
  let total = 0;
  for (const val of Object.values(histogram)) {
    minVal = Math.min(val, minVal);
    maxVal = Math.max(val, maxVal);
    total += val;
  }
  const orderedHistogram = Object.entries(histogram).sort(([a, _], [b, __]) => {
    if (a < b) {
      return -1;
    }
    return 1;
  });

  // const maxVal = orderedHistogram.reduce(
  //   (max, curr) => Math.max(max, curr[1]),
  //   0
  // );
  // const minVal = orderedHistogram.reduce(
  //   (min, curr) => Math.min(min, curr[1]),
  //   Number.MAX_SAFE_INTEGER
  // );

  return (
    <div
      className="flexColumn"
      style={{ gap: "2px", width: "100%", alignItems: "flex-start" }}
    >
      <div
        className="flexRow"
        style={{
          position: "relative",
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(1, minmax(0, 1fr))",
          height: "100px",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          gap: "4px",
        }}
      >
        {orderedHistogram.map(([key, value]) => {
          const height = (value / maxVal) * 100;
          // const color = height > 40 ? height > 60 ? "#222" : "#eee" : "#"
          return (
            <div
              key={key}
              className="flexColumn"
              style={{ height: "100%", gap: "2px" }}
            >
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  height: "100%",
                  width: "16px",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    height: `${height}%`,
                    width: "20px",
                    backgroundColor: "#666",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                  }}
                ></div>
              </div>
              <div
                className="flexRow"
                style={{
                  color: "#666",
                  width: "16px",
                }}
              >
                <FactionIcon factionId={key as FactionId} size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
