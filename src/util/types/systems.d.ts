type SystemType = "HOME" | "RED" | "BLUE" | "MECATOL" | "NEXUS" | "HYPERLANE";

interface BaseSystem {
  expansion: Expansion;
  id: SystemId;
  planets: PlanetId[];
  type: SystemType;
}

interface GameSystem {}

type System = BaseSystem & GameSystem;

type SystemId =
  | BaseGame.SystemId
  | ProphecyOfKings.SystemId
  | CodexThree.SystemId
  | DiscordantStars.SystemId;
