type TechType = "RED" | "BLUE" | "YELLOW" | "GREEN" | "UPGRADE" | "OTHER";

interface UnitStats {
  capacity?: number;
  combat?: number | string;
  cost?: number | string;
  move?: number;
}

interface BaseNormalTech {
  description: string;
  expansion: Expansion;
  faction?: FactionId;
  id: TechId;
  locked?: boolean;
  name: string;
  omegas?: Omega<BaseNormalTech>[];
  prereqs: TechType[];
  removedIn?: Expansion;
  type: "RED" | "GREEN" | "BLUE" | "YELLOW";
}

interface BaseUpgradeTech {
  abilities: string[];
  description?: string;
  expansion: Expansion;
  faction?: FactionId;
  id: TechId;
  locked?: boolean;
  name: string;
  omegas?: Omega<BaseUpgradeTech>[];
  prereqs: TechType[];
  removedIn?: Expansion;
  replaces?: TechId;
  stats: UnitStats;
  type: "UPGRADE";
  unitType: UnitType;
}

interface BaseOtherTech {
  description: string;
  expansion: Expansion;
  faction: FactionId;
  id: TechId;
  name: string;
  omegas?: Omega<BaseOtherTech>[];
  prereqs: TechType[];
  removedIn?: Expansion;
  type: "OTHER";
}

type BaseTech = BaseNormalTech | BaseUpgradeTech | BaseOtherTech;

type TechState = "ready" | "exhausted" | "purged";

interface GameTech {
  ready?: boolean;
  shareKnowledge?: boolean;
  state?: TechState;
}

type Tech = BaseTech & GameTech;

type TechId =
  | BaseGame.TechId
  | ProphecyOfKings.TechId
  | CodexThree.TechId
  | ThundersEdge.TechId
  | TwilightsFall.TechId
  | DiscordantStars.TechId;
