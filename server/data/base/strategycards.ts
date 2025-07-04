import { IntlShape } from "react-intl";

export default function getBaseStrategyCards(
  intl: IntlShape
): Record<BaseGame.StrategyCardId, BaseStrategyCard> {
  return {
    Leadership: {
      color: "red",
      id: "Leadership",
      name: intl.formatMessage({
        id: "Strategy Cards.Leadership.Title",
        description: "Title of Strategy Card: Leadership",
        defaultMessage: "Leadership",
      }),
      order: 1,
    },
    Diplomacy: {
      color: "orange",
      id: "Diplomacy",
      name: intl.formatMessage({
        id: "Strategy Cards.Diplomacy.Title",
        description: "Title of Strategy Card: Diplomacy",
        defaultMessage: "Diplomacy",
      }),
      order: 2,
    },
    Politics: {
      color: "yellow",
      id: "Politics",
      name: intl.formatMessage({
        id: "Strategy Cards.Politics.Title",
        description: "Title of Strategy Card: Politics",
        defaultMessage: "Politics",
      }),
      order: 3,
    },
    Construction: {
      color: "green",
      id: "Construction",
      name: intl.formatMessage({
        id: "Strategy Cards.Construction.Title",
        description: "Title of Strategy Card: Construction",
        defaultMessage: "Construction",
      }),
      order: 4,
    },
    Trade: {
      color: "turquoise",
      id: "Trade",
      name: intl.formatMessage({
        id: "Strategy Cards.Trade.Title",
        description: "Title of Strategy Card: Trade",
        defaultMessage: "Trade",
      }),
      order: 5,
    },
    Warfare: {
      color: "blue",
      id: "Warfare",
      name: intl.formatMessage({
        id: "Strategy Cards.Warfare.Title",
        description: "Title of Strategy Card: Warfare",
        defaultMessage: "Warfare",
      }),
      order: 6,
    },
    Technology: {
      color: "darkblue",
      id: "Technology",
      name: intl.formatMessage({
        id: "Strategy Cards.Technology.Title",
        description: "Title of Strategy Card: Technology",
        defaultMessage: "Technology",
      }),
      order: 7,
    },
    Imperial: {
      color: "purple",
      id: "Imperial",
      name: intl.formatMessage({
        id: "Strategy Cards.Imperial.Title",
        description: "Title of Strategy Card: Imperial",
        defaultMessage: "Imperial",
      }),
      order: 8,
    },
  };
}
