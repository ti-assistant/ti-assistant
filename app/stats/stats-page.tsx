"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Chip from "../../src/components/Chip/Chip";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import { Strings } from "../../src/components/strings";
import ThreeWayToggle from "../../src/components/ThreeWayToggle/ThreeWayToggle";
import TimerDisplay from "../../src/components/TimerDisplay/TimerDisplay";
import Toggle from "../../src/components/Toggle/Toggle";
import { Loader } from "../../src/Loader";
import { Optional } from "../../src/util/types/types";
import { objectEntries, objectKeys, rem } from "../../src/util/util";
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
  text,
}: {
  filter: T;
  filters: Set<T>;
  setFilters: Dispatch<SetStateAction<Set<T>>>;
  text?: ReactNode;
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
      {text ?? filter}
    </Toggle>
  );
}

function ThreeWayFilterButton<T extends string | number>({
  filter,
  filters,
  setFilters,
  text,
}: {
  filter: T;
  filters: IncludeExclude<T>;
  setFilters: Dispatch<SetStateAction<IncludeExclude<T>>>;
  text?: ReactNode;
}) {
  let value: Optional<"Positive" | "Negative">;
  if (filters.include.has(filter)) {
    value = "Positive";
  }
  if (filters.exclude.has(filter)) {
    value = "Negative";
  }
  return (
    <ThreeWayToggle
      selected={value}
      toggleFn={(newValue) => {
        setFilters((filters) => {
          const newInclude = new Set(filters.include);
          const newExclude = new Set(filters.exclude);
          newInclude.delete(filter);
          newExclude.delete(filter);
          if (newValue === "Positive") {
            newInclude.add(filter);
          }
          if (newValue === "Negative") {
            newExclude.add(filter);
          }
          return {
            include: newInclude,
            exclude: newExclude,
          };
        });
      }}
    >
      {text ?? filter}
    </ThreeWayToggle>
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
    <Chip
      selected={filters === filter}
      toggleFn={(prevValue) => {
        setFilters(filter);
      }}
      fontSize={14}
    >
      {filter}
    </Chip>
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
    events: IncludeExclude<EventId>;
    expansions: IncludeExclude<Expansion>;
    playerCounts: Set<number>;
    victoryPoints: Set<number>;
  }
) {
  const filteredGames: Record<string, ProcessedGame> = {};

  objectEntries(games).forEach(([id, game]) => {
    // Event Filter
    const gameEvents = game.events ?? [];
    for (const event of gameEvents) {
      if (filters.events.exclude.has(event)) {
        return;
      }
    }
    for (const event of Array.from(filters.events.include)) {
      if (!gameEvents.includes(event)) {
        return;
      }
    }

    // Expansion filter
    for (const expansion of game.expansions) {
      if (filters.expansions.exclude.has(expansion)) {
        return;
      }
    }
    for (const expansion of Array.from(filters.expansions.include)) {
      if (expansion === "BASE" || expansion === "BASE ONLY") {
        continue;
      }
      if (!game.expansions.includes(expansion)) {
        return;
      }
    }

    // Player Count filter
    if (
      filters.playerCounts.size > 0 &&
      !filters.playerCounts.has(game.playerCount)
    ) {
      return;
    }

    // Victory point filter
    if (
      filters.victoryPoints.size > 0 &&
      !filters.victoryPoints.has(game.victoryPoints)
    ) {
      return;
    }

    filteredGames[id] = game;
  });

  return filteredGames;
}

interface IncludeExclude<T> {
  include: Set<T>;
  exclude: Set<T>;
}

