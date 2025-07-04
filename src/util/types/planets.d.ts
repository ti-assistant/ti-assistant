type PlanetAttribute =
  | "legendary"
  | "red-skip"
  | "yellow-skip"
  | "blue-skip"
  | "green-skip"
  | "demilitarized"
  | "tomb"
  | "space-cannon"
  | "all-types"
  | "victory-point"
  // Discordant Stars
  | "extra-votes"
  | "production"
  | "infantry";

type PlanetType = "INDUSTRIAL" | "CULTURAL" | "HAZARDOUS" | "ALL" | "NONE";

type PlanetUpdateAction =
  | "ADD_PLANET"
  | "REMOVE_PLANET"
  | "ADD_ATTACHMENT"
  | "REMOVE_ATTACHMENT"
  | "PURGE_PLANET"
  | "UNPURGE_PLANET";

interface PlanetUpdateData {
  action?: PlanetUpdateAction;
  attachment?: string;
  faction?: FactionId;
  planet?: string;
  timestamp?: number;
}

interface BasePlanet {
  expansion: Expansion;
  ability?: string;
  attributes: PlanetAttribute[];
  faction?: FactionId;
  home?: boolean;
  id: PlanetId;
  influence: number;
  locked?: boolean;
  name: string;
  position?: { x: number; y: number };
  resources: number;
  subFaction?: SubFaction;
  system?: SystemId;
  type: PlanetType;
}

interface GamePlanet {
  owner?: FactionId;
  ready?: boolean;
  state?: PlanetState;
  attachments?: AttachmentId[];
}

type Planet = BasePlanet & GamePlanet;

type PlanetId =
  | BaseGame.PlanetId
  | ProphecyOfKings.PlanetId
  | CodexThree.PlanetId
  | DiscordantStars.PlanetId;
