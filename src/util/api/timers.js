import { poster } from "./util";

export function saveFactionTimer(mutate, gameid, timers, factionName, factionTimer) {
  const data = {
    action: "SAVE_FACTION_TIMER",
    faction: factionName,
    timer: factionTimer,
  };

  const updatedTimers = {...timers};

  updatedTimers[factionName] = factionTimer;

  const options = {
    optimisticData: updatedTimers,
  };

  mutate(`/api/${gameid}/timers`, poster(`/api/${gameid}/timerUpdate`, data), options);
}

export function saveGameTimer(mutate, gameid, timers, timer) {
  const data = {
    action: "SET_GAME_TIMER",
    timer: timer,
  };

  const updatedTimers = {...timers};
  updatedTimers.game = timer;

  const options = {
    optimisticData: updatedTimers,
  };

  mutate(`/api/${gameid}/timers`, poster(`/api/${gameid}/timerUpdate`, data), options);
}

export function saveAgendaTimer(mutate, gameid, timers, timer, agendaNum) {
  const data = {
    action: "SAVE_AGENDA_TIMER",
    agendaNum: agendaNum,
    timer: timer,
  };

  const updatedTimers = {...timers};
  if (agendaNum === 1) {
    updatedTimers.firstAgenda = timer;
  } else {
    updatedTimers.secondAgenda = timer;
  }

  const options = {
    optimisticData: updatedTimers,
  };

  mutate(`/api/${gameid}/timers`, poster(`/api/${gameid}/timerUpdate`, data), options);
}

export function resetAgendaTimers(mutate, gameid, timers) {
  const data = {
    action: "RESET_AGENDA_TIMERS",
  };

  const updatedTimers = {...timers};
  updatedTimers.firstAgenda = 0;
  updatedTimers.secondAgenda = 0;

  const options = {
    optimisticData: updatedTimers,
  };

  mutate(`/api/${gameid}/timers`, poster(`/api/${gameid}/timerUpdate`, data), options);
}