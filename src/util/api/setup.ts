import { Expansion } from "./options";

export type MapStyle = "standard" | "warp" | "skinny" | "large";

export interface SetupOptions {
  "allow-double-council": boolean;
  "map-string": string;
  "map-style": MapStyle;
  "victory-points": number;
  expansions: Set<Expansion>;
  [key: string]: any;
}

export interface SetupFaction {
  color?: string;
  name?: string;
  playerName?: string;
}
