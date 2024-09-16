"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { getBaseObjectives } from "../../server/data/objectives";
import { getBaseTechs } from "../../server/data/techs";
import FactionIcon from "../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import TechIcon from "../../src/components/TechIcon/TechIcon";
import TimerDisplay from "../../src/components/TimerDisplay/TimerDisplay";
import Toggle from "../../src/components/Toggle/Toggle";
import { buildObjectives } from "../../src/data/GameData";
import { computeVPs } from "../../src/util/factions";
import { Optional } from "../../src/util/types/types";
import LabeledLine from "../../src/components/LabeledLine/LabeledLine";
import GenericModal from "../../src/components/GenericModal/GenericModal";
import { CollapsibleSection } from "../../src/components/CollapsibleSection";

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

type GameFilter =
  | "BASE_GAME"
  | "PROPHECY_OF_KINGS"
  | "CODEX_ONE"
  | "CODEX_TWO"
  | "CODEX_THREE"
  | "DISCORDANT_STARS";

function applyFilters(
  games: Record<string, StoredGameData>,
  filters: {
    expansions: Set<Expansion>;
    playerCounts: Set<number>;
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
    if (!filters.playerCounts.has(Object.keys(game.factions).length)) {
      return;
    }

    // Victory point filter
    if (!filters.victoryPoints.has(game.options["victory-points"])) {
      return;
    }

    filteredGames[id] = game;
  });

  return filteredGames;
}

