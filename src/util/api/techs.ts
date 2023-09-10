import { Faction } from "./factions";
import { Expansion } from "./options";

export type TechType = "RED" | "BLUE" | "YELLOW" | "GREEN" | "UPGRADE";

export interface UnitStats {
  capacity?: number;
  combat?: number | string;
  cost?: number | string;
  move?: number;
}

interface BaseNormalTech {
  description: string;
  expansion: Expansion;
  faction?: string;
  name: string;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  prereqs: TechType[];
  type: "RED" | "GREEN" | "BLUE" | "YELLOW";
}

interface BaseUpgradeTech {
  abilities: string[];
  description?: string;
  expansion: Expansion;
  faction?: string;
  name: string;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  prereqs: TechType[];
  replaces?: string;
  stats: UnitStats;
  type: "UPGRADE";
}

export type BaseTech = BaseNormalTech | BaseUpgradeTech;

export interface GameTech {
  ready?: boolean;
}

export type Tech = BaseTech & GameTech;

/**
 * Checks whether a faction has unlocked a specific tech.
 */
export function hasTech(faction: Faction, tech: string) {
  if (!faction.techs) {
    return false;
  }
  let techName = tech.replace(/\//g, "").replace(/\./g, "").replace(" Ω", "");
  return !!faction.techs[techName];
}

export function isTechReplaced(factionName: string, techName: string) {
  switch (factionName) {
    case "Federation of Sol":
      return techName === "Carrier II" || techName === "Infantry II";
    case "Arborec":
    case "Mahact Gene-Sorcerers":
      return techName === "Infantry II";
    case "Clan of Saar":
    case "Vuil'raith Cabal":
      return techName === "Space Dock II";
    case "L1Z1X Mindnet":
    case "Sardakk N'orr":
      return techName === "Dreadnought II";
    case "Titans of Ul":
      return techName === "Cruiser II" || techName === "PDS II";
    case "Naalu Collective":
      return techName === "Fighter II";
    case "Embers of Muaat":
      return techName === "War Sun";
    case "Argent Flight":
      return techName === "Destroyer II";
  }
  return false;
}
