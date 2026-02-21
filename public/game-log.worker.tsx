import { LogEntryElementProps } from "../src/components/LogEntry";
import {
  buildCompleteObjectives,
  buildCompletePlanets,
  buildCompleteSystems,
  buildCompleteTechs,
} from "../src/data/gameDataBuilder";
import {
  PHASE_BOUNDARIES,
  TURN_BOUNDARIES,
} from "../src/util/api/actionLog";
import { getHandler } from "../src/util/api/gameLog";
import { updateGameData } from "../src/util/api/handler";
import { updateActionLog } from "../src/util/api/update";
import { computeVPsByCategory } from "../src/util/factions";
import { getMapString } from "../src/util/options";
import { ActionLog } from "../src/util/types/types";
import { objectEntries, objectKeys } from "../src/util/util";
import { getTechCountsByType } from "../app/[locale]/game/[gameId]/main/@phase/results/TechGraph";

type WithKey<T> = T & { key: number };

interface RoundInfo {
  planets: Partial<Record<PlanetId, Planet>>;
  systems: Partial<Record<SystemId, System>>;
  mapString?: string;
  techs: Partial<Record<FactionId, Record<TechType, number>>>;
  victoryPoints: Partial<Record<FactionId, Record<ObjectiveType, number>>>;
}

interface TimerData {
  longestTurn: number;
  numTurns: number;
}

