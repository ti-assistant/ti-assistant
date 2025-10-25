import { IntlShape } from "react-intl";

export default function getThundersEdgeLeaders(
  intl: IntlShape
): Record<ThundersEdge.LeaderId, BaseLeader> {
  return {
    // Crimson Rebellion
    "Ahk Ravin": {
      description: intl.formatMessage(
        {
          id: "Crimson Rebellion.Leaders.Ahk Ravin.Description",
          description: "Description for Rebellion Agent: Ahk Ravin",
          defaultMessage:
            "ACTION: Exhaust this card to choose 1 player. That player may swap the position of 2 of their ships in any systems; they may transport units when they swap.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Crimson Rebellion",
      id: "Ahk Ravin",
      name: intl.formatMessage({
        id: "Crimson Rebellion.Leaders.Ahk Ravin.Name",
        description: "Name of Rebellion Agent: Ahk Ravin",
        defaultMessage: "Ahk Ravin",
      }),
      timing: "COMPONENT_ACTION",
      type: "AGENT",
    },
    "Ahk Siever": {
      description: intl.formatMessage(
        {
          id: "Crimson Rebellion.Leaders.Ahk Siever.Description",
          description: "Description for Rebellion Commander: Ahk Siever",
          defaultMessage:
            "At the end of a combat between any players:{br}Gain 1 commodity or convert 1 of your commodities to a trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Crimson Rebellion",
      id: "Ahk Siever",
      name: intl.formatMessage({
        id: "Crimson Rebellion.Leaders.Ahk Siever.Name",
        description: "Name of Rebellion Commander: Ahk Siever",
        defaultMessage: "Ahk Siever",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Crimson Rebellion.Leaders.Ahk Siever.Unlock",
        description: "Unlock condition for Rebellion Commander: Ahk Siever",
        defaultMessage:
          "Place a breach token in a system that contains another player's unit.",
      }),
    },
    "Homesick Phantom": {
      abilityName: intl.formatMessage({
        id: "Crimson Rebellion.Leaders.Homesick Phantom.AbilityName",
        description: "Ability name for Rebellion Hero: Homesick Phantom",
        defaultMessage: "FRAGMENT REALITY",
      }),
      description: intl.formatMessage(
        {
          id: "Crimson Rebellion.Leaders.Homesick Phantom.Description",
          description: "Description for Rebellion Hero: Homesick Phantom",
          defaultMessage:
            "When you produce ships:{br}You may place any of those ships onto this card.{br}At the start of a space combat, you may purge this card to place all ships from this card into the active system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Crimson Rebellion",
      id: "Homesick Phantom",
      name: intl.formatMessage({
        id: "Crimson Rebellion.Leaders.Homesick Phantom.Name",
        description: "Name of Rebellion Hero: Homesick Phantom",
        defaultMessage: "Homesick Phantom",
      }),
      timing: "TACTICAL_ACTION",
      type: "HERO",
    },
    // Deepwrought Scholarate
    "Doctor Carrina": {
      description: intl.formatMessage(
        {
          id: "Deepwrought Scholarate.Leaders.Doctor Carrina.Description",
          description: "Description for Deepwrought Agent: Doctor Carrina",
          defaultMessage:
            "When another player researches a technology:{br}You may exhaust this card to allow that player to ignore 1 prerequisite; if they do, you may place 1 infantry from your reinforcements into coexistence on a non-home planet they control.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Deepwrought Scholarate",
      id: "Doctor Carrina",
      name: intl.formatMessage({
        id: "Deepwrought Scholarate.Leaders.Doctor Carrina.Name",
        description: "Name of Deepwrought Agent: Doctor Carrina",
        defaultMessage: "Doctor Carrina",
      }),
      timing: "PASSIVE",
      type: "AGENT",
    },
    Aello: {
      description: intl.formatMessage(
        {
          id: "Deepwrought Scholarate.Leaders.Aello.Description",
          description: "Description for Deepwrought Commander: Aello",
          defaultMessage:
            "When another player spends resources to research a technology:{br}That player may reduce the cost by 1, if they do, gain 1 commodity or convert 1 of your commodities to a trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Deepwrought Scholarate",
      id: "Aello",
      name: intl.formatMessage({
        id: "Deepwrought Scholarate.Leaders.Aello.Name",
        description: "Name of Deepwrought Commander: Aello",
        defaultMessage: "Aello",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Deepwrought Scholarate.Leaders.Aello.Unlock",
        description: "Unlock condition for Deepwrought Commander: Aello",
        defaultMessage: "Have an ocean card in play.",
      }),
    },
    "Ta Zern (Deepwrought)": {
      abilityName: intl.formatMessage({
        id: "Deepwrought Scholarate.Leaders.Ta Zern.AbilityName",
        description: "Ability name for Deepwrought Hero: Ta Zern",
        defaultMessage: "WAVE FUNCTION COLLAPSE",
      }),
      description: intl.formatMessage(
        {
          id: "Deepwrought Scholarate.Leaders.Ta Zern.Description",
          description: "Description for Deepwrought Hero: Ta Zern",
          defaultMessage:
            "ACTION: Purge this card and a non-unit upgrade technology you own or from your deck; then, purge all cards with the same name owned by other players and in other players' decks.{br}Then, each player that purged a technology they owned researches another technology.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Deepwrought Scholarate",
      id: "Ta Zern (Deepwrought)",
      name: intl.formatMessage({
        id: "Deepwrought Scholarate.Leaders.Ta Zern.Name",
        description: "Name of Deepwrought Hero: Ta Zern",
        defaultMessage: "Ta Zern",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    // Firmament
    "Myru Vos": {
      description: intl.formatMessage(
        {
          id: "Firmament.Leaders.Myru Vos.Description",
          description: "Description for Firmament Agent: Myru Vos",
          defaultMessage:
            "When a player moves ships:{br}You may exhaust this card; if you do, SPACE CANNON cannot be used against those ships. If they are not transporting units, they can also move through other players' ships.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Firmament",
      id: "Myru Vos",
      name: intl.formatMessage({
        id: "Firmament.Leaders.Myru Vos.Name",
        description: "Name of Firmament Agent: Myru Vos",
        defaultMessage: "Myru Vos",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Captain Aroz": {
      description: intl.formatMessage(
        {
          id: "Firmament.Leaders.Captain Aroz.Description",
          description: "Description for Firmament Commander: Captain Aroz",
          defaultMessage:
            "You may treat planets in systems that contain your ships as if you controlled them for the purpose of scoring secret objectives.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Firmament",
      id: "Captain Aroz",
      name: intl.formatMessage({
        id: "Firmament.Leaders.Captain Aroz.Name",
        description: "Name of Firmament Commander: Captain Aroz",
        defaultMessage: "Captain Aroz",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Firmament.Leaders.Captain Aroz.Unlock",
        description: "Unlock condition for Firmament Commander: Captain Aroz",
        defaultMessage: "Have a plot card in play.",
      }),
    },
    Sharsiss: {
      abilityName: intl.formatMessage({
        id: "Firmament.Leaders.Sharsiss.AbilityName",
        description: "Ability name for Firmament Hero: Sharsiss",
        defaultMessage: "THE BLADE BECKONS",
      }),
      description: intl.formatMessage(
        {
          id: "Firmament.Leaders.Sharsiss.Description",
          description: "Description for Firmament Hero: Sharsiss",
          defaultMessage:
            "ACTION: Place 1 of your plot cards in play with any other player's control token on it. Then, you may place any player's control token on 1 of your in-play plot cards; one plot cannot have two of the same player's tokens.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Firmament",
      id: "Sharsiss",
      name: intl.formatMessage({
        id: "Firmament.Leaders.Sharsiss.Name",
        description: "Name of Firmament Hero: Sharsiss",
        defaultMessage: "Sharsiss",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    // Last Bastion
    "Dame Briar": {
      description: intl.formatMessage(
        {
          id: "Last Bastion.Leaders.Dame Briar.Description",
          description: "Description for Last Bastion Agent: Dame Briar",
          defaultMessage:
            "When a player's unit is destroyed:{br}you may exhaust this card to galvanize another of that player's units in the destroyed unit's system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Last Bastion",
      id: "Dame Briar",
      name: intl.formatMessage({
        id: "Last Bastion.Leaders.Dame Briar.Name",
        description: "Name of Last Bastion Agent: Dame Briar",
        defaultMessage: "Dame Briar",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Nip and Tuck": {
      description: intl.formatMessage(
        {
          id: "Last Bastion.Leaders.Nip and Tuck.Description",
          description: "Description for Last Bastion Commander: Nip and Tuck",
          defaultMessage:
            'Your action cards cannot be canceled by "Sabotage" action cards.{br}The Nekro Virus cannot place assimilator tokens on your components.',
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Last Bastion",
      id: "Nip and Tuck",
      name: intl.formatMessage({
        id: "Last Bastion.Leaders.Nip and Tuck.Name",
        description: "Name of Last Bastion Commander: Nip and Tuck",
        defaultMessage: "Nip and Tuck",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Last Bastion.Leaders.Nip and Tuck.Unlock",
        description:
          "Unlock condition for Last Bastion Commander: Nip and Tuck",
        defaultMessage: "There are 3 galvanized units on the game board.",
      }),
    },
    "Lyra Keen": {
      abilityName: intl.formatMessage({
        id: "Last Bastion.Leaders.Lyra Keen.AbilityName",
        description: "Ability name for Last Bastion Hero: Lyra Keen",
        defaultMessage: 'ENTITY 4X41A "APOLLO"',
      }),
      description: intl.formatMessage(
        {
          id: "Last Bastion.Leaders.Lyra Keen.Description",
          description: "Description for Last Bastion Hero: Lyra Keen",
          defaultMessage:
            "When one of your galvanized units is destroyed:{br}You may purge this card to roll 1 die for each unit in its system that belongs to another player; if the result is equal to or greater than the galvanized unit's combat value, destroy that unit.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Last Bastion",
      id: "Lyra Keen",
      name: intl.formatMessage({
        id: "Last Bastion.Leaders.Lyra Keen.Name",
        description: "Name of Last Bastion Hero: Lyra Keen",
        defaultMessage: 'Entity 4X41A "Apollo"',
      }),
      timing: "TACTICAL_ACTION",
      type: "HERO",
    },
    // Obsidian
    "Vos Hollow": {
      description: intl.formatMessage(
        {
          id: "Obsidian.Leaders.Vos Hollow.Description",
          description: "Description for Obsidian Agent: Vos Hollow",
          defaultMessage:
            "When a player's ship is destroyed during any combat:{br}You may exhaust this card; if you do, that player's opponent must destroy 1 of their ships of the same type in the active system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Obsidian",
      id: "Vos Hollow",
      name: intl.formatMessage({
        id: "Obsidian.Leaders.Vos Hollow.Name",
        description: "Name of Obsidian Agent: Vos Hollow",
        defaultMessage: "Vos Hollow",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Aroz Hollow": {
      description: intl.formatMessage(
        {
          id: "Obsidian.Leaders.Aroz Hollow.Description",
          description: "Description for Obsidian Commander: Aroz Hollow",
          defaultMessage:
            "Apply +1 to the result of each of your units' combat rolls in The Fracture.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Obsidian",
      id: "Aroz Hollow",
      name: intl.formatMessage({
        id: "Obsidian.Leaders.Aroz Hollow.Name",
        description: "Name of Obsidian Commander: Aroz Hollow",
        defaultMessage: "Aroz Hollow",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Obsidian.Leaders.Aroz Hollow.Unlock",
        description: "Unlock condition for Obsidian Commander: Aroz Hollow",
        defaultMessage: "Have units in The Fracture.",
      }),
    },
    "Sharsiss Hollow": {
      abilityName: intl.formatMessage({
        id: "Obsidian.Leaders.Sharsiss Hollow.AbilityName",
        description: "Ability name for Obsidian Hero: Sharsiss Hollow",
        defaultMessage: "THE BLADE REVEALED",
      }),
      description: intl.formatMessage(
        {
          id: "Obsidian.Leaders.Sharsiss Hollow.Description",
          description: "Description for Obsidian Hero: Sharsiss Hollow",
          defaultMessage:
            "ACTION: Ready all of your planets.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Obsidian",
      id: "Sharsiss Hollow",
      name: intl.formatMessage({
        id: "Obsidian.Leaders.Sharsiss Hollow.Name",
        description: "Name of Obsidian Hero: Sharsiss Hollow",
        defaultMessage: "Sharsiss Hollow",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    // Ral Nel Consortium
    "Kan Kip Rel": {
      description: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Kan Kip Rel.Description",
        description: "Description for Ral Nel Agent: Kan Kip Rel",
        defaultMessage:
          "ACTION: Exhaust this card to draw 2 action cards; give 1 of those cards to another player.",
      }),
      expansion: "POK",
      faction: "Ral Nel Consortium",
      id: "Kan Kip Rel",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Kan Kip Rel.Name",
        description: "Name of Ral Nel Agent: Kan Kip Rel",
        defaultMessage: "Kan Kip Rel",
      }),
      timing: "COMPONENT_ACTION",
      type: "AGENT",
    },
    "Watchful Ojz": {
      description: intl.formatMessage(
        {
          id: "Ral Nel Consortium.Leaders.Watchful Ojz.Description",
          description: "Description for Ral Nel Commander: Watchful Ojz",
          defaultMessage:
            "When you declare a retreat:{br}Immediately retreat up to 2 of your ships from the active system to an adjacent system that does not contain another player's ships. Place a command token from your reinforcements into that system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Ral Nel Consortium",
      id: "Watchful Ojz",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Watchful Ojz.Name",
        description: "Name of Ral Nel Commander: Watchful Ojz",
        defaultMessage: "Watchful Ojz",
      }),
      timing: "TACTICAL_ACTION",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Watchful Ojz.Unlock",
        description: "Unlock condition for Ral Nel Commander: Watchful Ojz",
        defaultMessage: "Be the last player to pass during the action phase.",
      }),
    },
    "Director Nel": {
      abilityName: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Director Nel.AbilityName",
        description: "Ability name for Ral Nel Consortium Hero: Director Nel",
        defaultMessage: "SIGNAL INTRUSION",
      }),
      description: intl.formatMessage(
        {
          id: "Ral Nel Consortium.Leaders.Director Nel.Description",
          description: "Description for Ral Nel Consortium Hero: Director Nel",
          defaultMessage:
            "After the last player passes:{br}You may choose to no longer be passed; if you do, gain 2 command tokens, draw 1 action card, and purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Ral Nel Consortium",
      id: "Director Nel",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Director Nel.Name",
        description: "Name of Ral Nel Consortium Hero: Director Nel",
        defaultMessage: "Director Nel",
      }),
      timing: "OTHER",
      type: "HERO",
    },
  };
}
