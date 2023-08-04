import { Expansion } from "./options";
import { PlanetState } from "../model/updatePlanetState";

export type PlanetAttribute =
  | "legendary"
  | "red-skip"
  | "yellow-skip"
  | "blue-skip"
  | "green-skip"
  | "demilitarized"
  | "tomb"
  | "space-cannon"
  | "all-types"
  | "victory-point";

export type PlanetType =
  | "INDUSTRIAL"
  | "CULTURAL"
  | "HAZARDOUS"
  | "ALL"
  | "NONE";

export type PlanetUpdateAction =
  | "ADD_PLANET"
  | "REMOVE_PLANET"
  | "ADD_ATTACHMENT"
  | "REMOVE_ATTACHMENT"
  | "PURGE_PLANET"
  | "UNPURGE_PLANET";

export interface PlanetUpdateData {
  action?: PlanetUpdateAction;
  attachment?: string;
  faction?: string;
  planet?: string;
  timestamp?: number;
}

export interface BasePlanet {
  expansion: Expansion;
  ability?: string;
  attributes: PlanetAttribute[];
  faction?: string;
  home?: boolean;
  influence: number;
  locked?: boolean;
  name: string;
  position?: { x: number; y: number };
  resources: number;
  system?: number;
  type: PlanetType;
}

export interface GamePlanet {
  owner?: string;
  ready?: boolean;
  state?: PlanetState;
  attachments?: string[];
}

export type Planet = BasePlanet & GamePlanet;
