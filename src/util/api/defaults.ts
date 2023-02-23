import { StrategyCard } from "./cards";

export function getDefaultStrategyCards(): Record<string, StrategyCard> {
  return {
    Leadership: {
      color: "red",
      order: 1,
      name: "Leadership",
    },
    Diplomacy: {
      color: "orange",
      order: 2,
      name: "Diplomacy",
    },
    Politics: {
      color: "yellow",
      order: 3,
      name: "Politics",
    },
    Construction: {
      color: "green",
      order: 4,
      name: "Construction",
    },
    Trade: {
      color: "turquoise",
      order: 5,
      name: "Trade",
    },
    Warfare: {
      color: "blue",
      order: 6,
      name: "Warfare",
    },
    Technology: {
      color: "darkblue",
      order: 7,
      name: "Technology",
    },
    Imperial: {
      color: "purple",
      order: 8,
      name: "Imperial",
    },
  };
}
