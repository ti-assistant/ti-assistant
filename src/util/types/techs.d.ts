type TechType = "RED" | "BLUE" | "YELLOW" | "GREEN" | "UPGRADE";

interface UnitStats {
  capacity?: number;
  combat?: number | string;
  cost?: number | string;
  move?: number;
}

interface OmegaTech {
  description: string;
  expansion: Expansion;
  name: string;
}

interface BaseNormalTech {
  deprecates?: TechId;
  description: string;
  expansion: Expansion;
  faction?: FactionId;
  id: TechId;
  locked?: boolean;
  name: string;
  omegas?: OmegaTech[];
  prereqs: TechType[];
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
  omegas?: OmegaTech[];
  prereqs: TechType[];
  replaces?: TechId;
  stats: UnitStats;
  type: "UPGRADE";
  unitType: UnitType;
}

type BaseTech = BaseNormalTech | BaseUpgradeTech;

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
  | DiscordantStars.TechId;
