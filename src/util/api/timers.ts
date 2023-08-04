import { mutate } from "swr";
import { StoredGameData, poster } from "./util";

export type TimerUpdateAction =
  | "SET_GAME_TIMER"
  | "SAVE_FACTION_TIMER"
  | "SAVE_AGENDA_TIMER"
  | "RESET_AGENDA_TIMERS";

export interface TimerUpdateData {
  action?: TimerUpdateAction;
  agendaNum?: number;
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

export function updateLocalFactionTimer(
  gameid: string,
  factionName: string,
  factionTimer: number
) {
  mutate(
    `/api/${gameid}/timers`,
    (timers: Record<string, number>) => {
      if (!timers) {
        timers = {};
      }

      timers[factionName] = factionTimer;

      return structuredClone(timers);
    },
    {
      revalidate: false,
    }
  );
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
      optimisticData: (timers: Record<string, number>) => {
        if (!timers) {
          timers = {};
        }

        timers[factionName] = factionTimer;

        return structuredClone(timers);
      },
      revalidate: false,
    }
  );
}

export function updateLocalGameTimer(gameid: string, timer: number) {
  mutate(
    `/api/${gameid}/timers`,
    (timers: Record<string, number>) => {
      if (!timers) {
        timers = {};
      }

      timers.game = timer;

      return structuredClone(timers);
    },
    {
      revalidate: false,
    }
  );
}

export function saveGameTimer(gameId: string, timer: number) {
  const data: TimerUpdateData = {
    action: "SET_GAME_TIMER",
    timer: timer,
  };

  mutate(
    `/api/${gameId}/timers`,
    async () => await poster(`/api/${gameId}/timerUpdate`, data),
    {
      optimisticData: (timers: Record<string, number>) => {
        if (!timers) {
          timers = {};
        }

        timers.game = timer;

        return structuredClone(timers);
      },
      revalidate: false,
    }
  );
}

export function updateLocalAgendaTimer(
  gameid: string,
  timer: number,
  agendaNum: number
) {
  mutate(
    `/api/${gameid}/timers`,
    (timers: Record<string, number>) => {
      if (!timers) {
        timers = {};
      }

      if (agendaNum === 1) {
        timers.firstAgenda = timer;
      } else {
        timers.secondAgenda = timer;
      }

      return structuredClone(timers);
    },
    {
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
    agendaNum,
    timer,
  };

  mutate(
    `/api/${gameid}/timers`,
    async () => await poster(`/api/${gameid}/timerUpdate`, data),
    {
      optimisticData: (timers: Record<string, number>) => {
        if (!timers) {
          timers = {};
        }

        if (agendaNum === 1) {
          timers.firstAgenda = timer;
        } else {
          timers.secondAgenda = timer;
        }

        return structuredClone(timers);
      },
      revalidate: false,
    }
  );
}
