import { ReactNode } from "react";
import { PHASE_BOUNDARIES, TURN_BOUNDARIES } from "../../util/api/actionLog";
import { getHandler } from "../../util/api/gameLog";
import { updateGameData } from "../../util/api/handler";
import { LogEntryElement, LogEntryElementProps } from "../LogEntry";

type WithKey<T> = T & { key: number };

function buildGameLog(
  initialGameData: StoredGameData,
  reversedActionLog: ActionLogEntry[]
) {
  const dynamicGameData = structuredClone(initialGameData);

  const processedEntries: WithKey<LogEntryElementProps>[] = [];
  reversedActionLog.forEach((logEntry, index) => {
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
    processedEntries.push({
      key: logEntry.timestampMillis,
      logEntry,
      currRound: dynamicGameData.state.round,
      activePlayer: dynamicGameData.state.activeplayer,
      startTimeSeconds,
      endTimeSeconds,
    });
    if (processedEntries.length > 0 && processedEntries.length % 25 === 0) {
      self.postMessage({ entryData: processedEntries });
    }
  });
  self.postMessage({ entryData: processedEntries });
}

self.onmessage = (event) => {
  buildGameLog(event.data.initialGameData, event.data.reversedActionLog);
};

export {};
