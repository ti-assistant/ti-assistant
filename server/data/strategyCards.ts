import { BaseStrategyCard } from "../../src/util/api/cards";

export type StrategyCardId =
  | "Leadership"
  | "Diplomacy"
  | "Politics"
  | "Construction"
  | "Trade"
  | "Warfare"
  | "Technology"
  | "Imperial";

export const BASE_STRATEGY_CARDS: Record<StrategyCardId, BaseStrategyCard> = {
  Leadership: {
    color: "red",
    name: "Leadership",
    order: 1,
  },
  Diplomacy: {
    color: "orange",
    name: "Diplomacy",
    order: 2,
  },
  Politics: {
    color: "yellow",
    name: "Politics",
    order: 3,
  },
  Construction: {
    color: "green",
    name: "Construction",
    order: 4,
  },
  Trade: {
    color: "turquoise",
    name: "Trade",
    order: 5,
  },
  Warfare: {
    color: "blue",
    name: "Warfare",
    order: 6,
  },
  Technology: {
    color: "darkblue",
    name: "Technology",
    order: 7,
  },
  Imperial: {
    color: "purple",
    name: "Imperial",
    order: 8,
  },
};
