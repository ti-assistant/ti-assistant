import { getCurrentTurnLogEntries } from "./actionLog";
import { getLogEntries } from "../actionLog";
import { ActionLog } from "../types/types";

export function getSelectedAction(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntries<SelectActionData>(
    currentTurn,
    "SELECT_ACTION"
  )[0];

  if (!entry) {
    return undefined;
  }

  return entry.data.event.action;
}

export function getSelectedActionFromLog(actionLog: ActionLog) {
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const entry = getLogEntries<SelectActionData>(
    currentTurn,
    "SELECT_ACTION"
  )[0];

  if (!entry) {
    return undefined;
  }

  return entry.data.event.action;
}

export function getNewSpeakerEventFromLog(actionLog: ActionLog) {
  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const entry = getLogEntries<SetSpeakerData>(currentTurn, "SET_SPEAKER")[0];

  if (!entry) {
    return undefined;
  }

  return entry.data.event;
}
