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