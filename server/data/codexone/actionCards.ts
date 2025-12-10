import { IntlShape } from "react-intl";

export default function getCodexOneActionCards(
  intl: IntlShape
): Record<CodexOne.ActionCardId, BaseActionCard> {
  return {
    Blitz: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Blitz.Description",
          defaultMessage:
            "At the start of an invasion:{br}Each of your non-fighter ships in the active system that does not have BOMBARDMENT gains BOMBARDMENT 6 until the end of the invasion.",
          description: "Description of action card: Blitz",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Blitz",
      name: intl.formatMessage({
        id: "Action Cards.Blitz.Name",
        defaultMessage: "Blitz",
        description: "Name of action card: Blitz",
      }),
      timing: "TACTICAL_ACTION",
    },
    Counterstroke: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Counterstroke.Description",
          defaultMessage:
            "After another player activates a system that contains 1 of your command tokens:{br}Return that command token to your tactic pool.",
          description: "Description of action card: Counterstroke",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Counterstroke",
      name: intl.formatMessage({
        id: "Action Cards.Counterstroke.Name",
        defaultMessage: "Counterstroke",
        description: "Name of action card: Counterstroke",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Fighter Conscription": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Fighter Conscription.Description",
          defaultMessage:
            "ACTION: Place 1 fighter from your reinforcements into each system that contains 1 or more of your space docks or ships that have a capacity value; they cannot be placed in systems that contain other players' ships.",
          description: "Description of action card: Fighter Conscription",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Fighter Conscription",
      name: intl.formatMessage({
        id: "Action Cards.Fighter Conscription.Name",
        defaultMessage: "Fighter Conscription",
        description: "Name of action card: Fighter Conscription",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Forward Supply Base": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Forward Supply Base.Description",
          defaultMessage:
            "After another player activates a system that contains your units:{br}Gain 3 trade goods. Then, choose another player to gain 1 trade good.",
          description: "Description of action card: Forward Supply Base",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Forward Supply Base",
      name: intl.formatMessage({
        id: "Action Cards.Forward Supply Base.Name",
        defaultMessage: "Forward Supply Base",
        description: "Name of action card: Forward Supply Base",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Ghost Squad": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Ghost Squad.Description",
          defaultMessage:
            "After a player commits units to land on a planet you control:{br}Move any number of ground forces from any planet you control in the active system to any other planet you control in the active system.",
          description: "Description of action card: Ghost Squad",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Ghost Squad",
      name: intl.formatMessage({
        id: "Action Cards.Ghost Squad.Name",
        defaultMessage: "Ghost Squad",
        description: "Name of action card: Ghost Squad",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Hack Election": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Hack Election.Description",
          defaultMessage:
            "After an agenda is revealed:{br}During this agenda, voting begins with the player to the right of the speaker and continues counterclockwise.",
          description: "Description of action card: Hack Election",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Hack Election",
      name: intl.formatMessage({
        id: "Action Cards.Hack Election.Name",
        defaultMessage: "Hack Election",
        description: "Name of action card: Hack Election",
      }),
      omegas: [
        // TODO: Fix this.
        {
          description: intl.formatMessage(
            {
              id: "Action Cards.Hack Election.TE.Description",
              defaultMessage:
                "After an agenda is revealed:{br}During this agenda, you vote last.",
              description: "Description of action card: Hack Election",
            },
            { br: "\n\n" }
          ),
          expansion: "THUNDERS EDGE",
        },
      ],
      timing: "AGENDA_PHASE",
    },
    "Harness Energy": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Harness Energy.Description",
          defaultMessage:
            "After you activate an anomaly:{br}Replenish your commodities.",
          description: "Description of action card: Harness Energy",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Harness Energy",
      name: intl.formatMessage({
        id: "Action Cards.Harness Energy.Name",
        defaultMessage: "Harness Energy",
        description: "Name of action card: Harness Energy",
      }),
      timing: "TACTICAL_ACTION",
    },
    Impersonation: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Impersonation.Description",
          defaultMessage:
            "ACTION: Spend 3 influence to draw 1 secret objective.",
          description: "Description of action card: Impersonation",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Impersonation",
      name: intl.formatMessage({
        id: "Action Cards.Impersonation.Name",
        defaultMessage: "Impersonation",
        description: "Name of action card: Impersonation",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Insider Information": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Insider Information.Description",
          defaultMessage:
            "After an agenda is revealed:{br}Look at the top card of the agenda deck.",
          description: "Description of action card: Insider Information",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Insider Information",
      name: intl.formatMessage({
        id: "Action Cards.Insider Information.Name",
        defaultMessage: "Insider Information",
        description: "Name of action card: Insider Information",
      }),
      omegas: [
        {
          description: intl.formatMessage(
            {
              id: "Action Cards.Insider Information.TE.Description",
              defaultMessage:
                "After an agenda is revealed:{br}Look at the top 3 cards of the agenda deck.",
              description: "Description of action card: Insider Information",
            },
            { br: "\n\n" }
          ),
          expansion: "THUNDERS EDGE",
        },
      ],
      timing: "AGENDA_PHASE",
    },
    "Master Plan": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Master Plan.Description",
          defaultMessage:
            "After you perform an action:{br}Perform an additional action.",
          description: "Description of action card: Master Plan",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Master Plan",
      name: intl.formatMessage({
        id: "Action Cards.Master Plan.Name",
        defaultMessage: "Master Plan",
        description: "Name of action card: Master Plan",
      }),
      timing: "OTHER",
    },
    Plagiarize: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Plagiarize.Description",
          defaultMessage:
            "ACTION: Spend 5 influence and choose a non-faction technology owned by one of your neighbors; gain that technology.",
          description: "Description of action card: Plagiarize",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Plagiarize",
      name: intl.formatMessage({
        id: "Action Cards.Plagiarize.Name",
        defaultMessage: "Plagiarize",
        description: "Name of action card: Plagiarize",
      }),
      timing: "COMPONENT_ACTION",
    },
    Rally: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Rally.Description",
          defaultMessage:
            "After you activate a system that contains another player's ships:{br}Place 2 command tokens from your reinforcements in your fleet pool.",
          description: "Description of action card: Rally",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Rally",
      name: intl.formatMessage({
        id: "Action Cards.Rally.Name",
        defaultMessage: "Rally",
        description: "Name of action card: Rally",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Reflective Shielding": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Reflective Shielding.Description",
          defaultMessage:
            "When one of your ships uses SUSTAIN DAMAGE during combat:{br}Produce 2 hits against your opponent's ships in the active system.",
          description: "Description of action card: Reflective Shielding",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Reflective Shielding",
      name: intl.formatMessage({
        id: "Action Cards.Reflective Shielding.Name",
        defaultMessage: "Reflective Shielding",
        description: "Name of action card: Reflective Shielding",
      }),
      timing: "TACTICAL_ACTION",
    },
    Sanction: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Sanction.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, each player that voted for that outcome returns 1 command token from their fleet supply to their reinforcements.",
          description: "Description of action card: Sanction",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Sanction",
      name: intl.formatMessage({
        id: "Action Cards.Sanction.Name",
        defaultMessage: "Sanction",
        description: "Name of action card: Sanction",
      }),
      timing: "AGENDA_PHASE",
    },
    "Scramble Frequency": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Scramble Frequency.Description",
          defaultMessage:
            "After another player makes a BOMBARDMENT, SPACE CANNON, or ANTI-FIGHTER BARRAGE roll:{br}That player rerolls all of their dice.",
          description: "Description of action card: Scramble Frequency",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Scramble Frequency",
      name: intl.formatMessage({
        id: "Action Cards.Scramble Frequency.Name",
        defaultMessage: "Scramble Frequency",
        description: "Name of action card: Scramble Frequency",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Solar Flare": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Solar Flare.Description",
          defaultMessage:
            'After you activate a system:{br}During the "Movement" step of this tactical action, other players cannot use SPACE CANNON against your ships.',
          description: "Description of action card: Solar Flare",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "Solar Flare",
      name: intl.formatMessage({
        id: "Action Cards.Solar Flare.Name",
        defaultMessage: "Solar Flare",
        description: "Name of action card: Solar Flare",
      }),
      timing: "TACTICAL_ACTION",
    },
    "War Machine": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.War Machine.Description",
          defaultMessage:
            "When 1 or more of your units use PRODUCTION:{br}Apply +4 to the total PRODUCTION value of those units and reduce the combined cost of the produced units by 1.",
          description: "Description of action card: War Machine",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX ONE",
      removedIn: "TWILIGHTS FALL",
      id: "War Machine",
      name: intl.formatMessage({
        id: "Action Cards.War Machine.Name",
        defaultMessage: "War Machine",
        description: "Name of action card: War Machine",
      }),
      timing: "TACTICAL_ACTION",
    },
  };
}
