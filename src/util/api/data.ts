import { getCurrentTurnLogEntries } from "./actionLog";
import { isSetSpeakerData } from "../actionLog";

export function getLogEntry(actionLog: ActionLogEntry[], action: string) {
  for (const logEntry of actionLog) {
    if (logEntry.data.action === action) {
      return logEntry;
    }
  }
  return null;
}

function isSelectActionData(data: GameUpdateData): data is SelectActionData {
  return data.action === "SELECT_ACTION";
}

export function getSelectedAction(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SELECT_ACTION");

  if (!entry || !isSelectActionData(entry.data)) {
    return undefined;
  }

  return entry.data.event.action;
}

export function getSelectedActionFromLog(actionLog: ActionLogEntry[]) {
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const entry = getLogEntry(currentTurn, "SELECT_ACTION");

  if (!entry || !isSelectActionData(entry.data)) {
    return undefined;
  }

  return entry.data.event.action;
}

export function getNewSpeaker(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SET_SPEAKER");

  if (!entry || !isSetSpeakerData(entry.data)) {
    return undefined;
  }

  return entry.data.event.newSpeaker;
}

export function getNewSpeakerEvent(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SET_SPEAKER");

  if (!entry || !isSetSpeakerData(entry.data)) {
    return undefined;
  }

  return entry.data.event;
}

export function getNewSpeakerEventFromLog(actionLog: ActionLogEntry[]) {
  const currentTurn = getCurrentTurnLogEntries(actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SET_SPEAKER");

  if (!entry || !isSetSpeakerData(entry.data)) {
    return undefined;
  }

  return entry.data.event;
}
