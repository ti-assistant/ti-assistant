type LeaderState = "locked" | "readied" | "purged" | "exhausted";

type LeaderId =
  | ProphecyOfKings.LeaderId
  | CodexThree.LeaderId
  | DiscordantStars.LeaderId;
