import { IntlShape } from "react-intl";

export default function getTwilightsFallStrategyCards(
  intl: IntlShape
): Record<TwilightsFall.StrategyCardId, BaseStrategyCard> {
  return {
    Lux: {
      color: "red",
      expansion: "TWILIGHTS FALL",
      id: "Lux",
      name: intl.formatMessage({
        id: "Strategy Cards.Lux.Title",
        description: "Title of Strategy Card: Lux",
        defaultMessage: "Lux",
      }),
      order: 1,
      replaces: "Leadership",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Lux.Primary",
          description: "Primary of Strategy Card: Lux",
          defaultMessage:
            "Gain 3 command tokens.{br}Spend any amount of influence to gain 1 command token for every 3 influence spent.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Lux.Secondary",
          description: "Secondary of Strategy Card: Lux",
          defaultMessage:
            "Spend any amount of influence to gain 1 command token for every 3 influence spent.",
        },
        { br: "\n\n" }
      ),
    },
    Noctis: {
      color: "orange",
      expansion: "TWILIGHTS FALL",
      id: "Noctis",
      name: intl.formatMessage({
        id: "Strategy Cards.Noctis.Title",
        description: "Title of Strategy Card: Noctis",
        defaultMessage: "Noctis",
      }),
      order: 2,
      replaces: "Diplomacy",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Noctis.Primary",
          description: "Primary of Strategy Card: Noctis",
          defaultMessage: "Initiate a genome splice.{br}Ready up to 2 planets.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Noctis.Secondary",
          description: "Secondary of Strategy Card: Noctis",
          defaultMessage:
            "Spend 1 token from your strategy pool to participate in the genome splice.",
        },
        { br: "\n\n" }
      ),
    },
    Tyrannus: {
      color: "yellow",
      expansion: "TWILIGHTS FALL",
      id: "Tyrannus",
      name: intl.formatMessage({
        id: "Strategy Cards.Tyrannus.Title",
        description: "Title of Strategy Card: Tyrannus",
        defaultMessage: "Tyrannus",
      }),
      order: 3,
      replaces: "Politics",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Tyrannus.Primary",
          description: "Primary of Strategy Card: Tyrannus",
          defaultMessage:
            "Choose a player other than the speaker. That player gains the speaker token.{br}Choose a player other than the speaker or tyrant. That player gainst the benediction token.{br}Draw 2 action cards.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Tyrannus.Secondary",
          description: "Secondary of Strategy Card: Tyrannus",
          defaultMessage:
            "Spend 1 token from your strategy pool to draw 2 action cards.",
        },
        { br: "\n\n" }
      ),
    },
    Civitas: {
      color: "green",
      expansion: "TWILIGHTS FALL",
      id: "Civitas",
      name: intl.formatMessage({
        id: "Strategy Cards.Civitas.Title",
        description: "Title of Strategy Card: Civitas",
        defaultMessage: "Civitas",
      }),
      order: 4,
      replaces: "Construction",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Civitas.Primary",
          description: "Primary of Strategy Card: Civitas",
          defaultMessage:
            "Either place 1 structure on a planet you control or use the PRODUCTION ability of 1 of your space docks.{br}Place 1 structure on a planet you control.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Civitas.Secondary",
          description: "Secondary of Strategy Card: Civitas",
          defaultMessage:
            "Spend 1 token from your strategy pool to place 1 structure on a planet you control.",
        },
        { br: "\n\n" }
      ),
    },
    Amicus: {
      color: "turquoise",
      expansion: "TWILIGHTS FALL",
      id: "Amicus",
      name: intl.formatMessage({
        id: "Strategy Cards.Amicus.Title",
        description: "Title of Strategy Card: Amicus",
        defaultMessage: "Amicus",
      }),
      order: 5,
      replaces: "Trade",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Amicus.Primary",
          description: "Primary of Strategy Card: Amicus",
          defaultMessage:
            "Gain 3 trade goods.{br}Replenish commodities.{br}Choose any number of other players. Those players use the secondary ability of this strategy card without spending a command token.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Amicus.Secondary",
          description: "Secondary of Strategy Card: Amicus",
          defaultMessage:
            "Spend 1 token from your strategy pool to replenish your commodities.",
        },
        { br: "\n\n" }
      ),
    },
    Calamitas: {
      color: "blue",
      expansion: "TWILIGHTS FALL",
      id: "Calamitas",
      name: intl.formatMessage({
        id: "Strategy Cards.Calamitas.Title",
        description: "Title of Strategy Card: Calamitas",
        defaultMessage: "Calamitas",
      }),
      order: 6,
      replaces: "Warfare",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Calamitas.Primary",
          description: "Primary of Strategy Card: Calamitas",
          defaultMessage:
            "Initiate a unit upgrade splice.{br}Resolve the PRODUCTION abilities of your units in 1 system.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Calamitas.Secondary",
          description: "Secondary of Strategy Card: Calamitas",
          defaultMessage:
            "Spend 1 token from your strategy pool and 4 resources to either participate in the unit upgrade splice or use the PRODUCTION abilities of the units in your home system.",
        },
        { br: "\n\n" }
      ),
    },
    Magus: {
      color: "purple",
      expansion: "TWILIGHTS FALL",
      id: "Magus",
      name: intl.formatMessage({
        id: "Strategy Cards.Magus.Title",
        description: "Title of Strategy Card: Magus",
        defaultMessage: "Magus",
      }),
      order: 7,
      replaces: "Technology",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Magus.Primary",
          description: "Primary of Strategy Card: Magus",
          defaultMessage:
            "Initiate an ability splice. You may spend 3 resources and 3 influence to add 1 additional ability to the pool; if you do, after each player has chosen, it passes back to you and you take an additional ability.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Magus.Secondary",
          description: "Secondary of Strategy Card: Magus",
          defaultMessage:
            "Spend 1 token from your strategy pool and 3 resources or 3 influence to participate in the ability splice.",
        },
        { br: "\n\n" }
      ),
    },
    Aeterna: {
      color: "magenta",
      expansion: "TWILIGHTS FALL",
      id: "Aeterna",
      name: intl.formatMessage({
        id: "Strategy Cards.Aeterna.Title",
        description: "Title of Strategy Card: Aeterna",
        defaultMessage: "Aeterna",
      }),
      order: 8,
      replaces: "Imperial",
      primary: intl.formatMessage(
        {
          id: "Strategy Cards.Aeterna.Primary",
          description: "Primary of Strategy Card: Aeterna",
          defaultMessage:
            "Immediately score 1 public objective if you fulfill its requirements; otherwise, draw 1 paradigm.{br}Gain 1 victory point if you control Mecatol Rex; otherwise, draw 1 secret objective.",
        },
        { br: "\n\n" }
      ),
      secondary: intl.formatMessage(
        {
          id: "Strategy Cards.Aeterna.Secondary",
          description: "Secondary of Strategy Card: Aeterna",
          defaultMessage:
            "Spend 1 token from your strategy pool to draw 1 secret objective or 1 paradigm.",
        },
        { br: "\n\n" }
      ),
    },
  };
}
