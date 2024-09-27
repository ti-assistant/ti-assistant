"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import TimerDisplay from "../../src/components/TimerDisplay/TimerDisplay";
import Toggle from "../../src/components/Toggle/Toggle";
import { Optional } from "../../src/util/types/types";
import { objectEntries } from "../../src/util/util";
import { ProcessedGame } from "./processor";
import FactionsSection from "./sections/FactionsSection";
import { FactionHistogram, PointsHistogram } from "./sections/Histogram";
import ObjectivesSection from "./sections/ObjectivesSection";
import StrategyCardSection from "./sections/StrategyCardSection";
import TechsSection from "./sections/TechsSection";
import { HistogramData } from "./sections/types";
import styles from "./StatsPage.module.scss";

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
  planetsLost: Partial<
    Record<FactionId, { all: number; home: number; mecatol: number }>
  >;
}

export interface ProcessedLog {
  rounds: ProcessedRound[];
}

function applyFilters(
  games: Record<string, ProcessedGame>,
  filters: {
    expansions: Set<Expansion>;
    playerCount: number;
    victoryPoints: Set<number>;
  }
) {
  const filteredGames: Record<string, ProcessedGame> = {};

  objectEntries(games).forEach(([id, game]) => {
    // Expansion Filter
    for (const expansion of game.expansions) {
      if (!filters.expansions.has(expansion)) {
        return;
      }
    }
    for (const expansion of Array.from(filters.expansions)) {
      if (expansion === "BASE" || expansion === "BASE ONLY") {
        continue;
      }
      if (!game.expansions.includes(expansion)) {
        return;
      }
    }

    // Player Count filter
    if (filters.playerCount !== game.playerCount) {
      return;
    }

    // Victory point filter
    if (!filters.victoryPoints.has(game.victoryPoints)) {
      return;
    }

    filteredGames[id] = game;
  });

  return filteredGames;
}

export default function StatsPage({
  processedGames,
  baseData,
}: {
  processedGames: Record<string, ProcessedGame>;
  baseData: BaseData;
}) {
  const [expansions, setExpansions] = useState<Set<Expansion>>(
    new Set(["BASE", "POK", "CODEX ONE", "CODEX TWO", "CODEX THREE"])
  );

  const [victoryPoints, setVictoryPoints] = useState<Set<number>>(
    new Set([10])
  );
  const [playerCount, setPlayerCount] = useState<number>(6);

  const [localGames, setLocalGames] = useState(
    applyFilters(processedGames, {
      expansions,
      playerCount,
      victoryPoints,
    })
  );

  useEffect(() => {
    setLocalGames(
      applyFilters(processedGames, {
        expansions,
        playerCount,
        victoryPoints,
      })
    );
  }, [processedGames, expansions, playerCount, victoryPoints]);

  const points = Array.from(victoryPoints).reduce(
    (max, curr) => Math.max(max, curr),
    0
  );

  return (
    <>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="STATS (BETA)" />
      <div className={styles.StatsPage}>
        <div
          className="flexColumn"
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <LabeledDiv label="Filters" className={styles.Filters}>
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
          <div className={styles.DataSection}>
            <GameDataSection
              games={localGames}
              baseData={baseData}
              actionLogs={{}}
              points={points}
            />
            <DetailsSection
              games={localGames}
              baseData={baseData}
              playerCount={playerCount}
              points={points}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function DetailsSection({
  games,
  baseData,
  playerCount,
  points,
}: {
  games: Record<string, ProcessedGame>;
  baseData: BaseData;
  playerCount: number;
  points: number;
}) {
  const [tab, setTab] = useState("Factions");

  let tabContent: Optional<ReactNode>;

  switch (tab) {
    case "Strategy Cards":
      tabContent = (
        <StrategyCardSection games={games} playerCount={playerCount} />
      );
      break;
    case "Techs":
      tabContent = (
        <TechsSection games={games} baseData={baseData} points={points} />
      );
      break;
    case "Factions":
      tabContent = (
        <FactionsSection games={games} baseData={baseData} points={points} />
      );
      break;
    case "Objectives":
      tabContent = <ObjectivesSection games={games} baseData={baseData} />;
      break;
  }

  return (
    <div className="flexColumn" style={{ paddingBottom: "8px" }}>
      <div className="flexRow">
        <button
          style={{ fontSize: "14px" }}
          className={tab === "Factions" ? "selected" : ""}
          onClick={() => setTab("Factions")}
        >
          Factions
        </button>
        <button
          style={{ fontSize: "14px" }}
          className={tab === "Objectives" ? "selected" : ""}
          onClick={() => setTab("Objectives")}
        >
          Objectives
        </button>
        <button
          style={{ fontSize: "14px" }}
          className={tab === "Techs" ? "selected" : ""}
          onClick={() => setTab("Techs")}
        >
          Techs
        </button>
        <button
          style={{ fontSize: "14px" }}
          className={tab === "Strategy Cards" ? "selected" : ""}
          onClick={() => setTab("Strategy Cards")}
        >
          Strategy Cards
        </button>
      </div>
      <div className={styles.DetailsSection}>{tabContent}</div>
    </div>
  );
}
function GameDataSection({
  games,
  baseData,
  actionLogs,
  points,
}: {
  games: Record<string, ProcessedGame>;
  baseData: BaseData;
  actionLogs: Record<string, ActionLogEntry[]>;
  points: number;
}) {
  let shortestGame = Number.MAX_SAFE_INTEGER;
  let longestGame = Number.MIN_SAFE_INTEGER;
  let totalGameLength = 0;
  let numGames = 0;
  let totalRounds = 0;
  let roundGames = 0;
  let objectiveGames = 0;
  let pointsHistogram: HistogramData = {};
  const factionWinsHistogram: Partial<Record<FactionId, number>> = {};
  const factionsHistogram: Partial<Record<FactionId, number>> = {};
  const factionWinRateHistogram: Partial<Record<FactionId, number>> = {};
  Object.values(games).forEach((game) => {
    const rounds = game.rounds.length;
    if (rounds > 1) {
      totalRounds += rounds;
      roundGames++;
    }

    if (game.isObjectiveGame) {
      const winner = game.winner;
      for (const [factionId, faction] of objectEntries(game.factions)) {
        const factionPoints = faction.points;
        let count = pointsHistogram[factionPoints] ?? 0;
        count++;
        pointsHistogram[factionPoints] = count;
        let sum = factionsHistogram[factionId] ?? 0;
        sum++;
        factionsHistogram[factionId] = sum;
        let numWins = factionWinsHistogram[factionId] ?? 0;

        if (winner && factionId === winner) {
          numWins++;
        }
        factionWinsHistogram[factionId] = numWins;
      }
      objectiveGames++;
    }

    const gameTime = game.gameTime;
    if (!gameTime || gameTime < 7200) {
      return;
    }
    longestGame = Math.max(longestGame, gameTime);
    shortestGame = Math.min(shortestGame, gameTime);
    totalGameLength += gameTime;
    numGames++;
  });

  objectEntries(factionWinsHistogram).forEach(([factionId, wins]) => {
    const games = factionsHistogram[factionId];
    if (!games) {
      factionWinRateHistogram[factionId] = 0;
      return;
    }
    factionWinRateHistogram[factionId] = wins / games;
  });

  return (
    <div className={styles.GameDataSection}>
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
      <div
        className="flexColumn"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        Faction Games:
        <FactionHistogram histogram={factionsHistogram} />
        Faction Win Rates:
        <FactionHistogram histogram={factionWinRateHistogram} />
      </div>
    </div>
  );
}
