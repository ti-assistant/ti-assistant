import { IntlShape } from "react-intl";

export default function getProphecyOfKingsActionCards(
  intl: IntlShape
): Record<ProphecyOfKings.ActionCardId, BaseActionCard> {
  return {
    "Archaeological Expedition": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Archaeological Expedition.Description",
          defaultMessage:
            "ACTION: Reveal the top 3 cards of an exploration deck that matches a planet you control; gain any relic fragments that you reveal and discard the rest.",
          description: "Description of action card: Archaeological Expedition",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Archaeological Expedition",
      name: intl.formatMessage({
        id: "Action Cards.Archaeological Expedition.Name",
        defaultMessage: "Archaeological Expedition",
        description: "Name of action card: Archaeological Expedition",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Confounding Legal Text": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Confounding Legal Text.Description",
          defaultMessage:
            "When another player is elected as the outcome of an agenda:{br}You are the elected player instead.",
          description: "Description of action card: Confounding Legal Text",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Confounding Legal Text",
      name: intl.formatMessage({
        id: "Action Cards.Confounding Legal Text.Name",
        defaultMessage: "Confounding Legal Text",
        description: "Name of action card: Confounding Legal Text",
      }),
      timing: "AGENDA_PHASE",
    },
    "Coup d'Etat": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Coup d'Etat.Description",
          defaultMessage:
            "When another player would perform a strategic action:{br}End that player's trun; that strategic action is not resolved and the strategy card is not exhausted.",
          description: "Description of action card: Coup d'Etat",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Coup d'Etat",
      name: intl.formatMessage({
        id: "Action Cards.Coup d'Etat.Name",
        defaultMessage: "Coup d'Etat",
        description: "Name of action card: Coup d'Etat",
      }),
      timing: "OTHER",
    },
    "Deadly Plot": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Deadly Plot.Description",
          defaultMessage:
            "During the agenda phase, when an outcome would be resolved:{br}If you voted for or predicted another outcome, discard the agenda instead; the agenda is resolved with no effect and it is not replaced.{br}Then, exhaust all of your planets.",
          description: "Description of action card: Deadly Plot",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Deadly Plot",
      name: intl.formatMessage({
        id: "Action Cards.Deadly Plot.Name",
        defaultMessage: "Deadly Plot",
        description: "Name of action card: Deadly Plot",
      }),
      timing: "AGENDA_PHASE",
    },
    "Decoy Operation": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Decoy Operation.Description",
          defaultMessage:
            "After another player activates a system that contains 1 or more of your structures:{br}Remove up to 2 of your ground forces from the game board and place them on a planet you control in the active system.",
          description: "Description of action card: Decoy Operation",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Decoy Operation",
      name: intl.formatMessage({
        id: "Action Cards.Decoy Operation.Name",
        defaultMessage: "Decoy Operation",
        description: "Name of action card: Decoy Operation",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Diplomatic Pressure": {
      count: 4,
      description: intl.formatMessage(
        {
          id: "Action Cards.Diplomatic Pressure.Description",
          defaultMessage:
            "When an agenda is revealed:{br}Choose another player; that player must give you 1 promissory note from their hand.",
          description: "Description of action card: Diplomatic Pressure",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Diplomatic Pressure",
      name: intl.formatMessage({
        id: "Action Cards.Diplomatic Pressure.Name",
        defaultMessage: "Diplomatic Pressure",
        description: "Name of action card: Diplomatic Pressure",
      }),
      timing: "AGENDA_PHASE",
    },
    "Divert Funding": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Divert Funding.Description",
          defaultMessage:
            "ACTION: Return a non-unit upgrade, non-faction technology that you own to your technology deck.{br}Then, research another technology.",
          description: "Description of action card: Divert Funding",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Divert Funding",
      name: intl.formatMessage({
        id: "Action Cards.Divert Funding.Name",
        defaultMessage: "Divert Funding",
        description: "Name of action card: Divert Funding",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Exploration Probe": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Exploration Probe.Description",
          defaultMessage:
            "ACTION: Explore a frontier token that is in or adjacent to a system that contains 1 or more of your ships.",
          description: "Description of action card: Exploration Probe",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Exploration Probe",
      name: intl.formatMessage({
        id: "Action Cards.Exploration Probe.Name",
        defaultMessage: "Exploration Probe",
        description: "Name of action card: Exploration Probe",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Manipulate Investments": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Manipulate Investments.Description",
          defaultMessage:
            "At the start of the strategy phase:{br}Place a total of 5 trade goods from the supply on strategy cards of your choice; you must place these tokens on at least 3 different cards.",
          description: "Description of action card: Manipulate Investments",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Manipulate Investments",
      name: intl.formatMessage({
        id: "Action Cards.Manipulate Investments.Name",
        defaultMessage: "Manipulate Investments",
        description: "Name of action card: Manipulate Investments",
      }),
      timing: "OTHER",
    },
    "Nav Suite": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Nav Suite.Description",
          defaultMessage:
            'After you activate a system:{br}During the "Movement" step of this tactical action, ignore the effect of anomalies.',
          description: "Description of action card: Nav Suite",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Nav Suite",
      name: intl.formatMessage({
        id: "Action Cards.Nav Suite.Name",
        defaultMessage: "Nav Suite",
        description: "Name of action card: Nav Suite",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Refit Troops": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Refit Troops.Description",
          defaultMessage:
            "ACTION: Choose 1 or 2 of your infantry on the game board; replace each of those infantry with mechs.",
          description: "Description of action card: Refit Troops",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Refit Troops",
      name: intl.formatMessage({
        id: "Action Cards.Refit Troops.Name",
        defaultMessage: "Refit Troops",
        description: "Name of action card: Refit Troops",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Reveal Prototype": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Reveal Prototype.Description",
          defaultMessage:
            "At the start of a combat:{br}Spend 4 resources to research a unit upgrade technology of the same type as 1 of your units that is participating in this combat.",
          description: "Description of action card: Reveal Prototype",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Reveal Prototype",
      name: intl.formatMessage({
        id: "Action Cards.Reveal Prototype.Name",
        defaultMessage: "Reveal Prototype",
        description: "Name of action card: Reveal Prototype",
      }),
      timing: "TACTICAL_ACTION",
    },
    "Reverse Engineer": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Reverse Engineer.Description",
          defaultMessage:
            "After another player discards an action card that has a component action:{br}Take that action card from the discard pile.",
          description: "Description of action card: Reverse Engineer",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Reverse Engineer",
      name: intl.formatMessage({
        id: "Action Cards.Reverse Engineer.Name",
        defaultMessage: "Reverse Engineer",
        description: "Name of action card: Reverse Engineer",
      }),
      timing: "OTHER",
    },
    Rout: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Rout.Description",
          defaultMessage:
            'At the start of the "Announce Retreats" step of space combat, if you are the defender:{br}Your opponent must announce a retreat, if able.',
          description: "Description of action card: Rout",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Rout",
      name: intl.formatMessage({
        id: "Action Cards.Rout.Name",
        defaultMessage: "Rout",
        description: "Name of action card: Rout",
      }),
      timing: "TACTICAL_ACTION",
    },
    Scuttle: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Scuttle.Description",
          defaultMessage:
            "ACTION: Choose 1 or 2 of your non-fighter ships on the game board and return them to your reinforcements; gain trade goods equal to the combined cost of those ships.",
          description: "Description of action card: Scuttle",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Scuttle",
      name: intl.formatMessage({
        id: "Action Cards.Scuttle.Name",
        defaultMessage: "Scuttle",
        description: "Name of action card: Scuttle",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Seize Artifact": {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Seize Artifact.Description",
          defaultMessage:
            "ACTION: Choose 1 of your neighbors that has 1 or more relic fragments. That player must give you 1 relic fragment of your choice.",
          description: "Description of action card: Seize Artifact",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Seize Artifact",
      name: intl.formatMessage({
        id: "Action Cards.Seize Artifact.Name",
        defaultMessage: "Seize Artifact",
        description: "Name of action card: Seize Artifact",
      }),
      timing: "COMPONENT_ACTION",
    },
    Waylay: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Waylay.Description",
          defaultMessage:
            "Before you roll dice for ANTI-FIGHTER BARRAGE:{br}Hits from this roll are produced against all ships (not just fighters).",
          description: "Description of action card: Waylay",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Waylay",
      name: intl.formatMessage({
        id: "Action Cards.Waylay.Name",
        defaultMessage: "Waylay",
        description: "Name of action card: Waylay",
      }),
      timing: "TACTICAL_ACTION",
    },
  };
}
