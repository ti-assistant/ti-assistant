type SystemType = "HOME" | "RED" | "BLUE" | "MECATOL" | "NEXUS" | "HYPERLANE";

type Wormhole = "ALPHA" | "BETA" | "GAMMA" | "DELTA" | "EPSILON";

type Direction =
  | "UP"
  | "DOWN"
  | "TOP LEFT"
  | "BOTTOM LEFT"
  | "TOP RIGHT"
  | "BOTTOM RIGHT";

interface Hyperlane {
  a: Direction;
  b: Direction;
}

interface BaseSystem {
  expansion: Expansion;
  id: SystemId;
  planets: PlanetId[];
  type: SystemType;
  wormholes?: Wormhole[];
  hyperlanes?: Hyperlane[];
}

interface GameSystem {
  purged?: boolean;
}

type System = BaseSystem & GameSystem;

type SystemId =
  | BaseGame.SystemId
  | ProphecyOfKings.SystemId
  | CodexThree.SystemId
  | ThundersEdge.SystemId
  | DiscordantStars.SystemId;
