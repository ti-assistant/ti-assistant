import { mutate } from "swr";
import { poster } from "./util";

export type TimerUpdateAction =
  | "SET_GAME_TIMER"
  | "SAVE_FACTION_TIMER"
  | "SAVE_AGENDA_TIMER"
  | "RESET_AGENDA_TIMERS";

export interface TimerUpdateData {
  action?: TimerUpdateAction;
  faction?: string;
  timer?: number;
  timestamp?: number;
}

export interface Timers {
  firstAgenda?: number;
  game?: number;
  secondAgenda?: number;
  [key: string]: number | undefined;
}

export function saveFactionTimer(
  gameid: string,
  factionName: string,
  factionTimer: number
) {
  const data: TimerUpdateData = {
    action: "SAVE_FACTION_TIMER",
    faction: factionName,
    timer: factionTimer,
  };

  mutate(
    `/api/${gameid}/timers`,
    async () => await poster(`/api/${gameid}/timerUpdate`, data),
    {
      optimisticData: (timers: Timers) => {
        const updatedTimers = structuredClone(timers);

        updatedTimers[factionName] = factionTimer;

        return updatedTimers;
      },
      revalidate: false,
    }
  );
}

export function saveGameTimer(gameid: string, timer: number) {
  const data: TimerUpdateData = {
    action: "SET_GAME_TIMER",
    timer: timer,
  };

  mutate(
    `/api/${gameid}/timers`,
    async () => await poster(`/api/${gameid}/timerUpdate`, data),
    {
      optimisticData: (timers: Timers) => {
        const updatedTimers = structuredClone(timers);

        updatedTimers.game = timer;

        return updatedTimers;
      },
      revalidate: false,
    }
  );
}

export function saveAgendaTimer(
  gameid: string,
  timer: number,
  agendaNum: number
) {
  const data: TimerUpdateData = {
    action: "SAVE_AGENDA_TIMER",
    timer: timer,
  };

  mutate(
    `/api/${gameid}/timers`,
    async () => await poster(`/api/${gameid}/timerUpdate`, data),
    {
      optimisticData: (timers: Timers) => {
        const updatedTimers = structuredClone(timers);

        if (agendaNum === 1) {
          updatedTimers.firstAgenda = timer;
        } else {
          updatedTimers.secondAgenda = timer;
        }

        return updatedTimers;
      },
      revalidate: false,
    }
  );
}

export function resetAgendaTimers(gameid: string) {
  const data: TimerUpdateData = {
    action: "RESET_AGENDA_TIMERS",
  };

  mutate(
    `/api/${gameid}/timers`,
    async () => await poster(`/api/${gameid}/timerUpdate`, data),
    {
      optimisticData: (timers: Timers) => {
        const updatedTimers = structuredClone(timers);

        updatedTimers.firstAgenda = 0;
        updatedTimers.secondAgenda = 0;

        return updatedTimers;
      },
      revalidate: false,
    }
  );
}