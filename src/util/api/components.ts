import { Expansion } from "./options";

export type ComponentType =
  | "card"
  | "flagship"
  | "tech"
  | "leader"
  | "relic"
  | "promissory";

export type ComponentState = "exhausted" | "purged" | "used" | "one-left";

export type LeaderType = "AGENT" | "COMMANDER" | "HERO";

export interface BaseLeader {
  abilityName?: string;
  description: string;
  expansion: Expansion;
  faction?: string;
  name: string;
  replaces?: string;
  subFaction?: string;
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
