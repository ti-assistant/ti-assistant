import { mutate } from "swr";
import { poster } from "./util";
import { MapStyle, GameVariant } from "./setup";

export type Expansion =
  | "BASE"
  | "POK"
  | "CODEX ONE"
  | "CODEX TWO"
  | "CODEX THREE"
  | "DISCORDANT STARS"
  | "BASE ONLY";

export type OptionUpdateAction = "SET_OPTION";

export interface OptionUpdateData {
  action?: OptionUpdateAction;
  option?: string;
  timestamp?: number;
  value?: any;
}

export interface Options {
  expansions: Expansion[];
  "map-string"?: string;
  "allow-double-council": boolean;
  "map-style": MapStyle;
  "victory-points": number;
  "game-variant": GameVariant;
  [key: string]: any;
}
