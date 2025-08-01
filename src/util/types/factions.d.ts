type FactionUpdateAction =
  | "ADD_TECH"
  | "REMOVE_TECH"
  | "CHOOSE_STARTING_TECH"
  | "REMOVE_STARTING_TECH"
  | "CHOOSE_SUB_FACTION"
  | "PASS"
  | "READY_ALL"
  | "MANUAL_VP_ADJUST"
  | "UPDATE_CAST_VOTES"
  | "RESET_CAST_VOTES";

type SubFaction = "Argent Flight" | "Mentak Coalition" | "Xxcha Kingdom";

interface FactionUpdateData {
  action?: FactionUpdateAction;
  faction?: string;
  factions?: Record<string, { votes: number }>;
  planet?: string;
  planets?: string[];
  ready?: boolean;
  subFaction?: SubFaction;
  tech?: string;
  timestamp?: number;
  vps?: number;
}

type UnitType =
  | "Carrier"
  | "Cruiser"
  | "Destroyer"
  | "Dreadnought"
  | "Fighter"
  | "Flagship"
  | "Infantry"
  | "Mech"
  | "PDS"
  | "Space Dock"
  | "War Sun";

type Units = {
  [key in UnitType]?: number;
};

interface StartsWith {
  planets?: PlanetId[];
  techs?: TechId[];
  units: Units;
  faction?: SubFaction;
  choice?: {
    options: TechId[];
    select: number;
  };
  planetchoice?: {
    options: SubFaction[];
  };
}

interface Ability {
  name: string;
  description: string;
}

interface PromissoryNote {
  name: string;
  description: string;
  omega?: {
    expansion: Expansion;
  } & Partial<PromissoryNote>;
}

interface Unit {
  abilities?: string[];
  description?: string;
  expansion: Expansion;
  name: string;
  stats: UnitStats;
  type: UnitType;
  omega?: {
    expansion: Expansion;
  } & Partial<Unit>;
  upgrade?: TechId;
}

interface Breakthrough {
  description: string;
  name: string;
  synergy: TechType[];
  timing: Timing;
}

interface BaseFaction {
  abilities: Ability[];
  breakthrough: Breakthrough;
  colors: Record<string, number>;
  colorList?: string[];
  commodities: number;
  expansion: Expansion;
  id: FactionId;
  name: string;
  promissories: PromissoryNote[];
  shortname: string;
  startswith: StartsWith;
  units: Unit[];
}

interface GameFaction {
  alliancePartner?: FactionId;
  color: string;
  commander: LeaderState;
  hero: LeaderState;
  id: FactionId;
  mapPosition: number;
  order: number;
  secondary?: Secondary;
  planets: Partial<Record<PlanetId, { ready: boolean }>>;
  playerName?: string;
  startswith: StartsWith;
  techs: Partial<Record<TechId, GameTech>>;
  castVotes?: number;
  passed?: boolean;
  votes?: number;
  vps?: number;
}

type Faction = BaseFaction & GameFaction;

type FactionId =
  | BaseGame.FactionId
  | ProphecyOfKings.FactionId
  | CodexThree.FactionId
  | ThundersEdge.FactionId
  | DiscordantStars.FactionId;
