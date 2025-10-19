type StrategyCardUpdateAction =
  | "ASSIGN_STRATEGY_CARD"
  | "SWAP_STRATEGY_CARDS"
  | "PUBLIC_DISGRACE"
  | "GIFT_OF_PRESCIENCE"
  | "USE_STRATEGY_CARD"
  | "CLEAR_STRATEGY_CARDS";

interface StrategyCardUpdateData {
  action?: StrategyCardUpdateAction;
  card?: string;
  cardOne?: string;
  cardTwo?: string;
  faction?: string;
  timestamp?: number;
}

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
