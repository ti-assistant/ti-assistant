import { Expansion } from "./options";
import { Phase } from "./state";

export type ObjectiveType = "STAGE ONE" | "STAGE TWO" | "SECRET" | "OTHER";

export type ObjectiveUpdateAction =
  | "REVEAL_OBJECTIVE"
  | "REMOVE_OBJECTIVE"
  | "TAKE_OBJECTIVE"
  | "SCORE_OBJECTIVE"
  | "UNSCORE_OBJECTIVE"
  | "CHANGE_OBJECTIVE_TYPE"
  | "CHANGE_OBJECTIVE_POINTS";

export interface ObjectiveUpdateData {
  action?: ObjectiveUpdateAction;
  faction?: string;
  prevFaction?: string;
  key?: string;
  objective?: string;
  timestamp?: number;
  type?: ObjectiveType;
  points?: number;
}

export interface BaseObjective {
  description: string;
  expansion: Expansion;
  name: string;
  points: number;
  type: ObjectiveType;
  // Optional
  max?: number;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  phase?: Phase;
  repeatable?: boolean;
  replaces?: string;
}

export interface GameObjective {
  factions?: string[];
  scorers?: string[];
  selected?: boolean;
  keyedScorers?: Record<string, string[]>;
  revealOrder?: number;
  points?: number;
}

export type Objective = BaseObjective & GameObjective;

export function hasScoredObjective(factionName: string, objective: Objective) {
  return (objective.scorers ?? []).includes(factionName);
}
