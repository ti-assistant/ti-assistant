interface BaseRelic {
  description: string;
  expansion: Expansion;
  id: RelicId;
  name: string;
  timing: Timing;
}

interface GameRelic {
  owner?: FactionId;
  state?: ComponentState;
}

type Relic = BaseRelic & GameRelic;

type RelicUpdateAction = "GAIN_RELIC" | "LOSE_RELIC" | "USE_RELIC";

interface RelicUpdateData {
  action?: RelicUpdateAction;
  faction?: string;
  relic?: RelicId;
  timestamp?: number;
}

type RelicId =
  | ProphecyOfKings.RelicId
  | CodexTwo.RelicId
  | CodexFour.RelicId
  | DiscordantStars.RelicId;