export default function StatsPage({
  processedGames,
  baseData,
  loading,
}: {
  processedGames: Record<string, ProcessedGame>;
  baseData: BaseData;
  loading?: boolean;
}) {
  const intl = useIntl();
  const [expansions, setExpansions] = useState<IncludeExclude<Expansion>>({
    include: new Set(["BASE", "POK", "CODEX ONE", "CODEX TWO", "CODEX THREE"]),
    exclude: new Set(["DISCORDANT STARS"]),
  });
  const [events, setEvents] = useState<IncludeExclude<EventId>>({
    include: new Set(),
    exclude: new Set(objectKeys(baseData.events)),
  });

  const [victoryPoints, setVictoryPoints] = useState<Set<number>>(
    new Set([10])
  );
  const [playerCounts, setPlayerCounts] = useState<Set<number>>(new Set([6]));

  const [localGames, setLocalGames] = useState(
    applyFilters(processedGames, {
      events,
      expansions,
      playerCounts,
      victoryPoints,
    })
  );

  useEffect(() => {
    setLocalGames(
      applyFilters(processedGames, {
        events,
        expansions,
        playerCounts,
        victoryPoints,
      })
    );
  }, [processedGames, events, expansions, playerCounts, victoryPoints]);

  let points = Array.from(victoryPoints).reduce(
    (max, curr) => Math.max(max, curr),
    0
  );
  if (points === 0) {
    points = 14;
  }

  const baseEvents = objectEntries(baseData.events).sort(([_, a], [__, b]) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  return (
    <>
      <NonGameHeader
        leftSidebar="TI ASSISTANT"
        rightSidebar={intl
          .formatMessage({
            id: "aO0PYJ",
            defaultMessage: "Stats",
            description: "A button that will open the statistics page.",
          })
          .toUpperCase()}
      />
      <div className={styles.StatsPage}>
        <div
          className="flexColumn"
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <LabeledDiv
            label={intl.formatMessage({
              id: "Zh1T8Z",
              defaultMessage: "Filters",
              description:
                "Label for a section containing filters that filter out specific games.",
            })}
            className={styles.Filters}
            innerClass={styles.FilterContent}
          >
            <div className="flexRow" style={{ fontSize: rem(12), gap: rem(4) }}>
              <FormattedMessage
                id="2jNcVD"
                defaultMessage="Expansions:"
                description="A label for a selector specifying which expansions should be enabled."
              />
              <ThreeWayFilterButton
                filters={expansions}
                filter="POK"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="POK" />}
              />
              <ThreeWayFilterButton
                filters={expansions}
                filter="CODEX ONE"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="CODEX ONE" />}
              />
              <ThreeWayFilterButton
                filters={expansions}
                filter="CODEX TWO"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="CODEX TWO" />}
              />
              <ThreeWayFilterButton
                filters={expansions}
                filter="CODEX THREE"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="CODEX THREE" />}
              />
              <ThreeWayFilterButton
                filters={expansions}
                filter="CODEX FOUR"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="CODEX FOUR" />}
              />
              <ThreeWayFilterButton
                filters={expansions}
                filter="THUNDERS EDGE"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="THUNDERS EDGE" />}
              />
              <ThreeWayFilterButton
                filters={expansions}
                filter="DISCORDANT STARS"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="DISCORDANT STARS" />}
              />
            </div>
            <div className="flexRow" style={{ fontSize: rem(12), gap: rem(4) }}>
              <FormattedMessage
                id="Jh0WRk"
                defaultMessage="Player Count"
                description="Label for a selector to change the number of players"
              />
              :
              <FilterButton
                filters={playerCounts}
                filter={3}
                setFilters={setPlayerCounts}
              />
              <FilterButton
                filters={playerCounts}
                filter={4}
                setFilters={setPlayerCounts}
              />
              <FilterButton
                filters={playerCounts}
                filter={5}
                setFilters={setPlayerCounts}
              />
              <FilterButton
                filters={playerCounts}
                filter={6}
                setFilters={setPlayerCounts}
              />
              <FilterButton
                filters={playerCounts}
                filter={7}
                setFilters={setPlayerCounts}
              />
              <FilterButton
                filters={playerCounts}
                filter={8}
                setFilters={setPlayerCounts}
              />
            </div>
            <div className="flexRow" style={{ fontSize: rem(12), gap: rem(4) }}>
              <FormattedMessage
                id="R06tnh"
                description="A label for a selector specifying the number of victory points required."
                defaultMessage="Victory Points"
              />
              :
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
            {expansions.exclude.has("CODEX FOUR") &&
            expansions.exclude.has("THUNDERS EDGE") ? null : (
              <div
                className="flexRow"
                style={{
                  fontSize: rem(12),
                  gap: rem(4),
                }}
              >
                <FormattedMessage
                  id="WVs5Hr"
                  defaultMessage="Events"
                  description="Event actions."
                />
                :
                {baseEvents.map(([eventId, event]) => {
                  return (
                    <ThreeWayFilterButton
                      key={eventId}
                      filters={events}
                      filter={eventId}
                      setFilters={setEvents}
                      text={event.name}
                    />
                  );
                })}
              </div>
            )}
          </LabeledDiv>
          <div className={styles.DataSection}>
            {loading ? (
              <Loader />
            ) : (
              <>
                <GameDataSection games={localGames} points={points} />
                <DetailsSection
                  games={localGames}
                  baseData={baseData}
                  playerCounts={playerCounts}
                  points={points}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DetailsSection({
  games,
  baseData,
  playerCounts,
  points,
}: {
  games: Record<string, ProcessedGame>;
  baseData: BaseData;
  playerCounts: Set<number>;
  points: number;
}) {
  const [tab, setTab] = useState("Factions");

  let tabContent: Optional<ReactNode>;

  switch (tab) {
    case "Strategy Cards":
      tabContent = (
        <StrategyCardSection games={games} playerCounts={playerCounts} />
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
    <div className="flexColumn" style={{ paddingBottom: rem(8) }}>
      <div className="flexRow" style={{ gap: rem(4) }}>
        <Chip
          fontSize={14}
          selected={tab === "Factions"}
          toggleFn={() => setTab("Factions")}
        >
          <FormattedMessage
            id="r2htpd"
            description="Text on a button that will randomize factions."
            defaultMessage="Factions"
          />
        </Chip>
        <Chip
          fontSize={14}
          selected={tab === "Objectives"}
          toggleFn={() => setTab("Objectives")}
        >
          <FormattedMessage
            id="5Bl4Ek"
            description="Cards that define how to score victory points."
            defaultMessage="Objectives"
          />
        </Chip>
        <Chip
          fontSize={14}
          selected={tab === "Techs"}
          toggleFn={() => setTab("Techs")}
        >
          <FormattedMessage
            id="ys7uwX"
            description="Shortened version of technologies."
            defaultMessage="Techs"
          />
        </Chip>
        <Chip
          fontSize={14}
          selected={tab === "Strategy Cards"}
          toggleFn={() => setTab("Strategy Cards")}
        >
          <FormattedMessage
            id="jOsJY8"
            description="Strategy Cards."
            defaultMessage="Strategy Cards"
          />
        </Chip>
      </div>
      <div className={styles.DetailsSection}>{tabContent}</div>
    </div>
  );
}
function GameDataSection({
  games,
  points,
}: {
  games: Record<string, ProcessedGame>;
  points: number;
}) {
  let totalGameLength = 0;
  let numGames = 0;
  let totalRounds = 0;
  let roundGames = 0;
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

    const gameTime = game.gameTime;
    if (!gameTime || gameTime < 7200) {
      return;
    }
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
      <div
        className="flexColumn"
        style={{ alignItems: "stretch", gap: rem(2) }}
      >
        <div className="flexRow" style={{ justifyContent: "space-between " }}>
          <FormattedMessage
            id="zAhkl6"
            defaultMessage="Completed Games"
            description="Label for the number of completed games."
          />
          :<div>{Object.keys(games).length}</div>
        </div>
        <div className="flexRow" style={{ justifyContent: "space-between" }}>
          <FormattedMessage
            id="ssIhWl"
            defaultMessage="Average Game Length"
            description="Label for the average game length."
          />
          :
          <TimerDisplay
            time={Math.floor(totalGameLength / numGames)}
            width={72}
            style={{ fontSize: rem(16), fontFamily: "Source Sans" }}
          />
        </div>
        <div className="flexRow" style={{ justifyContent: "space-between" }}>
          <FormattedMessage
            id="PmqXSZ"
            defaultMessage="Average Number of Rounds"
            description="Label for the average number of rounds."
          />
          : <div>{Math.floor((totalRounds / roundGames) * 100) / 100}</div>
        </div>
        <PointsHistogram histogram={pointsHistogram} points={points} />
      </div>
      <div
        className="flexColumn"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <FormattedMessage
          id="i3D47t"
          defaultMessage="Faction Games"
          description="Label for a chart showing the number of games per faction."
        />
        :
        <FactionHistogram histogram={factionsHistogram} />
        <FormattedMessage
          id="r4GnEX"
          defaultMessage="Faction Win Rates"
          description="Label for a chart showing the win rate per faction."
        />
        :
        <FactionHistogram histogram={factionWinRateHistogram} />
      </div>
    </div>
  );
}
