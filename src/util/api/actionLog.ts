import { ActionLog } from "../types/types";

export const TURN_BOUNDARIES = [
  "ASSIGN_STRATEGY_CARD",
  "ADVANCE_PHASE",
  "END_TURN",
  "HIDE_AGENDA",
  "RESOLVE_AGENDA",
  "END_GAME",
];

export const PHASE_BOUNDARIES = ["ADVANCE_PHASE", "END_GAME"];

// Assumes that the actionLog is sorted from newest to oldest.
// Gets the log entries for the current turn - stopping at turn boundaries.
// The returned elements will be reversed so that the oldest is first.
export function getCurrentTurnLogEntries(actionLog: ActionLog) {
  const currentTurn: ActionLog = [];
  for (const logEntry of actionLog) {
    // Shouldn't consider it turn end if in Action Phase.
    if (
      logEntry.data.action === "RESOLVE_AGENDA" &&
      logEntry.data.event.phase === "ACTION"
    ) {
      currentTurn.push(logEntry);
      continue;
    }
    if (TURN_BOUNDARIES.includes(logEntry.data.action)) {
      break;
    }
    currentTurn.push(logEntry);
  }

  currentTurn.reverse();
  return currentTurn;
}

export function getCurrentPhaseLogEntries(actionLog: ActionLog) {
  const currentPhase: ActionLog = [];
  for (const logEntry of actionLog) {
    if (PHASE_BOUNDARIES.includes(logEntry.data.action)) {
      break;
    }
    currentPhase.push(logEntry);
  }
  currentPhase.reverse();
  return currentPhase;
}

export function getCurrentPhasePreviousLogEntries(actionLog: ActionLog) {
  let currentTurn = true;
  const currentPhase: ActionLog = [];
  for (const logEntry of actionLog) {
    if (TURN_BOUNDARIES.includes(logEntry.data.action)) {
      currentTurn = false;
    }

    if (currentTurn) {
      continue;
    }

    if (PHASE_BOUNDARIES.includes(logEntry.data.action)) {
      break;
    }
    currentPhase.push(logEntry);
  }
  currentPhase.reverse();
  return currentPhase;
}

export function getNthMostRecentAction(
  actionLog: ActionLog,
  action: ActionLogEntry<GameUpdateData>["data"]["action"],
  num: number
) {
  let count = 1;
  for (const logEntry of actionLog) {
    if (logEntry.data.action === action) {
      if (count === num) {
        return logEntry;
      }
      count++;
    }
    if (PHASE_BOUNDARIES.includes(logEntry.data.action)) {
      break;
    }
  }
  return;
}

export function getFinalActionOfPreviousTurn(actionLog: ActionLog) {
  for (const logEntry of actionLog) {
    if (
      TURN_BOUNDARIES.includes(logEntry.data.action) &&
      logEntry.data.action !== "RESOLVE_AGENDA"
    ) {
      return logEntry;
    }
  }

  return;
}
