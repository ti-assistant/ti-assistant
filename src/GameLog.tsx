import { useRouter } from "next/router";
import { useMemo } from "react";
import useSWR from "swr";
import { LogEntryElement } from "./components/LogEntry";
import { buildCompleteGameData, useGameData } from "./data/GameData";
import { PHASE_BOUNDARIES, TURN_BOUNDARIES } from "./util/api/actionLog";
import { getHandler } from "./util/api/gameLog";
import { updateGameData } from "./util/api/handler";
import { fetcher } from "./util/api/util";
import { responsivePixels } from "./util/util";

let BASE_FACTIONS: Partial<Record<FactionId, BaseFaction>> = {};
import("../server/data/factions").then((module) => {
  BASE_FACTIONS = module.BASE_FACTIONS;
});

let BASE_PLANETS: Partial<Record<PlanetId, BasePlanet>> = {};
import("../server/data/planets").then((module) => {
  BASE_PLANETS = module.BASE_PLANETS;
});

function buildInitialGameData(setupData: {
  factions: SetupFaction[];
  speaker: number;
  options: Options;
}) {
  console.log(setupData.factions);
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
      const baseFaction = BASE_FACTIONS[faction.id];
      if (!baseFaction) {
        return {
          // Client specified values
          name: faction.name,
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
  let speakerName: FactionId | undefined;
  gameFactions.forEach((faction, index) => {
    if (index === setupData.speaker) {
      speakerName = faction.name as FactionId;
    }
    const localFaction = { ...faction };
    if (
      faction.name === "Winnu" &&
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
    baseFactions[faction.name as FactionId] = localFaction;
    Object.entries(faction.planets).forEach(([name, planet]) => {
      basePlanets[name as PlanetId] = {
        ...planet,
        owner: faction.name as FactionId,
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

  if (!speakerName) {
    throw new Error("No speaker selected.");
  }

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 180);

  const gameState: StoredGameData = {
    state: {
      speaker: speakerName,
      phase: "SETUP",
      round: 1,
    },
    factions: baseFactions,
    planets: basePlanets,
    options: setupData.options,
    objectives: baseObjectives,
  };

  return gameState;
}

function buildSetupGameData(gameData: GameData): {
  factions: SetupFaction[];
  speaker: number;
  options: Options;
} {
  const actionLog = gameData.actionLog ?? [];
  let speaker = 0;
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

export function GameLog({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: storedActionLog }: { data?: ActionLogEntry[] } = useSWR(
    gameid ? `/api/${gameid}/actionLog` : null,
    fetcher
  );
  const gameData = useGameData(gameid, []);

  const reversedActionLog = useMemo(() => {
    const actionLog = storedActionLog ?? [];
    return [...actionLog].reverse();
  }, [storedActionLog]);

  const setupGameData = useMemo(() => {
    return buildSetupGameData(gameData);
  }, [gameData]);

  const initialGameData = useMemo(() => {
    return buildInitialGameData(setupGameData);
  }, [setupGameData]);

  const dynamicGameData = useMemo(() => {
    return buildCompleteGameData(initialGameData);
  }, [initialGameData]);

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        height: responsivePixels(440),
        overflow: "auto",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {reversedActionLog.map((logEntry, index) => {
        let startTimeSeconds = logEntry.gameSeconds ?? 0;
        let endTimeSeconds = 0;
        const handler = getHandler(dynamicGameData, logEntry.data);
        if (!handler) {
          return null;
        }
        updateGameData(dynamicGameData, handler.getUpdates());
        switch (logEntry.data.action) {
          case "ADVANCE_PHASE": {
            for (let i = index + 1; i < reversedActionLog.length; i++) {
              const nextEntry = reversedActionLog[i];
              if (!nextEntry) {
                break;
              }
              if (PHASE_BOUNDARIES.includes(nextEntry.data.action)) {
                endTimeSeconds = nextEntry.gameSeconds ?? 0;
                break;
              }
            }
            break;
          }
          case "SELECT_ACTION": {
            // Set to end of previous turn.
            for (let i = index - 1; i > 0; i--) {
              const prevEntry = reversedActionLog[i];
              if (!prevEntry) {
                break;
              }
              if (TURN_BOUNDARIES.includes(prevEntry.data.action)) {
                startTimeSeconds = prevEntry.gameSeconds ?? 0;
                break;
              }
            }
            // Intentional fall-through.
          }
          case "REVEAL_AGENDA": {
            for (let i = index + 1; i < reversedActionLog.length; i++) {
              const nextEntry = reversedActionLog[i];
              if (!nextEntry) {
                break;
              }
              if (TURN_BOUNDARIES.includes(nextEntry.data.action)) {
                endTimeSeconds = nextEntry.gameSeconds ?? 0;
                break;
              }
            }
            break;
          }
          case "ASSIGN_STRATEGY_CARD": {
            for (let i = index - 1; i > 0; i--) {
              const prevEntry = reversedActionLog[i];
              if (!prevEntry) {
                break;
              }
              if (TURN_BOUNDARIES.includes(prevEntry.data.action)) {
                startTimeSeconds = prevEntry.gameSeconds ?? 0;
                endTimeSeconds = logEntry.gameSeconds ?? 0;
                break;
              }
            }
          }
        }
        return (
          <LogEntryElement
            key={logEntry.timestampMillis}
            logEntry={logEntry}
            currRound={dynamicGameData.state.round}
            activePlayer={dynamicGameData.state.activeplayer}
            startTimeSeconds={startTimeSeconds}
            endTimeSeconds={endTimeSeconds}
          />
        ); // if (logEntry.phase && logEntry.phase !== prevPhase) {
        //   prevPhase = logEntry.phase;
        //   if (logEntry.phase === "STRATEGY") {
        //     currRound++;
        //   }
        //   const output = (
        //     <React.Fragment key={index}>
        //       <LabeledLine
        //         label={
        //           currRound !== 0
        //             ? `Round ${currRound} ${capitalizeFirstLetter(
        //                 logEntry.phase.toLowerCase()
        //               )} Phase`
        //             : `${capitalizeFirstLetter(
        //                 logEntry.phase.toLowerCase()
        //               )} Phase`
        //         }
        //         style={{ width: "calc(100% - 8px)" }}
        //       />
        //       <LogEntryElement logEntry={logEntry} prevEntry={prevEntry} />
        //     </React.Fragment>
        //   );
        //   prevEntry = logEntry;
        //   return output;
        // }
        // const output = (
        //   <LogEntryElement
        //     key={index}
        //     logEntry={logEntry}
        //     prevEntry={prevEntry}
        //   />
        // );
        // prevEntry = logEntry;
        // return output;
      })}
    </div>
  );
}
