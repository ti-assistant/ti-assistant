type LeaderState = "locked" | "readied" | "purged" | "exhausted";

type LeaderType = "AGENT" | "COMMANDER" | "HERO";

interface BaseLeader {
  abilityName?: string;
  description: string;
  expansion: Expansion;
  faction: FactionId;
  id: LeaderId;
  name: string;
  omegas?: Omega<BaseLeader>[];
  replaces?: string;
  subFaction?: FactionId;
  timing: Timing;
  type: LeaderType;
  unlock?: string;
}

interface GameLeader {
  state?: LeaderState;
}

type Leader = BaseLeader & GameLeader;

type LeaderId =
  | ProphecyOfKings.LeaderId
  | CodexThree.LeaderId
  | ThundersEdge.LeaderId
  | DiscordantStars.LeaderId;
