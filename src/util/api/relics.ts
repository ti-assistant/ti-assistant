import { mutate } from "swr";
import { ComponentState, Timing } from "./components";
import { Expansion } from "./options";
import { poster } from "./util";
import { scoreObjective, unscoreObjective } from "./scoreObjective";

export interface BaseRelic {
  description: string;
  expansion: Expansion;
  name: string;
  timing: Timing;
}

export interface GameRelic {
  owner?: string;
  state?: ComponentState;
}

export type Relic = BaseRelic & GameRelic;

export type RelicUpdateAction = "GAIN_RELIC" | "LOSE_RELIC" | "USE_RELIC";

export interface RelicUpdateData {
  action?: RelicUpdateAction;
  faction?: string;
  relic?: string;
  timestamp?: number;
}
