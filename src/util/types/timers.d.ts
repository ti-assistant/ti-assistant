type TimerUpdateAction =
  | "SET_GAME_TIMER"
  | "SAVE_FACTION_TIMER"
  | "SAVE_AGENDA_TIMER"
  | "RESET_AGENDA_TIMERS";

interface TimerUpdateData {
  timers: Timers;
  timestamp?: number;
}

interface Timers {
  firstAgenda?: number;
  game?: number;
  secondAgenda?: number;
  paused?: boolean;
  [key: string]: Optional<number>;
}
