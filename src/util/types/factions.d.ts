type SubFaction = "Argent Flight" | "Mentak Coalition" | "Xxcha Kingdom";

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
    description: string;
    options: TechId[];
    select: number;
  };
  planetchoice?: {
    options: SubFaction[];
  };
  // Twilight's Fall
  planetFaction?: FactionId;
  unitFaction?: FactionId;
}

interface Ability {
  name: string;
  description: string;
  omegas?: Omega<Ability>[];
}

interface PromissoryNote {
  name: string;
  description: string;
  omegas?: Omega<PromissoryNote>[];
}

interface Unit {
  abilities?: string[];
  description?: string;
  expansion: Expansion;
  name: string;
  stats: UnitStats;
  type: UnitType;
  omegas?: Omega<Unit>[];
  upgrade?: TechId;
  reverse?: Unit;
}

interface Breakthrough {
  description: string;
  id: BreakthroughId;
  name: string;
  synergy?: {
    left: TechType;
    right: TechType;
  };
  timing: Timing;
  state?: ComponentState;
  reverse?: Unit;
}

interface BaseFaction {
  abilities?: Ability[];
  breakthrough?: Breakthrough;
  color?: string;
  colorList?: string[];
  commodities: number;
  expansion: Expansion;
  removedIn?: Expansion; // Used to remove factions if they do not apply.
  id: FactionId;
  locked?: boolean; // Prevents a faction from being selected.
  name: string;
  omegas?: Omega<BaseFaction>[];
  promissories?: PromissoryNote[];
  shortname: string;
  startswith?: StartsWith;
  units: Unit[];
}

interface TFFaction {
  color: string;
  commodities: number;
  id: TwilightsFall.FactionId;
  name: string;
  shortname: string;
  units: Unit[];
}

interface GameFaction {
  alliancePartner?: FactionId;
  alliances?: FactionId[];
  availableVotes?: number;
  breakthrough?: Partial<Breakthrough>;
  color: string;
  commander: LeaderState;
  hero: LeaderState;
  id: FactionId;
  mapPosition: number;
  order: number;
  secondary?: Secondary;
  planets: Partial<Record<PlanetId, { ready: boolean }>>;
  playerName?: string;
  startswith?: StartsWith;
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
  | TwilightsFall.FactionId
  | DiscordantStars.FactionId;

type BreakthroughId = ThundersEdge.BreakthroughId;
