interface BaseStrategyCard {
  color: string;
  expansion?: Expansion;
  id: StrategyCardId;
  name: string;
  omegas?: Omega<BaseStrategyCard>[];
  order: number;
  replaces?: StrategyCardId;
  primary: string;
  secondary: string;
}

interface GameStrategyCard {
  invalid?: boolean;
  order?: number;
  faction?: FactionId;
  tradeGoods?: number;
  used?: boolean;
}

type StrategyCard = BaseStrategyCard & GameStrategyCard;

type StrategyCardId = BaseGame.StrategyCardId | TwilightsFall.StrategyCardId;
