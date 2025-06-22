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
  | "Cripple Defenses"
  | "Economic Initiative"
  | "Fires of the Gashlai"
  | "Focused Research"
  | "Frontline Deployment"
  | "Ghost Ship"
  | "Industrial Initiative"
  | "Insubordination"
  | "Lazax Gate Folding"
  | "Lucky Shot"
  | "Mageon Implants"
  | "Mining Initiative"
  | "Orbital Drop"
  | "Plague"
  | "Production Biomes"
  | "Promise of Protection"
  | "Reactor Meltdown"
  | "Repeal Law"
  | "Rise of a Messiah"
  | "Signal Jamming"
  | "Spy"
  | "Stall Tactics"
  | "Star Forge"
  | "Stymie"
  | "Tactical Bombardment"
  | "The Inferno"
  | "Trade Convoys"
  | "Unexpected Action"
  | "Unstable Planet"
  | "Uprising"
  | "War Effort"
  | "X-89 Bacterial Weapon"
  | ProphecyOfKings.ComponentId
  | CodexOne.ComponentId
  | CodexFour.ComponentId
  | DiscordantStars.ComponentId;
