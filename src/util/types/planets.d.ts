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
  // Thunder's Edge
  | "relic"
  | "space-station"
  // Discordant Stars
  | "extra-votes"
  | "production"
  | "infantry";

type PlanetType = "INDUSTRIAL" | "CULTURAL" | "HAZARDOUS";

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
  omegas?: Omega<BasePlanet>[];
  resources: number;
  subFaction?: SubFaction;
  system?: SystemId;
  types: PlanetType[];
  // Used to bypass normal system filtering.
  alwaysInclude?: boolean;
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
  | ThundersEdge.PlanetId
  | DiscordantStars.PlanetId;
