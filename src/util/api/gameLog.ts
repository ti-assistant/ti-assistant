import { Phase } from "./state";
import { AssignStrategyCardEvent, TurnData } from "./subState";

export interface LogEntry {
  activeFaction?: string;
  time: number;
  gameSeconds?: number;
  phase?: Phase;
  turnData?: TurnData;
  strategyCards?: AssignStrategyCardEvent[];
  [key: string]: any;
}
