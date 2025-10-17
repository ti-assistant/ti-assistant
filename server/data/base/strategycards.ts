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
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Leadership.Primary",
          description: "Primary of Strategy Card: Leadership",
          defaultMessage:
            "Gain 3 command tokens.{br}Spend any amount of influence to gain 1 command token for every 3 influence spent.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Leadership.Secondary",
          description: "Secondary of Strategy Card: Leadership",
          defaultMessage:
            "Spend any amount of influence to gain 1 command token for every 3 influence spent.",
        },
        { br: "\n\n" }
      ),
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
      omegas: [
        {
          expansion: "CODEX ONE",
          primary: intl.formatMessage(
            {
              id: "Strategy Cards.Diplomacy.Codex I.Primary",
              description: "Primary of Strategy Card: Diplomacy",
              defaultMessage:
                "Choose 1 system other than the Mecatol Rex system that contains a planet you control; each other player places a command token from their reinforcements in the chosen system. Then, ready up to 2 exhausted planets you control.",
            },
            { br: "\n\n" }
          ),
          secondary: intl.formatMessage(
            {
              id: "Strategy Cards.Diplomacy.Codex I.Secondary",
              description: "Secondary of Strategy Card: Diplomacy",
              defaultMessage:
                "Spend 1 token from your strategy pool to ready up to 2 exhausted planets you control.",
            },
            { br: "\n\n" }
          ),
        },
        {
          expansion: "POK",
          primary: intl.formatMessage(
            {
              id: "Strategy Cards.Diplomacy.Codex One.Primary",
              description: "Primary of Strategy Card: Diplomacy",
              defaultMessage:
                "Choose 1 system other than the Mecatol Rex system that contains a planet you control; each other player places a command token from their reinforcements in the chosen system. Then, ready up to 2 exhausted planets you control.",
            },
            { br: "\n\n" }
          ),
          secondary: intl.formatMessage(
            {
              id: "Strategy Cards.Diplomacy.Codex I.Secondary",
              description: "Secondary of Strategy Card: Diplomacy",
              defaultMessage:
                "Spend 1 token from your strategy pool to ready up to 2 exhausted planets you control.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Diplomacy.Primary",
          description: "Primary of Strategy Card: Diplomacy",
          defaultMessage:
            "Choose 1 system other than the Mecatol Rex system that contains a planet you control; each other player places a command token from their reinforcements in the chosen system.  Then, ready each exhausted planet you control in that system.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Diplomacy.Secondary",
          description: "Secondary of Strategy Card: Diplomacy",
          defaultMessage:
            "Spend 1 token from your strategy pool to ready up to 2 exhausted planets.",
        },
        { br: "\n\n" }
      ),
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
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Politics.Primary",
          description: "Primary of Strategy Card: Politics",
          defaultMessage:
            "Choose a player other than the speaker. That player gains the speaker token.{br}Draw 2 action cards.{br}Look at the top 2 cards of the agenda deck. Place each card on the top or bottom of the deck in any order.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Politics.Secondary",
          description: "Secondary of Strategy Card: Politics",
          defaultMessage:
            "Spend 1 token from your strategy pool to draw 2 action cards.",
        },
        { br: "\n\n" }
      ),
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
      omegas: [
        {
          expansion: "POK",
          secondary: intl.formatMessage(
            {
              id: "Strategy Cards.Construction.POK.Secondary",
              description: "Secondary of Strategy Card: Construction",
              defaultMessage:
                "Spend 1 token from your strategy pool and place it in any system; you may place either 1 space dock or 1 PDS on a planet you control in that system.",
            },
            { br: "\n\n" }
          ),
        },
        {
          expansion: "THUNDERS EDGE",
          primary: intl.formatMessage(
            {
              id: "Strategy Cards.Construction.TE.Primary",
              description: "Primary of Strategy Card: Construction",
              defaultMessage:
                "Either place 1 structure on a planet you control, or use the PRODUCTION ability of 1 of your space docks.{br}Place 1 structure on a planet you control.",
            },
            { br: "\n\n" }
          ),
          secondary: intl.formatMessage(
            {
              id: "Strategy Cards.Construction.TE.Secondary",
              description: "Secondary of Strategy Card: Construction",
              defaultMessage:
                "Spend 1 token from your strategy pool to place 1 structure on a planet you control.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Construction.Primary",
          description: "Primary of Strategy Card: Construction",
          defaultMessage:
            "Place 1 PDS or 1 Space Dock on a planet you control.{br}Place 1 PDS on a planet you control.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Construction.Secondary",
          description: "Secondary of Strategy Card: Construction",
          defaultMessage:
            "Place 1 token from your strategy pool in any system; you may place either 1 space dock or 1 PDS on a planet you control in that system.",
        },
        { br: "\n\n" }
      ),
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
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Trade.Primary",
          description: "Primary of Strategy Card: Trade",
          defaultMessage:
            "Gain 3 trade goods.{br}Replenish commodities.{br}Choose any number of other players. Those players use the secondary ability of this strategy card without spending a command token.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Trade.Secondary",
          description: "Secondary of Strategy Card: Trade",
          defaultMessage:
            "Spend 1 token from your strategy pool to replenish your commodities.",
        },
        { br: "\n\n" }
      ),
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
      omegas: [
        {
          expansion: "THUNDERS EDGE",
          primary: intl.formatMessage(
            {
              id: "Strategy Cards.Warfare.TE.Primary",
              description: "Primary of Strategy Card: Warfare",
              defaultMessage:
                "Perform a tactical action in any system without placing a command token, even if the system already has your command token in it; that system still counts as being activated. You may redistribute your command tokens before and after this action.",
            },
            { br: "\n\n" }
          ),
          secondary: intl.formatMessage(
            {
              id: "Strategy Cards.Warfare.TE.Secondary",
              description: "Secondary of Strategy Card: Warfare",
              defaultMessage:
                "Spend 1 token from your strategy pool to use the PRODUCTION abilities of units in your home system.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Warfare.Primary",
          description: "Primary of Strategy Card: Warfare",
          defaultMessage:
            "Remove 1 of your command tokens from the game board; then, gain 1 command token.{br}Redistribute any number of the command tokens on your command sheet.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Warfare.Secondary",
          description: "Secondary of Strategy Card: Warfare",
          defaultMessage:
            "Spend 1 token from your strategy pool to use the PRODUCTION ability of 1 of your space docks in your home system.",
        },
        { br: "\n\n" }
      ),
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
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Technology.Primary",
          description: "Primary of Strategy Card: Technology",
          defaultMessage:
            "Research 1 technology.{br}Spend 6 resources to research 1 technology.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Technology.Secondary",
          description: "Secondary of Strategy Card: Technology",
          defaultMessage:
            "Spend 1 token from your strategy pool and 4 resources to research 1 technology.",
        },
        { br: "\n\n" }
      ),
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
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Imperial.Primary",
          description: "Primary of Strategy Card: Imperial",
          defaultMessage:
            "Immediately score 1 public objective if you fulfill its requirements.{br}Gain 1 victory point if you control Mecatol Rex; otherwise, draw 1 secret objective.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Imperial.Secondary",
          description: "Secondary of Strategy Card: Imperial",
          defaultMessage:
            "Spend 1 token from your strategy pool to draw 1 secret objective.",
        },
        { br: "\n\n" }
      ),
    },
  };
}
