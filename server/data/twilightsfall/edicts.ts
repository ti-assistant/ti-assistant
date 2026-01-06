import { IntlShape } from "react-intl";

export default function getTwilightsFallEdicts(
  intl: IntlShape
): Record<TwilightsFall.TFEdictId, TFBaseEdict> {
  return {
    Arbitrate: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Arbitrate.Text",
          description: "Text of Twilight's Fall Edict: Arbitrate",
          defaultMessage:
            "You may discard any of your spliced cards. For each card you discarded, draw 1 card of that type. Then, you may allow any other players to do the same.",
        },
        { br: "\n\n" }
      ),
      id: "Arbitrate",
      name: intl.formatMessage({
        id: "TF.Edict.Arbitrate.Name",
        description: "Name of Twilight's Fall Edict: Arbitrate",
        defaultMessage: "Arbitrate",
      }),
    },
    Arise: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Arise.Text",
          description: "Text of Twilight's Fall Edict: Arise",
          defaultMessage:
            "Either place 1 infantry on each planet you control or place 1 fighter in each system that contains your ships.",
        },
        { br: "\n\n" }
      ),
      id: "Arise",
      name: intl.formatMessage({
        id: "TF.Edict.Arise.Name",
        description: "Name of Twilight's Fall Edict: Arise",
        defaultMessage: "Arise",
      }),
    },
    Artifice: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Artifice.Text",
          description: "Text of Twilight's Fall Edict: Artifice",
          defaultMessage:
            "Draw 1 relic and 1 paradigm; for each point behind the player with the most victory points you are, you may draw an additional card from either deck. Choose one of each type to keep and shuffle the rest back into their respective decks.",
        },
        { br: "\n\n" }
      ),
      id: "Artifice",
      name: intl.formatMessage({
        id: "TF.Edict.Artifice.Name",
        description: "Name of Twilight's Fall Edict: Artifice",
        defaultMessage: "Artifice",
      }),
    },
    Bless: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Bless.Text",
          description: "Text of Twilight's Fall Edict: Bless",
          defaultMessage:
            "Gain each of the following, then each other player chooses 1 of the following to gain:{br}1 command token{br}2 action cards{br}3 trade goods",
        },
        { br: "\n\n" }
      ),
      id: "Bless",
      name: intl.formatMessage({
        id: "TF.Edict.Bless.Name",
        description: "Name of Twilight's Fall Edict: Bless",
        defaultMessage: "Bless",
      }),
    },
    Censure: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Censure.Text",
          description: "Text of Twilight's Fall Edict: Censure",
          defaultMessage:
            "Place any player's control token on this card. That player cannot perform transactions during this game round. Discard this card at the end of the status phase.",
        },
        { br: "\n\n" }
      ),
      id: "Censure",
      name: intl.formatMessage({
        id: "TF.Edict.Censure.Name",
        description: "Name of Twilight's Fall Edict: Censure",
        defaultMessage: "Censure",
      }),
    },
    Convene: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Convene.Text",
          description: "Text of Twilight's Fall Edict: Convene",
          defaultMessage:
            "Reveal ability cards equal to the number of players. The speaker chooses 1 of them for you to gain. Then, you choose 1 ability for each other player to gain.",
        },
        { br: "\n\n" }
      ),
      id: "Convene",
      name: intl.formatMessage({
        id: "TF.Edict.Convene.Name",
        description: "Name of Twilight's Fall Edict: Convene",
        defaultMessage: "Convene",
      }),
    },
    Execute: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Execute.Text",
          description: "Text of Twilight's Fall Edict: Execute",
          defaultMessage:
            "Choose up to 3 planets; destroy half of the infantry on each of those planets, rounded up.",
        },
        { br: "\n\n" }
      ),
      id: "Execute",
      name: intl.formatMessage({
        id: "TF.Edict.Execute.Name",
        description: "Name of Twilight's Fall Edict: Execute",
        defaultMessage: "Execute",
      }),
    },
    Foretell: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Foretell.Text",
          description: "Text of Twilight's Fall Edict: Foretell",
          defaultMessage: "Look at up to 3 unrevealed public objectives.",
        },
        { br: "\n\n" }
      ),
      id: "Foretell",
      name: intl.formatMessage({
        id: "TF.Edict.Foretell.Name",
        description: "Name of Twilight's Fall Edict: Foretell",
        defaultMessage: "Foretell",
      }),
    },
    "Legacy of Ixth": {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Legacy of Ixth.Text",
          description: "Text of Twilight's Fall Edict: Legacy of Ixth",
          defaultMessage:
            "Roll 1 die:{br}1-5: Destroy each unit in the Mecatol Rex system, then each player destroys 3 of their units in each system adjacent to Mecatol Rex.{br}6-9: Each player draws 1 spliced card from any deck.{br}10: Draw up to 2 spliced cards from any decks.",
        },
        { br: "\n\n" }
      ),
      id: "Legacy of Ixth",
      name: intl.formatMessage({
        id: "TF.Edict.Legacy of Ixth.Name",
        description: "Name of Twilight's Fall Edict: Legacy of Ixth",
        defaultMessage: "Legacy of Ixth",
      }),
    },
    Splice: {
      description: intl.formatMessage(
        {
          id: "TF.Edict.Splice.Text",
          description: "Text of Twilight's Fall Edict: Splice",
          defaultMessage:
            "Initiate a splice of any type, including all players.",
        },
        { br: "\n\n" }
      ),
      id: "Splice",
      name: intl.formatMessage({
        id: "TF.Edict.Splice.Name",
        description: "Name of Twilight's Fall Edict: Splice",
        defaultMessage: "Splice",
      }),
    },
  };
}
