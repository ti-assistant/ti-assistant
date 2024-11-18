import { useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import Toggle from "../../../../../../src/components/Toggle/Toggle";
import {
  useActionLog,
  useFactions,
  useGameData,
} from "../../../../../../src/context/dataHooks";
import { getBaseData } from "../../../../../../src/data/baseData";
import { buildObjectives } from "../../../../../../src/data/gameDataBuilder";
import { getHandler } from "../../../../../../src/util/api/gameLog";
import { updateGameData } from "../../../../../../src/util/api/handler";
import {
  computeVPsByCategory,
  getFactionColor,
} from "../../../../../../src/util/factions";
import { Optional } from "../../../../../../src/util/types/types";
import {
  objectEntries,
  objectKeys,
  rem,
} from "../../../../../../src/util/util";
import Graph, { Line } from "./Graph";

export function VictoryPointsGraph({}) {
  const storedActionLog = useActionLog();
  const factions = useFactions();
  const intl = useIntl();
  const gameData = useGameData();

  const [types, setTypes] = useState<Set<ObjectiveType>>(
    new Set(["STAGE ONE", "STAGE TWO", "SECRET", "OTHER"])
  );

  const reversedActionLog = useMemo(() => {
    const actionLog = storedActionLog ?? [];
    return [...actionLog].reverse();
  }, [storedActionLog]);

  const setupGameData = useMemo(() => {
    return buildSetupGameData(gameData);
  }, [gameData]);

  const initialGameData = useMemo(() => {
    return buildInitialGameData(setupGameData, intl);
  }, [setupGameData, intl]);

  const vpsPerRound = useMemo(() => {
    const dynamicGameData = structuredClone(initialGameData);
    const rounds: Record<
      number,
      Partial<Record<FactionId, Record<ObjectiveType, number>>>
    > = {};
    const initialPoints: Partial<
      Record<FactionId, Record<ObjectiveType, number>>
    > = {};
    for (const factionId of objectKeys(dynamicGameData.factions)) {
      initialPoints[factionId] = {
        "STAGE ONE": 0,
        "STAGE TWO": 0,
        SECRET: 0,
        OTHER: 0,
      };
    }
    rounds[0] = initialPoints;
    for (const logEntry of reversedActionLog) {
      const currentRound = dynamicGameData.state.round;
      const handler = getHandler(dynamicGameData, cleanLogData(logEntry.data));
      if (!handler) {
        console.log("Handler not found", logEntry);
        return {};
      }
      updateGameData(dynamicGameData, handler.getUpdates());
      if (currentRound !== dynamicGameData.state.round) {
        const objectives = buildObjectives(dynamicGameData, getBaseData(intl));
        const points: Partial<
          Record<FactionId, Record<ObjectiveType, number>>
        > = {};
        for (const factionId of objectKeys(dynamicGameData.factions)) {
          const vps = computeVPsByCategory(
            dynamicGameData.factions,
            factionId,
            objectives
          );
          points[factionId] = vps;
        }
        rounds[currentRound] = points;
      }
    }
    const objectives = buildObjectives(dynamicGameData, getBaseData(intl));
    const points: Partial<Record<FactionId, Record<ObjectiveType, number>>> =
      {};
    for (const factionId of objectKeys(dynamicGameData.factions)) {
      const vps = computeVPsByCategory(
        dynamicGameData.factions,
        factionId,
        objectives
      );
      points[factionId] = vps;
    }
    rounds[dynamicGameData.state.round] = points;
    return rounds;
  }, [initialGameData, reversedActionLog]);

  console.log("VPs per round", vpsPerRound);

  const numRounds = objectKeys(vpsPerRound).length;
  const maxPoints = Object.values(vpsPerRound).reduce((max, curr) => {
    return Math.max(
      max,
      Object.values(curr).reduce((innerMax, innerCurr) => {
        return Math.max(
          innerMax,
          objectEntries(innerCurr).reduce((total, [type, vps]) => {
            // if (!types.has(type)) {
            //   return total;
            // }
            return total + vps;
          }, 0)
        );
      }, 0)
    );
  }, 0);

  const lines: Line[] = useMemo(() => {
    const factionLines: Partial<Record<FactionId, Line>> = {};
    for (const [roundNum, round] of objectEntries(vpsPerRound)) {
      for (const [factionId, vps] of objectEntries(round)) {
        const line = factionLines[factionId] ?? {
          color: getFactionColor(factions[factionId]),
          points: [],
        };
        const points = objectEntries(vps).reduce((total, [type, num]) => {
          if (!types.has(type)) {
            return total;
          }
          return total + num;
        }, 0);
        line.points.push({ x: roundNum, y: points });
        factionLines[factionId] = line;
      }
    }
    return Object.values(factionLines);
  }, [types, vpsPerRound]);
  return (
    <>
      <div
        className="flexColumn"
        style={{
          width: "fit-content",
          height: rem(450),
          justifyContent: "flex-start",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <div
          className="flexRow"
          style={{ width: "fit-content", height: "100%" }}
        >
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <Toggle
              selected={types.has("STAGE ONE")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("STAGE ONE");
                  } else {
                    newSet.add("STAGE ONE");
                  }
                  return newSet;
                });
              }}
            >
              Stage I
            </Toggle>
            <Toggle
              selected={types.has("STAGE TWO")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("STAGE TWO");
                  } else {
                    newSet.add("STAGE TWO");
                  }
                  return newSet;
                });
              }}
            >
              Stage II
            </Toggle>
            <Toggle
              selected={types.has("SECRET")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("SECRET");
                  } else {
                    newSet.add("SECRET");
                  }
                  return newSet;
                });
              }}
            >
              Secrets
            </Toggle>
            <Toggle
              selected={types.has("OTHER")}
              toggleFn={(prev) => {
                setTypes((types) => {
                  const newSet = new Set(types);
                  if (prev) {
                    newSet.delete("OTHER");
                  } else {
                    newSet.add("OTHER");
                  }
                  return newSet;
                });
              }}
            >
              Other
            </Toggle>
          </div>
          <Graph xAxis={numRounds - 1} yAxis={maxPoints} lines={lines} />
        </div>
      </div>
      <div className="flexRow" style={{ width: "100%" }}>
        Rounds
      </div>
    </>
  );
}