export default function StatsPage({
  completedGames,
  actionLogs,
}: {
  completedGames: Record<string, StoredGameData>;
  actionLogs: Record<string, ActionLogEntry[]>;
}) {
  const [expansions, setExpansions] = useState<Set<Expansion>>(
    new Set(["BASE", "POK", "CODEX ONE", "CODEX TWO", "CODEX THREE"])
  );

  const [playerCounts, setPlayerCounts] = useState<Set<number>>(new Set([6]));
  const [victoryPoints, setVictoryPoints] = useState<Set<number>>(
    new Set([10])
  );

  const [localGames, setLocalGames] = useState(
    applyFilters(completedGames, { expansions, playerCounts, victoryPoints })
  );

  useEffect(() => {
    setLocalGames(
      applyFilters(completedGames, { expansions, playerCounts, victoryPoints })
    );
  }, [completedGames, expansions, playerCounts, victoryPoints]);

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
          // justifyContent: "flex-start",
          // alignItems: "flex-start",
          // overflowY: "scroll",
        }}
      >
        <div
          className="flexColumn"
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <LabeledDiv label="Filters">
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
            <div className="flexRow" style={{ fontSize: "12px", gap: "4px" }}>
              Victory Points:
              <FilterButton
                filters={victoryPoints}
                filter={10}
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
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "space-evenly",
            }}
          >
            <GameDataSection games={localGames} actionLogs={actionLogs} />
            <DetailsSection games={localGames} actionLogs={actionLogs} />
            {/* <FactionsSection games={localGames} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

function DetailsSection({
  games,
  actionLogs,
}: {
  games: Record<string, StoredGameData>;
  actionLogs: Record<string, ActionLogEntry[]>;
}) {
  const [tab, setTab] = useState("Factions");

  let tabContent: Optional<ReactNode>;

  switch (tab) {
    case "Techs":
      tabContent = <TechsSection games={games} />;
      break;
    case "Factions":
      tabContent = <FactionsSection games={games} actionLogs={actionLogs} />;
      break;
    case "Objectives":
      tabContent = <ObjectivesSection games={games} />;
      break;
  }

  return (
    <div className="flexColumn" style={{ paddingBottom: "8px" }}>
      <div className="flexRow">
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
      {tabContent}
    </div>
  );
}

interface TechInfo {
  games: number;
  wins: number;
}

interface FactionInfo {
  wins: number;
  games: number;
  points: number;
  techs: Partial<Record<TechId, TechInfo>>;
  techGames: number;
  techWins: number;
  techPaths: TechEntry[][];
  objectives: Partial<Record<ObjectiveId, ObjectiveInfo>>;
  objectiveGames: number;
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

function FactionsSection({
  games,
  actionLogs,
}: {
  games: Record<string, StoredGameData>;
  actionLogs: Record<string, ActionLogEntry[]>;
}) {
  const [shownModal, setShownModal] = useState<Optional<FactionId>>();
  const [objectiveType, setObjectiveType] =
    useState<ObjectiveType>("STAGE ONE");

  const intl = useIntl();
  const baseObjectives = getBaseObjectives(intl);
  const factionInfo: Partial<Record<FactionId, FactionInfo>> = {};
  let techGames = 0;
  Object.entries(games).forEach(([gameId, game]) => {
    const factions = game.factions;
    const objectives = buildObjectives(game, intl);

    const isTechGame = Object.values(factions).reduce((isTechGame, faction) => {
      for (const techId of Object.keys(faction.techs) as TechId[]) {
        if (!(faction.startswith.techs ?? []).includes(techId)) {
          return isTechGame;
        }
      }
      return false;
    }, true);

    const isObjectiveGame = Object.values(game.objectives ?? {}).reduce(
      (isObjGame, curr) => {
        if ((curr.scorers ?? []).length !== 0) {
          return true;
        }
        return isObjGame;
      },
      false
    );

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
          techPaths: [],
          objectives: {},
          objectiveGames: 0,
        };
      }

      if (isTechGame) {
        for (const techId of Object.keys(faction.techs ?? {}) as TechId[]) {
          if (faction.startswith.techs?.includes(techId)) {
            continue;
          }
          let techCount = info.techs[techId] ?? { wins: 0, games: 0 };
          techCount.games++;
          if (index === 0) {
            techCount.wins++;
          }
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
          info.objectives[objectiveId as ObjectiveId] = objInfo;
        }
      }

      if (index === 0) {
        info.wins++;
      }
      info.points += computeVPs(factions, factionId as FactionId, objectives);
      info.games++;
      factionInfo[factionId as FactionId] = info;
    });
  });

  const orderedInfo = Object.entries(factionInfo).sort(([_, a], [__, b]) => {
    const aWinRate = (1.0 * a.wins) / a.games;
    const bWinRate = (1.0 * b.wins) / b.games;
    return bWinRate - aWinRate;
  });

  return (
    <div className="flexColumn" style={{ width: "550px" }}>
      {orderedInfo.map(([id, info]) => {
        let topPerc = 0;
        const mostCommonTechs = Object.entries(info.techs).reduce(
          (prev: [string, TechInfo][], curr) => {
            const firstElement: [string, TechInfo] = prev[0] ?? [
              "",
              { wins: 0, games: 0 },
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
          [["", { wins: 0, games: 0 }]]
        );
        // if (info.techPaths.length > 0) {
        //   const mostCommon = getMostCommonTechPath(info.techPaths);
        //   console.log("Most common", mostCommon);
        // }
        return (
          <>
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
              rightLabel={
                <>
                  Win Rate:{" "}
                  {Math.floor(((1.0 * info.wins) / info.games) * 10000) / 100}%
                  ({info.wins} of {info.games})
                </>
              }
            >
              <div>
                Average Points per Game:{" "}
                {Math.floor(((1.0 * info.points) / info.games) * 100) / 100}
              </div>
              <div style={{ fontSize: "14px" }}>
                Most Common (non-starting) Tech(s):{" "}
                {mostCommonTechs.map((tech) => tech[0]).join(", ")} (
                {Math.floor(((1.0 * topPerc) / info.techGames) * 10000) / 100}%)
              </div>
              <button
                style={{ fontSize: "10px" }}
                onClick={() => setShownModal(id as FactionId)}
              >
                More Stats
              </button>
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
          </>
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
}: {
  objectives: Record<string, ObjectiveInfo>;
  objectiveGames: number;
  objectiveType: ObjectiveType;
}) {
  const intl = useIntl();
  const baseObjectives = getBaseObjectives(intl);
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
            <tr key={objective} style={{ fontFamily: "Myriad Pro" }}>
              <td
                className="flexColumn"
                style={{
                  alignItems: "flex-start",
                  gap: 0,
                  fontFamily: "Slider",
                }}
              >
                <div>{baseObj.name}</div>
                <div style={{ fontFamily: "Myriad Pro", fontSize: "10px" }}>
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
}: {
  techs: Record<string, TechInfo>;
  techGames: number;
  techWins: number;
}) {
  const intl = useIntl();
  const baseTechs = getBaseTechs(intl);
  const orderedTechs = Object.entries(techs).sort((a, b) => {
    return b[1].games - a[1].games;
  });
  return (
    <table style={{ fontSize: "12px", width: "100%" }}>
      <thead style={{ textAlign: "left", fontSize: "14px" }}>
        <th style={{ fontWeight: "normal" }}></th>
        <th style={{ fontWeight: "normal" }}>Research %</th>
        <th style={{ fontWeight: "normal" }}>Win % w/ Tech</th>
        <th style={{ fontWeight: "normal" }}>Win % w/o Tech</th>
      </thead>
      <tbody>
        {orderedTechs.map(([tech, info]) => {
          const baseTech = baseTechs[tech as TechId];
          if (info.games < 3) {
            return null;
          }
          return (
            <tr key={tech} style={{ fontFamily: "Myriad Pro" }}>
              <td style={{ fontFamily: "Slider" }}>{baseTech.name}</td>
              <td>
                {Math.floor(((1.0 * info.games) / techGames) * 10000) / 100}% (
                {info.games} of {techGames})
              </td>
              {info.games < 3 ? (
                <td style={{ fontSize: "10px", fontFamily: "Myriad Pro" }}>
                  -
                </td>
              ) : (
                <td>
                  {Math.floor(((1.0 * info.wins) / info.games) * 10000) / 100}%
                  ({info.wins} of {info.games})
                </td>
              )}
              {techGames - info.games < 3 ? (
                <td style={{ fontSize: "10px", fontFamily: "Myriad Pro" }}>
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TechsSection({ games }: { games: Record<string, StoredGameData> }) {
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
      }
    >
  > = {};
  const baseTechs = getBaseTechs(intl);
  let techGames = 0;
  let factionGames: Partial<Record<FactionId, number>> = {};
  Object.entries(games).forEach(([gameId, game]) => {
    const factions = game.factions;
    const objectives = buildObjectives(game, intl);

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
          };
          if (faction.startswith.techs?.includes(techId)) {
            if (index === 0) {
              tech.ownedWinners++;
            }
            tech.owners++;
          } else {
            if (index === 0) {
              tech.ownedWinners++;
              tech.winners++;
            }
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
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "4px",
                }}
              >
                <div>
                  Average Researchers per Game:{" "}
                  {Math.floor(((1.0 * info.researchers) / numGames) * 100) /
                    100}
                </div>
                {info.owners !== info.researchers ? (
                  <div style={{ fontSize: "14px" }}>
                    Average Owners per Game:{" "}
                    {Math.floor(((1.0 * info.owners) / numGames) * 100) / 100}
                  </div>
                ) : null}
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
}: {
  games: Record<string, StoredGameData>;
}) {
  const [tab, setTab] = useState<ObjectiveType>("STAGE ONE");

  const intl = useIntl();
  let objectivesByScore: Partial<
    Record<
      ObjectiveId,
      {
        games: number;
        scorers: number;
      }
    >
  > = {};
  const baseObjectives = getBaseObjectives(intl);
  let objectiveGames = 0;
  Object.entries(games).forEach(([gameId, game]) => {
    let isObjectiveGame = Object.values(game.objectives ?? {}).reduce(
      (isObjGame, curr) => {
        if ((curr.scorers ?? []).length !== 0) {
          return true;
        }
        return isObjGame;
      },
      false
    );

    if (isObjectiveGame) {
      objectiveGames++;
      Object.entries(game.objectives ?? {}).forEach(([objId, obj]) => {
        const objInfo = objectivesByScore[objId as ObjectiveId] ?? {
          games: 0,
          scorers: 0,
        };
        const baseObj = baseObjectives[objId as ObjectiveId];
        if ((tab !== "SECRET" && !obj.selected) || baseObj.type !== tab) {
          return;
        }
        objInfo.games++;
        let numScorers = (obj.scorers ?? []).length;
        if (tab === "SECRET") {
          numScorers = Math.min(numScorers, 1);
        }
        objInfo.scorers += numScorers;
        objectivesByScore[objId as ObjectiveId] = objInfo;
      });
    }
  });

  const orderedObjectives = Object.entries(objectivesByScore).sort((a, b) => {
    const aGames = tab === "SECRET" ? objectiveGames : a[1].games;
    const aScorePerc = a[1].scorers / aGames;
    const bGames = tab === "SECRET" ? objectiveGames : b[1].games;
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
      </div>

      {orderedObjectives.map(([objId, objInfo]) => {
        return (
          <LabeledDiv key={objId} label={objId}>
            <div style={{ fontFamily: "Myriad Pro", fontSize: "14px" }}>
              {baseObjectives[objId as ObjectiveId].description}
            </div>
            {tab !== "SECRET" ? (
              <div>
                Average Scorers per Game:{" "}
                {Math.floor((objInfo.scorers / objInfo.games) * 100) / 100} - (
                {objInfo.scorers} in {objInfo.games} Games)
              </div>
            ) : (
              <div>
                Scored in{" "}
                {Math.floor((objInfo.scorers / objectiveGames) * 10000) / 100}%
                of games - ({objInfo.scorers} of {objectiveGames})
              </div>
            )}
          </LabeledDiv>
        );
      })}
    </div>
  );
}

function GameDataSection({
  games,
  actionLogs,
}: {
  games: Record<string, StoredGameData>;
  actionLogs: Record<string, ActionLogEntry[]>;
}) {
  const intl = useIntl();
  let shortestGame = Number.MAX_SAFE_INTEGER;
  let longestGame = Number.MIN_SAFE_INTEGER;
  let totalGameLength = 0;
  let numGames = 0;
  let totalRounds = 0;
  let roundGames = 0;
  let objectiveGames = 0;
  let custodianWinners = 0;
  Object.entries(games).forEach(([id, game]) => {
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
    const isObjectiveGame = Object.values(game.objectives ?? {}).reduce(
      (isObjGame, curr) => {
        if ((curr.scorers ?? []).length !== 0) {
          return true;
        }
        return isObjGame;
      },
      false
    );

    if (isObjectiveGame) {
      objectiveGames++;
      const custodiansScorer = ((game.objectives ?? {})["Custodians Token"]
        ?.scorers ?? [])[0];
      if (custodiansScorer) {
        const objectives = buildObjectives(game, intl);
        const winner = orderFactionsByVP(game.factions, objectives)[0];
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

  return (
    <div className="flexColumn" style={{ alignItems: "stretch" }}>
      <div className="flexRow" style={{ justifyContent: "space-between" }}>
        Completed Games:<div>{Object.keys(games).length}</div>
      </div>
      <div className="flexRow" style={{ justifyContent: "space-between" }}>
        Average Game Length:{" "}
        <TimerDisplay
          time={Math.floor(totalGameLength / numGames)}
          width={100}
          style={{ fontSize: "18px" }}
        />
      </div>
      <div className="flexRow" style={{ justifyContent: "space-between" }}>
        Quickest Game:{" "}
        <TimerDisplay
          time={shortestGame}
          width={100}
          style={{ fontSize: "18px" }}
        />
      </div>
      <div className="flexRow" style={{ justifyContent: "space-between" }}>
        Slowest Game:{" "}
        <TimerDisplay
          time={longestGame}
          width={100}
          style={{ fontSize: "18px" }}
        />
      </div>
      <div className="flexRow" style={{ justifyContent: "space-between" }}>
        Average Number of Rounds:{" "}
        <div>{Math.floor((totalRounds / roundGames) * 100) / 100}</div>
      </div>
      <div className="flexRow" style={{ justifyContent: "space-between" }}>
        Win % with Custodians Token:{" "}
        <div>
          {Math.floor((custodianWinners / objectiveGames) * 10000) / 100}%
        </div>
      </div>
    </div>
  );
}
