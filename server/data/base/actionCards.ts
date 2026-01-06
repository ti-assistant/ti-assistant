import { IntlShape } from "react-intl";

export default function getBaseActionCards(
  intl: IntlShape
): Record<BaseGame.ActionCardId, BaseActionCard> {
  return {
    "Ancient Burial Sites": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Ancient Burial Sites.Description",
          defaultMessage:
            "At the start of the agenda phase:{br}Choose 1 player. Exhause each cultural planet owned by that player.",
          description: "Description of action card: Ancient Burial Sites",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Ancient Burial Sites",
      name: intl.formatMessage({
        id: "Action Cards.Ancient Burial Sites.Name",
        defaultMessage: "Ancient Burial Sites",
        description: "Name of action card: Ancient Burial Sites",
      }),
      timing: "AGENDA_PHASE_START",
    },
    "Assassinate Representative": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Assassinate Representative.Description",
          defaultMessage:
            "After an agenda is revealed:{br}Choose 1 player. That player cannot vote on this agenda.",
          description: "Description of action card: Assassinate Representative",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Assassinate Representative",
      name: intl.formatMessage({
        id: "Action Cards.Assassinate Representative.Name",
        defaultMessage: "Assassinate Representative",
        description: "Name of action card: Assassinate Representative",
      }),
      timing: "AGENDA_PHASE",
    },
    Bribery: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Bribery.Description",
          defaultMessage:
            "After the speaker votes on an agenda:{br}Spend any number of trade goods. For each trade good spent, cast 1 additional vote for the outcome on which you voted.",
          description: "Description of action card: Bribery",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Bribery",
      name: intl.formatMessage({
        id: "Action Cards.Bribery.Name",
        defaultMessage: "Bribery",
        description: "Name of action card: Bribery",
      }),
      timing: "AGENDA_PHASE",
    },
    Bunker: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Bunker.Description",
          defaultMessage:
            "At the start of an invasion:{br}During this invasion, apply -4 to the result of each BOMBARDMENT roll against planets you control.",
          description: "Description of action card: Bunker",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Bunker",
      name: intl.formatMessage({
        id: "Action Cards.Bunker.Name",
        defaultMessage: "Bunker",
        description: "Name of action card: Bunker",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Confusing Legal Text": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Confusing Legal Text.Description",
          defaultMessage:
            "When you are elected as the outcome of an agenda:{br}Choose 1 player. That player is the elected player instead.",
          description: "Description of action card: Confusing Legal Text",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Confusing Legal Text",
      name: intl.formatMessage({
        id: "Action Cards.Confusing Legal Text.Name",
        defaultMessage: "Confusing Legal Text",
        description: "Name of action card: Confusing Legal Text",
      }),
      timing: "AGENDA_PHASE",
    },
    "Construction Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Construction Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, place 1 space dock from your reinforcements on a planet you control.",
          description: "Description of action card: Construction Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Construction Rider",
      name: intl.formatMessage({
        id: "Action Cards.Construction Rider.Name",
        defaultMessage: "Construction Rider",
        description: "Name of action card: Construction Rider",
      }),
      timing: "AGENDA_PHASE",
    },
    "Courageous to the End": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Courageous to the End.Description",
          defaultMessage:
            "After 1 of your ships is destroyed during a space combat:{br}Roll 2 dice. For each result equal to or greater than that ship's combat value, your opponent must choose and destroy 1 of their ships.",
          description: "Description of action card: Courageous to the End",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Courageous to the End",
      name: intl.formatMessage({
        id: "Action Cards.Courageous to the End.Name",
        defaultMessage: "Courageous to the End",
        description: "Name of action card: Courageous to the End",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Cripple Defenses": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Cripple Defenses.Description",
          defaultMessage:
            "ACTION: Choose 1 planet. Destroy each PDS on that planet.",
          description: "Description of action card: Cripple Defenses",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Cripple Defenses",
      name: intl.formatMessage({
        id: "Action Cards.Cripple Defenses.Name",
        defaultMessage: "Cripple Defenses",
        description: "Name of action card: Cripple Defenses",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Diplomacy Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Diplomacy Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, choose 1 system that contains a planet you control. Each other player places a command token from their reinforcements in that system.",
          description: "Description of action card: Diplomacy Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Diplomacy Rider",
      name: intl.formatMessage({
        id: "Action Cards.Diplomacy Rider.Name",
        defaultMessage: "Diplomacy Rider",
        description: "Name of action card: Diplomacy Rider",
      }),
      timing: "AGENDA_PHASE",
    },
    "Direct Hit": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Direct Hit.Description",
          defaultMessage:
            "After another player's ship uses SUSTAIN DAMAGE to cancel a hit produced by your units or abilities:{br}Destroy that ship.",
          description: "Description of action card: Direct Hit",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Direct Hit",
      name: intl.formatMessage({
        id: "Action Cards.Direct Hit.Name",
        defaultMessage: "Direct Hit",
        description: "Name of action card: Direct Hit",
      }),
      timing: "TACTICAL_ACTION",
    },
    Disable: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Disable.Description",
          defaultMessage:
            "At the start of an invasion in a system that contains 1 or more of your opponents' PDS units:{br}Your opponents' PDS units lose PLANETARY SHIELD and SPACE CANNON during this invasion.",
          description: "Description of action card: Disable",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Disable",
      name: intl.formatMessage({
        id: "Action Cards.Disable.Name",
        defaultMessage: "Disable",
        description: "Name of action card: Disable",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Distinguished Councilor": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Distinguished Councilor.Description",
          defaultMessage:
            "After you cast votes on an outcome of an agenda:{br}Cast 5 additional votes for that outcome.",
          description: "Description of action card: Distinguished Councilor",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Distinguished Councilor",
      name: intl.formatMessage({
        id: "Action Cards.Distinguished Councilor.Name",
        defaultMessage: "Distinguished Councilor",
        description: "Name of action card: Distinguished Councilor",
      }),
      timing: "AGENDA_PHASE",
    },
    "Economic Initiative": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Economic Initiative.Description",
          defaultMessage: "ACTION: Ready each cultural planet you control.",
          description: "Description of action card: Economic Initiative",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Economic Initiative",
      name: intl.formatMessage({
        id: "Action Cards.Economic Initiative.Name",
        defaultMessage: "Economic Initiative",
        description: "Name of action card: Economic Initiative",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Emergency Repairs": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Emergency Repairs.Description",
          defaultMessage:
            "At the start or end of a combat round:{br}Repair all of your units that have SUSTAIN DAMAGE in the active system.",
          description: "Description of action card: Emergency Repairs",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Emergency Repairs",
      name: intl.formatMessage({
        id: "Action Cards.Emergency Repairs.Name",
        defaultMessage: "Emergency Repairs",
        description: "Name of action card: Emergency Repairs",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Experimental Battlestation": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Experimental Battlestation.Description",
          defaultMessage:
            "After another player moves ships into a system during a tactical action:{br}Choose 1 of your space docks that is either in or adjacent to that system. That space dock uses SPACE CANNON 5 (x3) against ships in the active system.",
          description: "Description of action card: Experimental Battlestation",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Experimental Battlestation",
      name: intl.formatMessage({
        id: "Action Cards.Experimental Battlestation.Name",
        defaultMessage: "Experimental Battlestation",
        description: "Name of action card: Experimental Battlestation",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Fighter Prototype": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Fighter Prototype.Description",
          defaultMessage:
            "At the start of the first round of a space combat:{br}Apply +2 to the result of each of your fighters' combat rolls during this combat round.",
          description: "Description of action card: Fighter Prototype",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Fighter Prototype",
      name: intl.formatMessage({
        id: "Action Cards.Fighter Prototype.Name",
        defaultMessage: "Fighter Prototype",
        description: "Name of action card: Fighter Prototype",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Fire Team": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Fire Team.Description",
          defaultMessage:
            "After your ground forces make combat rolls during a round of ground combat:{br}Reroll any number of your dice.",
          description: "Description of action card: Fire Team",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Fire Team",
      name: intl.formatMessage({
        id: "Action Cards.Fire Team.Name",
        defaultMessage: "Fire Team",
        description: "Name of action card: Fire Team",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Flank Speed": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Flank Speed.Description",
          defaultMessage:
            "After you activate a system:{br}Apply +1 to the move value of each of your ships during this tactical action.",
          description: "Description of action card: Flank Speed",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Flank Speed",
      name: intl.formatMessage({
        id: "Action Cards.Flank Speed.Name",
        defaultMessage: "Flank Speed",
        description: "Name of action card: Flank Speed",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Focused Research": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Focused Research.Description",
          defaultMessage:
            "ACTION: Spend 4 trade goods to research 1 technology.",
          description: "Description of action card: Focused Research",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Focused Research",
      name: intl.formatMessage({
        id: "Action Cards.Focused Research.Name",
        defaultMessage: "Focused Research",
        description: "Name of action card: Focused Research",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Frontline Deployment": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Frontline Deployment.Description",
          defaultMessage:
            "ACTION: Place 3 infantry from your reinforcements on 1 planet you control.",
          description: "Description of action card: Frontline Deployment",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Frontline Deployment",
      name: intl.formatMessage({
        id: "Action Cards.Frontline Deployment.Name",
        defaultMessage: "Frontline Deployment",
        description: "Name of action card: Frontline Deployment",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Ghost Ship": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Ghost Ship.Description",
          defaultMessage:
            "ACTION: Place 1 destroyer from your reinforcements in a non-home system that contains a wormhole and does not contain other players' ships.",
          description: "Description of action card: Ghost Ship",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Ghost Ship",
      name: intl.formatMessage({
        id: "Action Cards.Ghost Ship.Name",
        defaultMessage: "Ghost Ship",
        description: "Name of action card: Ghost Ship",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Imperial Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Imperial Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, gain 1 victory point.",
          description: "Description of action card: Imperial Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Imperial Rider",
      name: intl.formatMessage({
        id: "Action Cards.Imperial Rider.Name",
        defaultMessage: "Imperial Rider",
        description: "Name of action card: Imperial Rider",
      }),
      timing: "AGENDA_PHASE",
    },
    "In The Silence Of Space": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.In The Silence Of Space.Description",
          defaultMessage:
            "After you activate a system:{br}Choose 1 system. During this tactical action, your ships in the chosen system can move through systems that contain other players' ships.",
          description: "Description of action card: In The Silence Of Space",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "In The Silence Of Space",
      name: intl.formatMessage({
        id: "Action Cards.In The Silence Of Space.Name",
        defaultMessage: "In The Silence Of Space",
        description: "Name of action card: In The Silence Of Space",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Industrial Initiative": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Industrial Initiative.Description",
          defaultMessage:
            "ACTION: Gain 1 trade good for each industrial planet you control.",
          description: "Description of action card: Industrial Initiative",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Industrial Initiative",
      name: intl.formatMessage({
        id: "Action Cards.Industrial Initiative.Name",
        defaultMessage: "Industrial Initiative",
        description: "Name of action card: Industrial Initiative",
      }),
      timing: "COMPONENT_ACTION",
    },
    Infiltrate: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Infiltrate.Description",
          defaultMessage:
            "When you gain control of a planet:{br}Replace each PDS and space dock that is on that planet with a matching unit from your reinforcements.",
          description: "Description of action card: Infiltrate",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Infiltrate",
      name: intl.formatMessage({
        id: "Action Cards.Infiltrate.Name",
        defaultMessage: "Infiltrate",
        description: "Name of action card: Infiltrate",
      }),
      timing: "TACTICAL_ACTION",
    },
    Insubordination: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Insubordination.Description",
          defaultMessage:
            "ACTION: Remove 1 token from another player's tactic pool and return it to their reinforcements.",
          description: "Description of action card: Insubordination",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Insubordination",
      name: intl.formatMessage({
        id: "Action Cards.Insubordination.Name",
        defaultMessage: "Insubordination",
        description: "Name of action card: Insubordination",
      }),
      timing: "COMPONENT_ACTION",
    },
    Intercept: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Intercept.Description",
          defaultMessage:
            "After your opponent declares a retreat during a space combat:{br}Your opponent cannot retreat during this round of space combat.",
          description: "Description of action card: Intercept",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Intercept",
      name: intl.formatMessage({
        id: "Action Cards.Intercept.Name",
        defaultMessage: "Intercept",
        description: "Name of action card: Intercept",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Leadership Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Leadership Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, gain 3 command tokens.",
          description: "Description of action card: Leadership Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Leadership Rider",
      name: intl.formatMessage({
        id: "Action Cards.Leadership Rider.Name",
        defaultMessage: "Leadership Rider",
        description: "Name of action card: Leadership Rider",
      }),
      timing: "AGENDA_PHASE",
    },
    "Lost Star Chart": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Lost Star Chart.Description",
          defaultMessage:
            "After you activate a system:{br}During this tactical action, systems that contain alpha and beta wormholes are adjacent to each other.",
          description: "Description of action card: Lost Star Chart",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Lost Star Chart",
      name: intl.formatMessage({
        id: "Action Cards.Lost Star Chart.Name",
        defaultMessage: "Lost Star Chart",
        description: "Name of action card: Lost Star Chart",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Lucky Shot": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Lucky Shot.Description",
          defaultMessage:
            "ACTION: Destroy 1 dreadnought, cruiser, or destroyer in a system that contains a planet you control.",
          description: "Description of action card: Lucky Shot",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Lucky Shot",
      name: intl.formatMessage({
        id: "Action Cards.Lucky Shot.Name",
        defaultMessage: "Lucky Shot",
        description: "Name of action card: Lucky Shot",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Maneuvering Jets": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Maneuvering Jets.Description",
          defaultMessage:
            "Before you assign hits produced by another player's SPACE CANNON roll:{br}Cancel 1 hit.",
          description: "Description of action card: Maneuvering Jets",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Maneuvering Jets",
      name: intl.formatMessage({
        id: "Action Cards.Maneuvering Jets.Name",
        defaultMessage: "Maneuvering Jets",
        description: "Name of action card: Maneuvering Jets",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Mining Initiative": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Mining Initiative.Description",
          defaultMessage:
            "ACTION: Gain trade goods equal to the resource value of 1 planet you control.",
          description: "Description of action card: Mining Initiative",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Mining Initiative",
      name: intl.formatMessage({
        id: "Action Cards.Mining Initiative.Name",
        defaultMessage: "Mining Initiative",
        description: "Name of action card: Mining Initiative",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Morale Boost": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Morale Boost.Description",
          defaultMessage:
            "At the start of a combat round:{br}Apply +1 to the result of each of your unit's combat rolls during this combat round.",
          description: "Description of action card: Morale Boost",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Morale Boost",
      name: intl.formatMessage({
        id: "Action Cards.Morale Boost.Name",
        defaultMessage: "Morale Boost",
        description: "Name of action card: Morale Boost",
      }),
      timing: "TACTICAL_ACTION",
    },
    Parley: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Parley.Description",
          defaultMessage:
            "After another player commits units to land on a planet you control:{br}Return the committed units to the space area.",
          description: "Description of action card: Parley",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Parley",
      name: intl.formatMessage({
        id: "Action Cards.Parley.Name",
        defaultMessage: "Parley",
        description: "Name of action card: Parley",
      }),
      timing: "TACTICAL_ACTION",
    },
    Plague: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Plague.Description",
          defaultMessage:
            "ACTION: Choose 1 planet that is controlled by another player. Roll 1 die for each infantry on that planet. For each result of 6 or greater, destroy 1 of those units.",
          description: "Description of action card: Plague",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Plague",
      name: intl.formatMessage({
        id: "Action Cards.Plague.Name",
        defaultMessage: "Plague",
        description: "Name of action card: Plague",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Political Stability": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Political Stability.Description",
          defaultMessage:
            "When you would return your strategy card(s) during the status phase:{br}Do not return your strategy card(s). You do not choose strategy cards during the next strategy phase.",
          description: "Description of action card: Political Stability",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Political Stability",
      name: intl.formatMessage({
        id: "Action Cards.Political Stability.Name",
        defaultMessage: "Political Stability",
        description: "Name of action card: Political Stability",
      }),
      timing: "OTHER",
    },
    "Politics Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Politics Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, draw 3 action cards and gain the speaker token.",
          description: "Description of action card: Politics Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Politics Rider",
      name: intl.formatMessage({
        id: "Action Cards.Politics Rider.Name",
        defaultMessage: "Politics Rider",
        description: "Name of action card: Politics Rider",
      }),
      timing: "AGENDA_PHASE",
    },
    "Public Disgrace": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Public Disgrace.Description",
          defaultMessage:
            "When another player chooses a strategy card during the strategy phase:{br}That player must choose a different strategy card instead, if able.",
          description: "Description of action card: Public Disgrace",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Public Disgrace",
      name: intl.formatMessage({
        id: "Action Cards.Public Disgrace.Name",
        defaultMessage: "Public Disgrace",
        description: "Name of action card: Public Disgrace",
      }),
      timing: "OTHER",
    },
    "Reactor Meltdown": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Reactor Meltdown.Description",
          defaultMessage: "ACTION: Destroy 1 space dock in a non-home system.",
          description: "Description of action card: Reactor Meltdown",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Reactor Meltdown",
      name: intl.formatMessage({
        id: "Action Cards.Reactor Meltdown.Name",
        defaultMessage: "Reactor Meltdown",
        description: "Name of action card: Reactor Meltdown",
      }),
      timing: "COMPONENT_ACTION",
    },
    Reparations: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Reparations.Description",
          defaultMessage:
            "After another player gains control of a planet you control:{br}Exhaust 1 planet that player controls and ready 1 planet you control.",
          description: "Description of action card: Reparations",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Reparations",
      name: intl.formatMessage({
        id: "Action Cards.Reparations.Name",
        defaultMessage: "Reparations",
        description: "Name of action card: Reparations",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Repeal Law": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Repeal Law.Description",
          defaultMessage: "ACTION: Discard 1 law from play.",
          description: "Description of action card: Repeal Law",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Repeal Law",
      name: intl.formatMessage({
        id: "Action Cards.Repeal Law.Name",
        defaultMessage: "Repeal Law",
        description: "Name of action card: Repeal Law",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Rise of a Messiah": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Rise of a Messiah.Description",
          defaultMessage:
            "ACTION: Place 1 infantry from your reinforcements on each planet you control.",
          description: "Description of action card: Rise of a Messiah",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Rise of a Messiah",
      name: intl.formatMessage({
        id: "Action Cards.Rise of a Messiah.Name",
        defaultMessage: "Rise of a Messiah",
        description: "Name of action card: Rise of a Messiah",
      }),
      timing: "COMPONENT_ACTION",
    },
    Sabotage: {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Sabotage.Description",
          defaultMessage:
            'When another player plays an action card other than "Sabotage":{br}Cancel that action card.',
          description: "Description of action card: Sabotage",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Sabotage",
      name: intl.formatMessage({
        id: "Action Cards.Sabotage.Name",
        defaultMessage: "Sabotage",
        description: "Name of action card: Sabotage",
      }),
      timing: "OTHER",
    },
    Salvage: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Salvage.Description",
          defaultMessage:
            "After you win a space combat:{br}Your opponent gives you all of their commodities.",
          description: "Description of action card: Salvage",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Salvage",
      name: intl.formatMessage({
        id: "Action Cards.Salvage.Name",
        defaultMessage: "Salvage",
        description: "Name of action card: Salvage",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Shields Holding": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Shields Holding.Description",
          defaultMessage:
            "Before you assign hits to your ships during a space combat:{br}Cancel up to 2 hits.",
          description: "Description of action card: Shields Holding",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Shields Holding",
      name: intl.formatMessage({
        id: "Action Cards.Shields Holding.Name",
        defaultMessage: "Shields Holding",
        description: "Name of action card: Shields Holding",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Signal Jamming": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Signal Jamming.Description",
          defaultMessage:
            "ACTION: Chose 1 non-home system that contains or is adjacent to 1 of your ships. Place a command token from another player's reinforcements in that system.",
          description: "Description of action card: Signal Jamming",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Signal Jamming",
      name: intl.formatMessage({
        id: "Action Cards.Signal Jamming.Name",
        defaultMessage: "Signal Jamming",
        description: "Name of action card: Signal Jamming",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Skilled Retreat": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Skilled Retreat.Description",
          defaultMessage:
            "At the start of a combat round:{br}Move all of your ships from the active system into an adjacent system that does not contain another player's ships; the space combat ends in a draw. Then, place a command token from your reinforcements in that system.",
          description: "Description of action card: Skilled Retreat",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Skilled Retreat",
      name: intl.formatMessage({
        id: "Action Cards.Skilled Retreat.Name",
        defaultMessage: "Skilled Retreat",
        description: "Name of action card: Skilled Retreat",
      }),
      timing: "TACTICAL_ACTION",
    },
    Spy: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Spy.Description",
          defaultMessage:
            "ACTION: Choose 1 player. That player gives you 1 random action card from their hand.",
          description: "Description of action card: Spy",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Spy",
      name: intl.formatMessage({
        id: "Action Cards.Spy.Name",
        defaultMessage: "Spy",
        description: "Name of action card: Spy",
      }),
      timing: "COMPONENT_ACTION",
    },
    Summit: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Summit.Description",
          defaultMessage:
            "At the start of the strategy phase:{br}Gain 2 command tokens.",
          description: "Description of action card: Summit",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Summit",
      name: intl.formatMessage({
        id: "Action Cards.Summit.Name",
        defaultMessage: "Summit",
        description: "Name of action card: Summit",
      }),
      timing: "OTHER",
    },
    "Tactical Bombardment": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Tactical Bombardment.Description",
          defaultMessage:
            "ACTION: Choose 1 system that contains 1 or more of your units that have BOMBARDMENT. Exhaust each planet controlled by other players in that system.",
          description: "Description of action card: Tactical Bombardment",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Tactical Bombardment",
      name: intl.formatMessage({
        id: "Action Cards.Tactical Bombardment.Name",
        defaultMessage: "Tactical Bombardment",
        description: "Name of action card: Tactical Bombardment",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Technology Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Technology Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, research 1 technology.",
          description: "Description of action card: Technology Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Technology Rider",
      name: intl.formatMessage({
        id: "Action Cards.Technology Rider.Name",
        defaultMessage: "Technology Rider",
        description: "Name of action card: Technology Rider",
      }),
      timing: "AGENDA_PHASE",
    },
    "Trade Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Trade Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, gain 5 trade goods.",
          description: "Description of action card: Trade Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Trade Rider",
      name: intl.formatMessage({
        id: "Action Cards.Trade Rider.Name",
        defaultMessage: "Trade Rider",
        description: "Name of action card: Trade Rider",
      }),
      timing: "AGENDA_PHASE",
    },
    "Unexpected Action": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Unexpected Action.Description",
          defaultMessage:
            "ACTION: Remove 1 of your command tokens from the game board and return it to your reinforcements.",
          description: "Description of action card: Unexpected Action",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Unexpected Action",
      name: intl.formatMessage({
        id: "Action Cards.Unexpected Action.Name",
        defaultMessage: "Unexpected Action",
        description: "Name of action card: Unexpected Action",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Unstable Planet": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Unstable Planet.Description",
          defaultMessage:
            "ACTION: Choose 1 hazardous planet. Exhaust that planet and destroy up to 3 infantry on it.",
          description: "Description of action card: Unstable Planet",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Unstable Planet",
      name: intl.formatMessage({
        id: "Action Cards.Unstable Planet.Name",
        defaultMessage: "Unstable Planet",
        description: "Name of action card: Unstable Planet",
      }),
      timing: "COMPONENT_ACTION",
    },
    Upgrade: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Upgrade.Description",
          defaultMessage:
            "After you activate a system that contains 1 or more of your ships:{br}Replace one of your cruisers in that system with one of your dreadnoughts from your reinforcements.",
          description: "Description of action card: Upgrade",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Upgrade",
      name: intl.formatMessage({
        id: "Action Cards.Upgrade.Name",
        defaultMessage: "Upgrade",
        description: "Name of action card: Upgrade",
      }),
      timing: "TACTICAL_ACTION",
    },
    Uprising: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Uprising.Description",
          defaultMessage:
            "ACTION: Exhaust 1 non-home planet controlled by another player. Then gain trade goods equal to its resource value.",
          description: "Description of action card: Uprising",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Uprising",
      name: intl.formatMessage({
        id: "Action Cards.Uprising.Name",
        defaultMessage: "Uprising",
        description: "Name of action card: Uprising",
      }),
      timing: "COMPONENT_ACTION",
    },
    Veto: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Veto.Description",
          defaultMessage:
            "When an agenda is revealed:{br}Discard that agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead.",
          description: "Description of action card: Veto",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Veto",
      name: intl.formatMessage({
        id: "Action Cards.Veto.Name",
        defaultMessage: "Veto",
        description: "Name of action card: Veto",
      }),
      timing: "AGENDA_PHASE",
    },
    "War Effort": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.War Effort.Description",
          defaultMessage:
            "ACTION: Place 1 cruiser from your reinforcements in a system that contains 1 or more of your ships.",
          description: "Description of action card: War Effort",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "War Effort",
      name: intl.formatMessage({
        id: "Action Cards.War Effort.Name",
        defaultMessage: "War Effort",
        description: "Name of action card: War Effort",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Warfare Rider": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Warfare Rider.Description",
          defaultMessage:
            "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, place 1 dreadnought from your reinforcements in a system that contains 1 or more of your ships.",
          description: "Description of action card: Warfare Rider",
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      removedIn: "TWILIGHTS FALL",
      id: "Warfare Rider",
      name: intl.formatMessage({
        id: "Action Cards.Warfare Rider.Name",
        defaultMessage: "Warfare Rider",
        description: "Name of action card: Warfare Rider",
      }),
      timing: "AGENDA_PHASE",
    },
  };
}
