import DataManager from "../../context/DataManager";
import { poster } from "./util";

export function updateLocalFactionTimer(
  gameId: string,
  factionId: FactionId,
  factionTimer: number
) {
  DataManager.update((storedGameData) => {
    storedGameData.timers[factionId] = factionTimer;
    return storedGameData;
  });
}

export function saveFactionTimer(
  gameId: string,
  factionId: FactionId,
  factionTimer: number
) {
  const data: TimerUpdateData = {
    action: "SAVE_FACTION_TIMER",
    faction: factionId,
    timer: factionTimer,
  };

  const now = Date.now();
  const timerPromise = poster(`/api/${gameId}/timerUpdate`, data, now);

  DataManager.update((storedGameData) => {
    storedGameData.timers[factionId] = factionTimer;
    return storedGameData;
  });

  return timerPromise;
}

export function updateLocalGameTimer(gameid: string, timer: number) {
  DataManager.update((storedGameData) => {
    storedGameData.timers.game = timer;
    return storedGameData;
  });
}

export function saveGameTimer(gameId: string, timer: number) {
  const data: TimerUpdateData = {
    action: "SET_GAME_TIMER",
    timer: timer,
  };

  const now = Date.now();
  const timerPromise = poster(`/api/${gameId}/timerUpdate`, data, now);

  DataManager.update((storedGameData) => {
    storedGameData.timers.game = timer;
    return storedGameData;
  });

  return timerPromise;
}

export function updateLocalAgendaTimer(
  gameid: string,
  timer: number,
  agendaNum: number
) {
  DataManager.update((storedGameData) => {
    if (agendaNum === 1) {
      storedGameData.timers.firstAgenda = timer;
    } else {
      storedGameData.timers.secondAgenda = timer;
    }
    return storedGameData;
  });
}

export function saveAgendaTimer(
  gameId: string,
  timer: number,
  agendaNum: number
) {
  const data: TimerUpdateData = {
    action: "SAVE_AGENDA_TIMER",
    agendaNum,
    timer,
  };

  const now = Date.now();
  const timerPromise = poster(`/api/${gameId}/timerUpdate`, data, now);

  DataManager.update((storedGameData) => {
    if (agendaNum === 1) {
      storedGameData.timers.firstAgenda = timer;
    } else {
      storedGameData.timers.secondAgenda = timer;
    }
    return storedGameData;
  });

  return timerPromise;
}
