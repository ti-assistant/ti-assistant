interface BaseActionCard {
  count: number;
  description: string;
  expansion: Expansion;
  id: ActionCardId;
  name: string;
  omegas?: Omega<BaseActionCard>[];
  timing: Timing;
}

interface GameActionCard {
  state?: "discarded";
}

type ActionCard = BaseActionCard & GameActionCard;

type ActionCards = Partial<Record<ActionCardId, ActionCard>>;

type ActionCardId =
  | BaseGame.ActionCardId
  | CodexOne.ActionCardId
  | ProphecyOfKings.ActionCardId
  | ThundersEdge.ActionCardId
  | DiscordantStars.ActionCardId;
