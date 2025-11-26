export const DEFAULT_SETTINGS: Settings = {
  "display-objective-description": false,
  "group-techs-by-faction": false,
  "show-turn-timer": true,
  // Faction Summary Settings
  "fs-tech-summary-display": "NUMBER+ICON+TREE",
  "fs-left": "TECHS",
  "fs-center": "OBJECTIVES",
  "fs-right": "PLANETS",
  "fs-left-label": "NAME",
  "fs-right-label": "TIMER",
} as const;

export interface Settings {
  "display-objective-description": boolean;
  "group-techs-by-faction": boolean;
  "show-turn-timer": boolean;
  "fs-tech-summary-display": TechSummaryDisplay;
  "fs-left": SummarySection;
  "fs-center": SummarySection;
  "fs-right": SummarySection;
  "fs-left-label": SummaryLabel;
  "fs-right-label": SummaryLabel;
}

export type TechSummaryDisplay =
  | "NONE"
  | "NUMBER+ICON+TREE"
  | "NUMBER+ICON"
  | "NUMBER+TREE"
  | "ICON+TREE"
  | "TREE";

export type SummarySection =
  | "NONE"
  | "TECHS"
  | "OBJECTIVES"
  | "PLANETS"
  | "TIMER";

export type SummaryLabel = "NONE" | "NAME" | "TIMER" | "VPS";
