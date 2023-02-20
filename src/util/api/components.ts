import { Expansion } from "./options";

export type ComponentType =
  | "card"
  | "flagship"
  | "tech"
  | "leader"
  | "relic"
  | "promissory";

export type ComponentState = "exhausted" | "purged" | "used" | "one-left";

export type LeaderType = "agent" | "commander" | "hero";

export interface BaseComponent {
  description: string;
  details?: boolean;
  expansion: Expansion;
  faction?: string;
  leader?: LeaderType;
  name: string;
  subFaction?: string;
  type: ComponentType;
}

export interface GameComponent {
  state?: ComponentState;
}

export type Component = BaseComponent & GameComponent;
