
type TimerUpdateAction =
  | "SET_GAME_TIMER"
  | "SAVE_FACTION_TIMER"
  | "SAVE_AGENDA_TIMER"
  | "RESET_AGENDA_TIMERS";

interface TimerUpdateData {
  action?: TimerUpdateAction;
  agendaNum?: number;
  faction?: string;
  timer?: number;
  timestamp?: number;
}

interface Timers {
  firstAgenda?: number;
  game?: number;
  secondAgenda?: number;
  [key: string]: number | undefined;
}s