function cleanLogData(data: GameUpdateData) {
  const cleanData = data;
  switch (cleanData.action) {
    case "ASSIGN_STRATEGY_CARD":
      const id = cleanData.event.id;
      if (!id) {
        cleanData.event.id = (cleanData.event as any).name;
      }
      break;
  }
  return cleanData;
}

let getBaseFactions: DataFunction<FactionId, BaseFaction> = () => {
  return {};
};
import("../../../../../../server/data/factions").then((module) => {
  getBaseFactions = module.getBaseFactions;
});

let BASE_PLANETS: Partial<Record<PlanetId, BasePlanet>> = {};
import("../../../../../../server/data/planets").then((module) => {
  BASE_PLANETS = module.BASE_PLANETS;
});

function buildInitialGameData(
  setupData: {
    factions: SetupFaction[];
    speaker: number;
    options: Options;
  },
  intl: IntlShape
) {
  const gameFactions: GameFaction[] = setupData.factions.map(
    (faction, index) => {
      if (!faction.name || !faction.color || !faction.id) {
        throw new Error("Faction missing name or color.");
      }
      // Determine speaker order for each faction.
      let order: number;
      if (index >= setupData.speaker) {
        order = index - setupData.speaker + 1;
      } else {
        order = index + setupData.factions.length - setupData.speaker + 1;
      }

      // Get home planets for each faction.
      // TODO(jboman): Handle Council Keleres choosing between Mentak, Xxcha, and Argent Flight.
      const homeBasePlanets = Object.values(BASE_PLANETS).filter(
        (planet) => planet.faction === faction.name && planet.home
      );
      const homePlanets: Partial<Record<PlanetId, { ready: boolean }>> = {};
      homeBasePlanets.forEach((planet) => {
        homePlanets[planet.id] = {
          ready: true,
        };
      });

      // Get starting techs for each faction.
      const baseFaction = getBaseFactions(intl)[faction.id];
      if (!baseFaction) {
        return {
          // Client specified values
          name: faction.name,
          id: faction.id,
          color: faction.color,
          playerName: faction.playerName,
          order: order,
          mapPosition: index,
          // Faction specific values
          planets: homePlanets,
          techs: {},
          startswith: { units: {} },
          // State values
          hero: "locked",
          commander: "locked",
        };
      }
      const startingTechs: Partial<Record<TechId, { ready: boolean }>> = {};
      (baseFaction.startswith.techs ?? []).forEach((tech) => {
        startingTechs[tech] = {
          ready: true,
        };
      });

      return {
        // Client specified values
        name: faction.name,
        id: faction.id,
        color: faction.color,
        playerName: faction.playerName,
        order: order,
        mapPosition: index,
        // Faction specific values
        planets: homePlanets,
        techs: startingTechs,
        startswith: baseFaction.startswith,
        // State values
        hero: "locked",
        commander: "locked",
      };
    }
  );

  let baseFactions: Partial<Record<FactionId, GameFaction>> = {};
  let basePlanets: Partial<Record<PlanetId, GamePlanet>> = {};
  let speakerName: Optional<FactionId>;
  gameFactions.forEach((faction, index) => {
    if (index === setupData.speaker) {
      speakerName = faction.id;
    }
    const localFaction = { ...faction };
    if (
      faction.id === "Winnu" &&
      !setupData.options.expansions.includes("POK")
    ) {
      localFaction.startswith.choice = {
        select: 1,
        options: [
          "Neural Motivator",
          "Sarween Tools",
          "Antimass Deflectors",
          "Plasma Scoring",
        ],
      };
    }
    baseFactions[faction.id] = localFaction;
    Object.entries(faction.planets).forEach(([name, planet]) => {
      basePlanets[name as PlanetId] = {
        ...planet,
        owner: faction.id,
      };
    });
  });

  let baseObjectives: Partial<Record<ObjectiveId, GameObjective>> = {
    "Custodians Token": {
      selected: true,
    },
    "Imperial Point": {
      selected: true,
    },
    "Support for the Throne": {
      selected: true,
    },
  };

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 180);

  const gameState: StoredGameData = {
    state: {
      speaker: speakerName ?? "Vuil'raith Cabal",
      phase: "SETUP",
      round: 1,
    },
    factions: baseFactions,
    planets: basePlanets,
    options: setupData.options,
    objectives: baseObjectives,
    sequenceNum: 1,
  };

  return gameState;
}

function buildSetupGameData(gameData: GameData): {
  factions: SetupFaction[];
  speaker: number;
  options: Options;
} {
  const actionLog = gameData.actionLog ?? [];
  let speaker = 1;
  for (let i = actionLog.length - 1; i >= 0; i--) {
    const entry = actionLog[i];
    if (entry?.data.action === "ASSIGN_STRATEGY_CARD") {
      const initialSpeaker = gameData.factions[entry.data.event.pickedBy];
      if (initialSpeaker) {
        speaker = initialSpeaker.mapPosition;
        break;
      }
    }
  }

  const factions: SetupFaction[] = [];
  for (const faction of Object.values(gameData.factions)) {
    factions[faction.mapPosition] = {
      color: faction.color,
      name: faction.id,
      id: faction.id,
      playerName: faction.playerName,
    };
  }

  return {
    factions: factions,
    speaker: speaker,
    options: gameData.options,
  };
}
