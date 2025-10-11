import { IntlShape } from "react-intl";

export default function getThundersEdgeActionCards(
  intl: IntlShape
): Record<ThundersEdge.ActionCardId, BaseActionCard> {
  return {
    "Crash Landing": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Crash Landing.Description",
          defaultMessage:
            "When your last ship in the active system is destroyed:{br}Place 1 of your ground forces from the space area of the active system onto a planet in that system other than Mecatol Rex; if the planet contains other players' units, place your ground force into coexistence.",
          description: "Description of action card: Crash Landing",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Crash Landing",
      name: intl.formatMessage({
        id: "Action Cards.Crash Landing.Name",
        defaultMessage: "Crash Landing",
        description: "Name of action card: Crash Landing",
      }),
      timing: "TACTICAL_ACTION",
    },
    // TODO: Add ability to skip someone's turn.
    Crisis: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Crisis.Description",
          defaultMessage:
            "At the end of any player's turn, if there are at least 2 players who have not passed:{br}Skip the next player's turn.",
          description: "Description of action card: Crisis",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Crisis",
      name: intl.formatMessage({
        id: "Action Cards.Crisis.Name",
        defaultMessage: "Crisis",
        description: "Name of action card: Crisis",
      }),
      timing: "OTHER",
    },
    "Extreme Duress": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Extreme Duress.Description",
          defaultMessage:
            "At the start of another player's turn, if they have a readied strategy card:{br}If that player's next action is not a strategic action, they discard all of action cards, give you all of their trade goods, and show you all of their secret objectives.",
          description: "Description of action card: Extreme Duress",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Extreme Duress",
      name: intl.formatMessage({
        id: "Action Cards.Extreme Duress.Name",
        defaultMessage: "Extreme Duress",
        description: "Name of action card: Extreme Duress",
      }),
      timing: "OTHER",
    },
    "Lie in Wait": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Lie in Wait.Description",
          defaultMessage:
            "After 2 of your neighbors resolve a transaction:{br}Look at each of those player's hands of action cards, then choose and take 1 action card from each.",
          description: "Description of action card: Lie in Wait",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Lie in Wait",
      name: intl.formatMessage({
        id: "Action Cards.Lie in Wait.Name",
        defaultMessage: "Lie in Wait",
        description: "Name of action card: Lie in Wait",
      }),
      timing: "OTHER",
    },
    // TODO: Fix description
    "Mercenary Contract": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Mercenary Contract.Description",
          defaultMessage:
            "ACTION: Place (ground forces ???) on a non-home planet that contains no non-neutral units.",
          description: "Description of action card: Mercenary Contract",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Mercenary Contract",
      name: intl.formatMessage({
        id: "Action Cards.Mercenary Contract.Name",
        defaultMessage: "Mercenary Contract",
        description: "Name of action card: Mercenary Contract",
      }),
      timing: "COMPONENT_ACTION",
    },
    Overrule: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Overrule.Description",
          defaultMessage:
            "ACTION: Perform the primary ability of a readied or unchosen strategy card.",
          description: "Description of action card: Overrule",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Overrule",
      name: intl.formatMessage({
        id: "Action Cards.Overrule.Name",
        defaultMessage: "Overrule",
        description: "Name of action card: Overrule",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Pirate Contract": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Pirate Contract.Description",
          defaultMessage:
            "ACTION: Place 1 neutral destroyer in a non-home system that contains no non-neutral ships.",
          description: "Description of action card: Pirate Contract",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Pirate Contract",
      name: intl.formatMessage({
        id: "Action Cards.Pirate Contract.Name",
        defaultMessage: "Pirate Contract",
        description: "Name of action card: Pirate Contract",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Pirate Fleet": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Pirate Fleet.Description",
          defaultMessage:
            "ACTION: Spend 3 resources to place 1 neutral carrier, 1 neutral cruiser, 1 neutral destroyer, and 2 neutral fighters in a non-home system that contains no ships.",
          description: "Description of action card: Pirate Fleet",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Pirate Fleet",
      name: intl.formatMessage({
        id: "Action Cards.Pirate Fleet.Name",
        defaultMessage: "Pirate Fleet",
        description: "Name of action card: Pirate Fleet",
      }),
      timing: "COMPONENT_ACTION",
    },
    // TODO: Add ability to "unpass"
    "Puppets on a String": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Puppets on a String.Description",
          defaultMessage:
            "At the end of any player's turn, if you have passed:{br}Perform 1 action.",
          description: "Description of action card: Puppets on a String",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Puppets on a String",
      name: intl.formatMessage({
        id: "Action Cards.Puppets on a String.Name",
        defaultMessage: "Puppets on a String",
        description: "Name of action card: Puppets on a String",
      }),
      timing: "OTHER",
    },
    Rescue: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Rescue.Description",
          defaultMessage:
            "After another player moves ships into a system that contains your ships:{br}You may move 1 of your ships into the active system from any system that does not contain one of your command tokens.",
          description: "Description of action card: Rescue",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Rescue",
      name: intl.formatMessage({
        id: "Action Cards.Rescue.Name",
        defaultMessage: "Rescue",
        description: "Name of action card: Rescue",
      }),
      timing: "TACTICAL_ACTION",
    },
    // TODO: Add component details.
    Strategize: {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Strategize.Description",
          defaultMessage:
            "ACTION: Perform the secondary ability of any readied or unchosen strategy card.",
          description: "Description of action card: Strategize",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Strategize",
      name: intl.formatMessage({
        id: "Action Cards.Strategize.Name",
        defaultMessage: "Strategize",
        description: "Name of action card: Strategize",
      }),
      timing: "COMPONENT_ACTION",
    },
  };
}
