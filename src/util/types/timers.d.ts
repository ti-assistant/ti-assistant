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
