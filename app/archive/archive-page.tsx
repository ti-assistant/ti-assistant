"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Chip from "../../src/components/Chip/Chip";
import FactionIcon from "../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import { Strings } from "../../src/components/strings";
import Toggle from "../../src/components/Toggle/Toggle";
import { objectEntries, rem } from "../../src/util/util";
import { ProcessedGame } from "../stats/processor";
import styles from "./game-page.module.scss";
import Sidebars from "../../src/components/Sidebars/Sidebars";

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

export default function ArchivePage({
  processedGames,
}: {
  processedGames: Record<string, ProcessedGame>;
}) {
  const intl = useIntl();
  const router = useRouter();
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

  const orderedGames = objectEntries(localGames).sort((a, b) => {
    if (a[1].timestampMillis < b[1].timestampMillis) {
      return 1;
    }
    return -1;
  });

  // TODO: Fetch and add archived games.
  return (
    <div className={styles.GamePage}>
      <Sidebars left="TI ASSISTANT" right="ARCHIVE" />
      <div className={styles.Filters}>
        <LabeledDiv
          label={intl.formatMessage({
            id: "Zh1T8Z",
            defaultMessage: "Filters",
            description:
              "Label for a section containing filters that filter out specific games.",
          })}
        >
          <div
            className="flexRow"
            style={{
              alignItems: "flex-start",
              fontSize: rem(12),
              gap: rem(4),
            }}
          >
            <FormattedMessage
              id="2jNcVD"
              defaultMessage="Expansions:"
              description="A label for a selector specifying which expansions should be enabled."
            />
            <div
              className="flexRow"
              style={{
                justifyContent: "flex-start",
                fontSize: rem(12),
                gap: rem(4),
                flexWrap: "wrap",
              }}
            >
              <FilterButton
                filters={expansions}
                filter="POK"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="POK" />}
              />
              <FilterButton
                filters={expansions}
                filter="CODEX ONE"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="CODEX ONE" />}
              />
              <FilterButton
                filters={expansions}
                filter="CODEX TWO"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="CODEX TWO" />}
              />
              <FilterButton
                filters={expansions}
                filter="CODEX THREE"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="CODEX THREE" />}
              />
              <FilterButton
                filters={expansions}
                filter="DISCORDANT STARS"
                setFilters={setExpansions}
                text={<Strings.Expansion expansion="DISCORDANT STARS" />}
              />
            </div>
          </div>
          <div className="flexRow" style={{ fontSize: rem(12), gap: rem(4) }}>
            <FormattedMessage
              id="Jh0WRk"
              defaultMessage="Player Count"
              description="Label for a selector to change the number of players"
            />
            :
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
          {/* <div className="flexRow" style={{ fontSize: rem(12), gap: rem(4) }}>
            Include Factions:
            <Toggle selected={false} toggleFn={() => {}}>
              <FactionIcon factionId="Arborec" size={18} />
            </Toggle>
            <Toggle selected={false} toggleFn={() => {}}>
              <FactionIcon factionId="Argent Flight" size={18} />
            </Toggle>
            <Toggle selected={false} toggleFn={() => {}}>
              <FactionIcon factionId="Barony of Letnev" size={18} />
            </Toggle>
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
          </div> */}
        </LabeledDiv>
      </div>
      <div className={styles.ArchiveGames}>
        {orderedGames.map(([gameId, game]) => {
          // Skip games that pre-date action log.
          if (!game.timestampMillis) {
            return null;
          }

          const orderedFactions = objectEntries(game.factions).sort((a, b) => {
            return b[1].points - a[1].points;
          });

          const date = new Date(game.timestampMillis);

          return (
            <Link
              href={`/archive/${gameId}`}
              key={gameId}
              className={styles.ArchiveGame}
            >
              <div className="flexRow" style={{ justifyContent: "flex-start" }}>
                {gameId}
              </div>
              <div className="flexRow" style={{ justifyContent: "flex-start" }}>
                {date.toDateString()}
              </div>
              <div
                className="flexRow"
                style={{ gap: rem(8), justifyContent: "flex-start" }}
              >
                {orderedFactions.map(([factionId, faction]) => {
                  return (
                    <div
                      key={factionId}
                      className="flexRow"
                      style={{
                        position: "relative",
                        width: rem(24),
                        height: rem(24),
                      }}
                    >
                      <FactionIcon factionId={factionId} size="100%" />
                      <div
                        className="flexRow"
                        style={{
                          position: "absolute",
                          backgroundColor: "#222",
                          borderRadius: "100%",
                          marginLeft: "60%",
                          marginTop: "60%",
                          fontSize: rem(12),
                          boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                          width: rem(16),
                          height: rem(16),
                          zIndex: 2,
                        }}
                      >
                        {faction.points}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
