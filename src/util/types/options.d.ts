type Expansion =
  | "BASE"
  | "POK"
  | "CODEX ONE"
  | "CODEX TWO"
  | "CODEX THREE"
  | "DISCORDANT STARS"
  | "BASE ONLY";

type OptionUpdateAction = "SET_OPTION";

interface OptionUpdateData {
  action?: OptionUpdateAction;
  option?: string;
  timestamp?: number;
  value?: any;
}

interface Options {
  expansions: Expansion[];
  "allow-double-council": boolean;
  "display-objective-description"?: boolean;
  "game-variant": GameVariant;
  "map-string"?: string;
  "map-style": MapStyle;
  "victory-points": number;
  [key: string]: any;
}
