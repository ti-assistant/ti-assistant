type ComponentType =
  | "ABILITY"
  | "CARD"
  | "EVENT"
  | "EXPLORATION"
  | "FLAGSHIP"
  | "LEADER"
  | "PROMISSORY"
  | "RELIC"
  | "TECH";

type ComponentState =
  | "exhausted"
  | "purged"
  | "used"
  | "one-left"
  | "readied"
  | "locked";

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
  faction?: FactionId;
  id: LeaderId;
  name: string;
  omega?: {
    abilityName?: string;
    description: string;
    expansion: Expansion;
    name: string;
    timing?: Timing;
    unlock?: string;
  };
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
  id: ComponentId | RelicId | TechId | LeaderId | EventId;
  leader?: LeaderType;
  name: string;
  replaces?: string;
  subFaction?: FactionId;
  type: Exclude<ComponentType, "TECH">;
  unlock?: string;
}

interface GameComponent {
  state?: ComponentState;
}

type Component = (BaseComponent | BaseTechComponent) & GameComponent;

namespace DiscordantStars {
  type ComponentId = "Emergency Deployment";
}

type ComponentId =
  | BaseGame.ComponentId
  | ProphecyOfKings.ComponentId
  | CodexOne.ComponentId
  | CodexFour.ComponentId
  | DiscordantStars.ComponentId;
