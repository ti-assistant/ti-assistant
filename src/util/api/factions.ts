import { mutate } from "swr";
import { Expansion } from "./options";
import { GameTech, UnitStats } from "./techs";
import { poster } from "./util";
import { Secondary } from "./subState";
import { BaseLeader } from "./components";

export type FactionUpdateAction =
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

export type SubFaction = "Argent Flight" | "Mentak Coalition" | "Xxcha Kingdom";

export interface FactionUpdateData {
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

interface Units {
  Carrier?: number;
  Cruiser?: number;
  Destroyer?: number;
  Dreadnought?: number;
  Fighter?: number;
  Flagship?: number;
  Infantry?: number;
  Mech?: number;
  PDS?: number;
  "Space Dock"?: number;
  "War Sun"?: number;
}

export interface StartsWith {
  planets?: string[];
  techs?: string[];
  units: Units;
  faction?: SubFaction;
  choice?: {
    options: string[];
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

export interface PromissoryNote {
  name: string;
  description: string;
  omega?: {
    expansion: Expansion;
  } & Partial<PromissoryNote>;
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

// type UnitAbilityType =
//   | "SUSTAIN DAMAGE"
//   | "PRODUCTION"
//   | "PLANETARY SHIELD"
//   | "SPACE CANNON"
//   | "BOMBARDMENT"
//   | "ANTI-FIGHTER BARRAGE";

export interface Unit {
  abilities?: string[];
  description?: string;
  expansion: Expansion;
  name: string;
  stats: UnitStats;
  type: UnitType;
  omega?: {
    expansion: Expansion;
  } & Partial<Unit>;
  upgrade?: string;
}

export interface BaseFaction {
  abilities: Ability[];
  colors: Record<string, number>;
  commodities: number;
  expansion: Expansion;
  name: string;
  promissories: PromissoryNote[];
  shortname: string;
  startswith: StartsWith;
  units: Unit[];
}

export interface GameFaction {
  color: string;
  commander: string;
  hero: string;
  mapPosition: number;
  name: string;
  order: number;
  secondary?: Secondary;
  planets: Record<string, { ready: boolean }>;
  playerName?: string;
  startswith: StartsWith;
  techs: Record<string, GameTech>;
  castVotes?: number;
  passed?: boolean;
  votes?: number;
  vps?: number;
}

export type Faction = BaseFaction & GameFaction;
