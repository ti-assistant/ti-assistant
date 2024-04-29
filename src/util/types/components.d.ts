type ComponentType =
  | "ABILITY"
  | "CARD"
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
  faction?: FactionId;
  id: ComponentId | RelicId | TechId | LeaderId;
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
  | "Archaeological Expedition"
  | "Black Market Forgery"
  | "Blood Pact"
  | "Cripple Defenses"
  | "Dark Pact"
  | "Divert Funding"
  | "Economic Initiative"
  | "Enigmatic Device"
  | "Exploration Probe"
  | "Fabrication"
  | "Fighter Conscription"
  | "Fires of the Gashlai"
  | "Focused Research"
  | "Frontline Deployment"
  | "Gain Relic"
  | "Ghost Ship"
  | "Impersonation"
  | "Industrial Initiative"
  | "Insubordination"
  | "Lazax Gate Folding"
  | "Lucky Shot"
  | "Mageon Implants"
  | "Mining Initiative"
  | "Orbital Drop"
  | "Plagiarize"
  | "Plague"
  | "Production Biomes"
  | "Promise of Protection"
  | "Reactor Meltdown"
  | "Refit Troops"
  | "Repeal Law"
  | "Rise of a Messiah"
  | "Scuttle"
  | "Seize Artifact"
  | "Signal Jamming"
  | "Sling Relay"
  | "Spy"
  | "Stall Tactics"
  | "Star Forge"
  | "Stymie"
  | "Tactical Bombardment"
  | "Terraform"
  | "The Inferno"
  | "Trade Convoys"
  | "Unexpected Action"
  | "Unstable Planet"
  | "Uprising"
  | "Vortex"
  | "War Effort"
  | "Wormhole Generator"
  | "X-89 Bacterial Weapon"
  | DiscordantStars.ComponentId;
