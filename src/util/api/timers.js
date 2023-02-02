import { poster } from "./util";

export function saveFactionTimer(mutate, gameid, factionName, factionTimer) {
  const data = {
    action: "SAVE_FACTION_TIMER",
    faction: factionName,
    timer: factionTimer,
  };

  mutate(`/api/${gameid}/timers`, async () => await poster(`/api/${gameid}/timerUpdate`, data), {
    optimisticData: timers => {
      const updatedTimers = structuredClone(timers);

      updatedTimers[factionName] = factionTimer;

      return updatedTimers;
    },
    revalidate: false,
  });
}

export function saveGameTimer(mutate, gameid, timer) {
  const data = {
    action: "SET_GAME_TIMER",
    timer: timer,
  };

  mutate(`/api/${gameid}/timers`, async () => await poster(`/api/${gameid}/timerUpdate`, data), {
    optimisticData: timers => {
      const updatedTimers = structuredClone(timers);

      updatedTimers.game = timer;

      return updatedTimers;
    },
    revalidate: false,
  });
}

export function saveAgendaTimer(mutate, gameid, timer, agendaNum) {
  const data = {
    action: "SAVE_AGENDA_TIMER",
    agendaNum: agendaNum,
    timer: timer,
  };

  mutate(`/api/${gameid}/timers`, async () => await poster(`/api/${gameid}/timerUpdate`, data), {
    optimisticData: timers => {
      const updatedTimers = structuredClone(timers);

      if (agendaNum === 1) {
        updatedTimers.firstAgenda = timer;
      } else {
        updatedTimers.secondAgenda = timer;
      }

      return updatedTimers;
    },
    revalidate: false,
  });
}

export function resetAgendaTimers(mutate, gameid) {
  const data = {
    action: "RESET_AGENDA_TIMERS",
  };

  mutate(`/api/${gameid}/timers`, async () => await poster(`/api/${gameid}/timerUpdate`, data), {
    optimisticData: timers => {
      const updatedTimers = structuredClone(timers);

      updatedTimers.firstAgenda = 0;
      updatedTimers.secondAgenda = 0;

      return updatedTimers;
    },
    revalidate: false,
  });
}