interface CondensedGameData {
  annotatedLog: WithKey<LogEntryElementProps>[];
  rounds: Record<number, RoundInfo>;
  timerData: Partial<Record<FactionId, TimerData>>;
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

function buildGameLog(
  initialGameData: StoredGameData,
  reversedActionLog: ActionLog,
  baseData: BaseData,
) {
  const dynamicGameData = structuredClone(initialGameData);

  const rounds: Record<number, RoundInfo> = {};

  const mapOrderedFactions = Object.values(dynamicGameData.factions).sort(
    (a, b) => a.mapPosition - b.mapPosition,
  );
  const techs = buildCompleteTechs(baseData, dynamicGameData);

  const timerData: Partial<Record<FactionId, TimerData>> = {};

  const processedEntries: WithKey<LogEntryElementProps>[] = [];
  reversedActionLog.forEach((logEntry, index) => {
    const currentRound = dynamicGameData.state.round;
    // Initial Round Data
    if (
      logEntry.data.action === "ADVANCE_PHASE" &&
      dynamicGameData.state.phase === "SETUP"
    ) {
      const techs = buildCompleteTechs(baseData, dynamicGameData);

      const initialTechs: Partial<Record<FactionId, Record<TechType, number>>> =
        {};
      const initialPoints: Partial<
        Record<FactionId, Record<ObjectiveType, number>>
      > = {};
      for (const [factionId, faction] of objectEntries(
        dynamicGameData.factions,
      )) {
        initialTechs[factionId] = getTechCountsByType(
          techs,
          faction.startswith?.techs,
        );
        initialPoints[factionId] = {
          "STAGE ONE": 0,
          "STAGE TWO": 0,
          SECRET: 0,
          OTHER: 0,
        };
      }
      rounds[0] = {
        planets: buildCompletePlanets(
          baseData,
          dynamicGameData,
          /* includePurged */ true,
        ),
        systems: buildCompleteSystems(baseData, dynamicGameData),
        mapString: getMapString(
          dynamicGameData.options,
          mapOrderedFactions.length,
        ),
        techs: initialTechs,
        victoryPoints: initialPoints,
      };
    }

    let startTimeSeconds = logEntry.gameSeconds ?? 0;
    let endTimeSeconds = 0;
    const handler = getHandler(dynamicGameData, cleanLogData(logEntry.data));
    if (!handler) {
      return null;
    }
    switch (logEntry.data.action) {
      case "CLAIM_PLANET":
      case "UNCLAIM_PLANET":
      case "RESOLVE_AGENDA":
      case "REPEAL_AGENDA":
      case "SET_SPEAKER":
      case "SET_TYRANT":
      case "SELECT_ACTION":
      case "UNDO":
        updateGameData(dynamicGameData, handler.getUpdates());
        updateActionLog(dynamicGameData, handler, Date.now(), startTimeSeconds);
        break;
      default:
        updateActionLog(dynamicGameData, handler, Date.now(), startTimeSeconds);
        updateGameData(dynamicGameData, handler.getUpdates());
        break;
    }
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
    processedEntries.push({
      key: logEntry.timestampMillis,
      logEntry,
      currRound: dynamicGameData.state.round,
      activePlayer: dynamicGameData.state.activeplayer,
      startTimeSeconds,
      endTimeSeconds,
    });

    if (
      logEntry.data.action === "SELECT_ACTION" &&
      dynamicGameData.state.activeplayer &&
      dynamicGameData.state.activeplayer !== "None"
    ) {
      const factionTimer: TimerData = timerData[
        dynamicGameData.state.activeplayer
      ] ?? {
        longestTurn: 0,
        numTurns: 0,
      };
      factionTimer.numTurns++;
      factionTimer.longestTurn = Math.max(
        factionTimer.longestTurn,
        endTimeSeconds - startTimeSeconds,
      );
      timerData[dynamicGameData.state.activeplayer] = factionTimer;
    }

    if (currentRound !== dynamicGameData.state.round) {
      const objectives = buildCompleteObjectives(baseData, dynamicGameData);
      const points: Partial<Record<FactionId, Record<ObjectiveType, number>>> =
        {};
      const factionTechs: Partial<Record<FactionId, Record<TechType, number>>> =
        {};
      for (const [factionId, faction] of objectEntries(
        dynamicGameData.factions,
      )) {
        const vps = computeVPsByCategory(
          dynamicGameData.factions,
          factionId,
          objectives,
        );
        points[factionId] = vps;
        factionTechs[factionId] = getTechCountsByType(
          techs,
          objectKeys(faction.techs),
        );
      }
      rounds[currentRound] = {
        planets: buildCompletePlanets(
          baseData,
          dynamicGameData,
          /* includePurged */ true,
        ),
        systems: buildCompleteSystems(baseData, dynamicGameData),
        mapString: getMapString(
          dynamicGameData.options,
          mapOrderedFactions.length,
        ),
        techs: factionTechs,
        victoryPoints: points,
      };
    }

    if (processedEntries.length > 0 && processedEntries.length % 25 === 0) {
      self.postMessage({ annotatedLog: processedEntries, rounds, timerData });
    }
  });
  const objectives = buildCompleteObjectives(baseData, dynamicGameData);
  const points: Partial<Record<FactionId, Record<ObjectiveType, number>>> = {};
  const factionTechs: Partial<Record<FactionId, Record<TechType, number>>> = {};
  for (const [factionId, faction] of objectEntries(dynamicGameData.factions)) {
    const vps = computeVPsByCategory(
      dynamicGameData.factions,
      factionId,
      objectives,
    );
    points[factionId] = vps;
    factionTechs[factionId] = getTechCountsByType(
      techs,
      objectKeys(faction.techs),
    );
  }
  rounds[dynamicGameData.state.round] = {
    planets: buildCompletePlanets(
      baseData,
      dynamicGameData,
      /* includePurged */ true,
    ),
    systems: buildCompleteSystems(baseData, dynamicGameData),
    mapString: getMapString(dynamicGameData.options, mapOrderedFactions.length),
    techs: factionTechs,
    victoryPoints: points,
  };

  self.postMessage({ annotatedLog: processedEntries, rounds, timerData });
}

self.onmessage = (event) => {
  buildGameLog(
    event.data.initialGameData,
    event.data.reversedActionLog,
    event.data.baseData,
  );
};

export {};
