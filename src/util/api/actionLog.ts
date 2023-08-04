import { ActionLogEntry } from "./util";

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
export function getCurrentTurnLogEntries(actionLog: ActionLogEntry[]) {
  const currentTurn: ActionLogEntry[] = [];
  for (const logEntry of actionLog) {
    if (TURN_BOUNDARIES.includes(logEntry.data.action)) {
      break;
    }
    currentTurn.push(logEntry);
  }

  currentTurn.reverse();
  return currentTurn;
}

export function getCurrentPhaseLogEntries(actionLog: ActionLogEntry[]) {
  const currentPhase: ActionLogEntry[] = [];
  for (const logEntry of actionLog) {
    if (PHASE_BOUNDARIES.includes(logEntry.data.action)) {
      break;
    }
    currentPhase.push(logEntry);
  }
  currentPhase.reverse();
  return currentPhase;
}

export function getCurrentPhasePreviousLogEntries(actionLog: ActionLogEntry[]) {
  let currentTurn = true;
  const currentPhase: ActionLogEntry[] = [];
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
