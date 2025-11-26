type ComponentType =
  | "ABILITY"
  | "BREAKTHROUGH"
  | "CARD"
  | "EVENT"
  | "EXPLORATION"
  | "FLAGSHIP"
  | "LEADER"
  | "PLANET"
  | "PROMISSORY"
  | "RELIC"
  | "TECH";

type ComponentState = "exhausted" | "purged" | "used" | "readied" | "locked";

type Timing =
  | "AGENDA_PHASE"
  | "AGENDA_PHASE_START"
  | "COMPONENT_ACTION"
  | "MULTIPLE"
  | "PASSIVE"
  | "STATUS_PHASE_END"
  | "TACTICAL_ACTION"
  | "OTHER";

type LeaderType = "AGENT" | "COMMANDER" | "HERO";

interface BaseLeader {
  abilityName?: string;
  description: string;
  expansion: Expansion;
  faction: FactionId;
  id: LeaderId;
  name: string;
  omegas?: Omega<BaseLeader>[];
  replaces?: string;
  subFaction?: FactionId;
  timing: Timing;
  type: LeaderType;
  unlock?: string;
}

interface GameLeader {
  state?: LeaderState;
}

type Leader = BaseLeader & GameLeader;

interface BaseTechComponent {
  description: string;
  expansion: Expansion;
  event?: EventId;
  faction?: FactionId;
  id: TechId;
  name: string;
  replaces?: string;
  type: "TECH";
}

interface BaseComponent {
  abilityName?: string;
  description: string;
  expansion: Expansion;
  event?: EventId;
  faction?: FactionId;
  id: BreakthroughId | ComponentId | RelicId | TechId | LeaderId | EventId;
  leader?: LeaderType;
  name: string;
  replaces?: string;
  requiresTech?: TechId;
  subFaction?: FactionId;
  type: Exclude<ComponentType, "TECH">;
  unlock?: string;
}

interface GameComponent {
  state?: ComponentState;
}

type Component = (BaseComponent | BaseTechComponent) & GameComponent;

type ComponentId =
  | BaseGame.ComponentId
  | ProphecyOfKings.ComponentId
  | ThundersEdge.ComponentId
  | CodexOne.ComponentId
  | CodexFour.ComponentId
  | DiscordantStars.ComponentId;
