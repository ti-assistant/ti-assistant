import { Expansion } from "./options";

export type GameVariant = "normal" | "alliance";

export type MapStyle = "standard" | "warp" | "skinny" | "large";

export interface SetupOptions {
  "allow-double-council": boolean;
  "map-string": string;
  "map-style": MapStyle;
  "victory-points": number;
  "game-variant": GameVariant;
  expansions: Set<Expansion>;
  [key: string]: any;
}

export interface SetupFaction {
  alliancePartner?: number;
  color?: string;
  name?: string;
  playerName?: string;
}
