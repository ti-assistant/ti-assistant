interface BaseRelic {
  description: string;
  expansion: Expansion;
  removedIn?: Expansion;
  id: RelicId;
  name: string;
  timing: Timing;
}

interface GameRelic {
  owner?: FactionId;
  state?: ComponentState;
}

type Relic = BaseRelic & GameRelic;

type RelicId =
  | ProphecyOfKings.RelicId
  | CodexTwo.RelicId
  | CodexFour.RelicId
  | ThundersEdge.RelicId
  | DiscordantStars.RelicId;
