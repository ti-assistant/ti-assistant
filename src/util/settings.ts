export const DEFAULT_SETTINGS: Settings = {
  "display-objective-description": false,
  "group-techs-by-faction": false,
  "show-turn-timer": true,
  // Faction Summary Settings
  "fs-tech-summary-display": "NUMBER+ICON+TREE",
} as const;

export interface Settings {
  "display-objective-description": boolean;
  "group-techs-by-faction": boolean;
  "show-turn-timer": boolean;
  "fs-tech-summary-display": TechSummaryDisplay;
}

export type TechSummaryDisplay =
  | "NONE"
  | "NUMBER+ICON+TREE"
  | "NUMBER+ICON"
  | "NUMBER+TREE"
  | "ICON+TREE"
  | "TREE";
