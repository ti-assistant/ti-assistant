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
  | "ocean"
  | "synthetic" // A planet that doesn't exist. Used for The Triad relic.
  // Discordant Stars
  | "extra-votes"
  | "production"
  | "infantry";

type PlanetType = "INDUSTRIAL" | "CULTURAL" | "HAZARDOUS";

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
  state?: PlanetState;
  attachments?: AttachmentId[];
  // Manual adjustments
  spaceDock?: boolean;
  pds?: number;
}

type Planet = BasePlanet & GamePlanet;

type PlanetId =
  | BaseGame.PlanetId
  | ProphecyOfKings.PlanetId
  | CodexThree.PlanetId
  | ThundersEdge.PlanetId
  | DiscordantStars.PlanetId;
