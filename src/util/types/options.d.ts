type Expansion =
  | "BASE"
  | "POK"
  | "CODEX ONE"
  | "CODEX TWO"
  | "CODEX THREE"
  | "DISCORDANT STARS"
  | "BASE ONLY";

type Scenario = "AGE_OF_EXPLORATION";

type OptionUpdateAction = "SET_OPTION";

interface OptionUpdateData {
  action?: OptionUpdateAction;
  option?: string;
  timestamp?: number;
  value?: any;
}

interface Options {
  expansions: Expansion[];
  "display-objective-description"?: boolean;
  "game-variant": GameVariant;
  mallice?: string;
  // The processed map string.
  "processed-map-string"?: string;
  // The string displayed to the user in map-string fields.
  "map-string"?: string;
  "map-style": MapStyle;
  "victory-points": number;
  scenario?: Scenario;
  [key: string]: any;
}
