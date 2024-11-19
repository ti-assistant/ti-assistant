import { IntlShape } from "react-intl";
import { LogEntryElementProps } from "../components/LogEntry";
import { getBaseData } from "../data/baseData";
import {
  buildObjectives,
  buildPlanets,
  buildTechs,
} from "../data/gameDataBuilder";
import { PHASE_BOUNDARIES, TURN_BOUNDARIES } from "../util/api/actionLog";
import { getHandler } from "../util/api/gameLog";
import { updateGameData } from "../util/api/handler";
import { updateActionLog } from "../util/api/update";
import { getMapString } from "../util/options";
import { getTechCountsByType } from "../../app/game/[gameId]/main/@phase/results/TechGraph";
import { objectEntries, objectKeys } from "../util/util";
import { computeVPsByCategory } from "../util/factions";

type WithKey<T> = T & { key: number };

interface RoundInfo {
  planets: Partial<Record<PlanetId, Planet>>;
  mapString?: string;
  techs: Partial<Record<FactionId, Record<TechType, number>>>;
  victoryPoints: Partial<Record<FactionId, Record<ObjectiveType, number>>>;
}

interface CondensedGameData {
  annotatedLog: WithKey<LogEntryElementProps>[];
  rounds: Record<number, RoundInfo>;
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
  reversedActionLog: ActionLogEntry[],
  baseData: BaseData
) {
  const dynamicGameData = structuredClone(initialGameData);

  const rounds: Record<number, RoundInfo> = {};

  const mapOrderedFactions = Object.values(dynamicGameData.factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  const techs = buildTechs(dynamicGameData, baseData);

  const processedEntries: WithKey<LogEntryElementProps>[] = [];
  reversedActionLog.forEach((logEntry, index) => {
    const currentRound = dynamicGameData.state.round;
    // Initial Round Data
    if (
      logEntry.data.action === "ADVANCE_PHASE" &&
      dynamicGameData.state.phase === "SETUP"
    ) {
      const techs = buildTechs(dynamicGameData, baseData);

      const initialTechs: Partial<Record<FactionId, Record<TechType, number>>> =
        {};
      const initialPoints: Partial<
        Record<FactionId, Record<ObjectiveType, number>>
      > = {};
      for (const [factionId, faction] of objectEntries(
        dynamicGameData.factions
      )) {
        initialTechs[factionId] = getTechCountsByType(
          techs,
          faction.startswith.techs
        );
        initialPoints[factionId] = {
          "STAGE ONE": 0,
          "STAGE TWO": 0,
          SECRET: 0,
          OTHER: 0,
        };
      }
      rounds[0] = {
        planets: buildPlanets(dynamicGameData, baseData),
        mapString: getMapString(
          dynamicGameData.options,
          mapOrderedFactions.length
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
      case "SELECT_ACTION":
      case "UNDO":
        updateGameData(dynamicGameData, handler.getUpdates());
        updateActionLog(dynamicGameData, handler, Date.now());
        break;
      default:
        updateActionLog(dynamicGameData, handler, Date.now());
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
        if (logEntry.data.event.action === "Imperial") {
          console.log("Active Player", dynamicGameData.state.activeplayer);
          console.log(
            "Mecatol Owner",
            dynamicGameData.planets["Mecatol Rex"]?.owner
          );
          console.log(
            "IP",
            (dynamicGameData.objectives ?? {})["Imperial Point"]
          );
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

    if (currentRound !== dynamicGameData.state.round) {
      const objectives = buildObjectives(dynamicGameData, baseData);
      const points: Partial<Record<FactionId, Record<ObjectiveType, number>>> =
        {};
      const factionTechs: Partial<Record<FactionId, Record<TechType, number>>> =
        {};
      for (const [factionId, faction] of objectEntries(
        dynamicGameData.factions
      )) {
        const vps = computeVPsByCategory(
          dynamicGameData.factions,
          factionId,
          objectives
        );
        points[factionId] = vps;
        factionTechs[factionId] = getTechCountsByType(
          techs,
          objectKeys(faction.techs)
        );
      }
      rounds[currentRound] = {
        planets: buildPlanets(dynamicGameData, baseData),
        mapString: getMapString(
          dynamicGameData.options,
          mapOrderedFactions.length
        ),
        techs: factionTechs,
        victoryPoints: points,
      };
    }

    if (processedEntries.length > 0 && processedEntries.length % 25 === 0) {
      self.postMessage({ annotatedLog: processedEntries, rounds: rounds });
    }
  });
  const objectives = buildObjectives(dynamicGameData, baseData);
  const points: Partial<Record<FactionId, Record<ObjectiveType, number>>> = {};
  const factionTechs: Partial<Record<FactionId, Record<TechType, number>>> = {};
  for (const [factionId, faction] of objectEntries(dynamicGameData.factions)) {
    const vps = computeVPsByCategory(
      dynamicGameData.factions,
      factionId,
      objectives
    );
    points[factionId] = vps;
    factionTechs[factionId] = getTechCountsByType(
      techs,
      objectKeys(faction.techs)
    );
  }
  rounds[dynamicGameData.state.round] = {
    planets: buildPlanets(dynamicGameData, baseData),
    mapString: getMapString(dynamicGameData.options, mapOrderedFactions.length),
    techs: factionTechs,
    victoryPoints: points,
  };

  self.postMessage({ annotatedLog: processedEntries, rounds: rounds });
}

self.onmessage = (event) => {
  buildGameLog(
    event.data.initialGameData,
    event.data.reversedActionLog,
    event.data.baseData
  );
};

export {};
