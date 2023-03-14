import { Expansion } from "./options";

export type ComponentType =
  | "ABILITY"
  | "CARD"
  | "FLAGSHIP"
  | "LEADER"
  | "PROMISSORY"
  | "RELIC"
  | "TECH";

export type ComponentState = "exhausted" | "purged" | "used" | "one-left";

export type Timing =
  | "AGENDA PHASE"
  | "COMPONENT ACTION"
  | "MULTIPLE"
  | "PASSIVE";

export type LeaderType = "AGENT" | "COMMANDER" | "HERO";

export interface BaseLeader {
  abilityName?: string;
  description: string;
  expansion: Expansion;
  faction?: string;
  name: string;
  omega?: {
    abilityName?: string;
    description: string;
    expansion: Expansion;
    name: string;
    timing?: Timing;
  };
  replaces?: string;
  subFaction?: string;
  timing: Timing;
  type: LeaderType;
  unlock?: string;
}

export interface BaseComponent {
  abilityName?: string;
  description: string;
  details?: boolean;
  expansion: Expansion;
  faction?: string;
  leader?: LeaderType;
  name: string;
  replaces?: string;
  subFaction?: string;
  type: ComponentType;
  unlock?: string;
}

export interface GameComponent {
  state?: ComponentState;
}

export type Component = BaseComponent & GameComponent;
