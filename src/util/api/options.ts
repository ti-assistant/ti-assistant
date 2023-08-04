import { mutate } from "swr";
import { poster } from "./util";

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
  [key: string]: any;
}
