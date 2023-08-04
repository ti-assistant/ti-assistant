export type StrategyCardName =
  | "Leadership"
  | "Diplomacy"
  | "Politics"
  | "Construction"
  | "Trade"
  | "Warfare"
  | "Technology"
  | "Imperial";

export type StrategyCardUpdateAction =
  | "ASSIGN_STRATEGY_CARD"
  | "SWAP_STRATEGY_CARDS"
  | "PUBLIC_DISGRACE"
  | "GIFT_OF_PRESCIENCE"
  | "USE_STRATEGY_CARD"
  | "CLEAR_STRATEGY_CARDS";

export interface StrategyCardUpdateData {
  action?: StrategyCardUpdateAction;
  card?: string;
  cardOne?: string;
  cardTwo?: string;
  faction?: string;
  timestamp?: number;
}

export interface BaseStrategyCard {
  color: string;
  name: StrategyCardName;
  order: number;
}

export interface GameStrategyCard {
  invalid?: boolean;
  order?: number;
  faction?: string;
  tradeGoods?: number;
  used?: boolean;
}

export type StrategyCard = BaseStrategyCard & GameStrategyCard;

export const strategyCardOrder: Record<StrategyCardName, number> = {
  Leadership: 1,
  Diplomacy: 2,
  Politics: 3,
  Construction: 4,
  Trade: 5,
  Warfare: 6,
  Technology: 7,
  Imperial: 8,
};
