type Expansion =
  | "BASE"
  | "POK"
  | "CODEX ONE"
  | "CODEX TWO"
  | "CODEX THREE"
  | "CODEX FOUR"
  | "DISCORDANT STARS"
  | "BASE ONLY";

type EventId =
  | "Age of Commerce"
  | "Age of Exploration"
  | "Minor Factions"
  | "Total War";

type OptionUpdateAction = "SET_OPTION";

interface OptionUpdateData {
  action?: OptionUpdateAction;
  option?: string;
  timestamp?: number;
  value?: any;
}

interface Options {
  expansions: Expansion[];
  "game-variant": GameVariant;
  mallice?: string;
  // The processed map string.
  "processed-map-string"?: string;
  // The string displayed to the user in map-string fields.
  "map-string"?: string;
  "map-style": MapStyle;
  "victory-points": number;
  events?: EventId[];
  [key: string]: any;
}
