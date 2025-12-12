import { IntlShape } from "react-intl";

export type TFGenomeId = TwilightsFall.TFParadigmId;

export default function getTwilightsFallParadigms(
  intl: IntlShape
): Record<TwilightsFall.TFParadigmId, TFBaseParadigm> {
  return {
    "Artemis Ascendent": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Artemis Ascendent.Text",
          description: "Text of Twilight's Fall Paradigm: Artemis Ascendent",
          defaultMessage:
            "At the start of a round of space combat in a system that contains a planet you control:{br}Place your flagship and any combination of up to a total of 2 cruisers or destroyers from your reinforcements in the active system.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Artemis Ascendent",
      name: intl.formatMessage({
        id: "TF.Paradigm.Artemis Ascendent.Name",
        description: "Name of Twilight's Fall Paradigm: Artemis Ascendent",
        defaultMessage: "Artemis Ascendent",
      }),
      origin: "Council Keleres",
      timing: "OTHER",
    },
    Awakening: {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Awakening.Text",
          description: "Text of Twilight's Fall Paradigm: Awakening",
          defaultMessage:
            "ACTION: Ready a planet you control and attach this card to it. Its resource and influence values are each increased by 3, and it gains the SPACE CANNONS 5 (X3) ability as if it were a unit.",
        },
        { br: "\n\n" }
      ),
      id: "Awakening",
      name: intl.formatMessage({
        id: "TF.Paradigm.Awakening.Name",
        description: "Name of Twilight's Fall Paradigm: Awakening",
        defaultMessage: "Awakening",
      }),
      origin: "Titans of Ul",
      timing: "COMPONENT_ACTION",
    },
    "Blessing of the Yin": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Blessing of the Yin.Text",
          description: "Text of Twilight's Fall Paradigm: Blessing of the Yin",
          defaultMessage:
            "ACTION: Commit up to 3 infantry from your reinforcements to any non-home planets and resolve ground combats on those planets; players cannot use SPACE CANNON against these units.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Blessing of the Yin",
      name: intl.formatMessage({
        id: "TF.Paradigm.Blessing of the Yin.Name",
        description: "Name of Twilight's Fall Paradigm: Blessing of the Yin",
        defaultMessage: "Blessing of the Yin",
      }),
      origin: "Yin Brotherhood",
      timing: "COMPONENT_ACTION",
    },
    "Brillance of the Hylar": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Brillance of the Hylar.Text",
          description:
            "Text of Twilight's Fall Paradigm: Brillance of the Hylar",
          defaultMessage:
            "ACTION: Draw 1 genome, 1 unit upgrade, and 1 ability.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Brillance of the Hylar",
      name: intl.formatMessage({
        id: "TF.Paradigm.Brillance of the Hylar.Name",
        description: "Name of Twilight's Fall Paradigm: Brillance of the Hylar",
        defaultMessage: "Brillance of the Hylar",
      }),
      origin: "Universities of Jol-Nar",
      timing: "COMPONENT_ACTION",
    },
    "Brood Swarm": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Brood Swarm.Text",
          description: "Text of Twilight's Fall Paradigm: Brood Swarm",
          defaultMessage:
            'After you move ships into the active system:{br}You may skip directly to the "Commit Ground Forces" step. If you do, after you commit ground forces to land on planets, purge this card and return each of your ships in the active system to your reinforcements',
        },
        { br: "\n\n" }
      ),
      id: "Brood Swarm",
      name: intl.formatMessage({
        id: "TF.Paradigm.Brood Swarm.Name",
        description: "Name of Twilight's Fall Paradigm: Brood Swarm",
        defaultMessage: "Brood Swarm",
      }),
      origin: "Sardakk N'orr",
      timing: "OTHER",
    },
    "Changing the Ways": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Changing the Ways.Text",
          description: "Text of Twilight's Fall Paradigm: Changing the Ways",
          defaultMessage:
            "ACTION: Swap the positions of any two non-Fracture systems that contain wormholes or your units, other than the Creuss system, Ahk Creuxx system, or the wormhole nexus.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Changing the Ways",
      name: intl.formatMessage({
        id: "TF.Paradigm.Changing the Ways.Name",
        description: "Name of Twilight's Fall Paradigm: Changing the Ways",
        defaultMessage: "Changing the Ways",
      }),
      origin: "Ghosts of Creuss",
      timing: "COMPONENT_ACTION",
    },
    "Devour World": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Devour World.Text",
          description: "Text of Twilight's Fall Paradigm: Devour World",
          defaultMessage:
            "ACTION: Choose a planet that has a technology specialty in a system that contains your units. Destroy any other player's units on that planet. Gain trade goods equal to that planet's combined resource and influence values and draw 1 ability. Then purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Devour World",
      name: intl.formatMessage({
        id: "TF.Paradigm.Devour World.Name",
        description: "Name of Twilight's Fall Paradigm: Devour World",
        defaultMessage: "Devour World",
      }),
      origin: "Nekro Virus",
      timing: "COMPONENT_ACTION",
    },
    "Dimensional Reflection": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Dimensional Reflection.Text",
          description:
            "Text of Twilight's Fall Paradigm: Dimensional Reflection",
          defaultMessage:
            "When you produce ships:{br}You may place any of those ships onto this card.{br}At the start of a combat, you may purge this card to place all ships from this card into the active system.",
        },
        { br: "\n\n" }
      ),
      id: "Dimensional Reflection",
      name: intl.formatMessage({
        id: "TF.Paradigm.Dimensional Reflection.Name",
        description: "Name of Twilight's Fall Paradigm: Dimensional Reflection",
        defaultMessage: "Dimensional Reflection",
      }),
      origin: "Crimson Rebellion",
      timing: "OTHER",
    },
    Diaspora: {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Diaspora.Text",
          description: "Text of Twilight's Fall Paradigm: Diaspora",
          defaultMessage:
            "ACTION: Choose 1 system that does not contain other players' ships; you may move your flagship and any number of your dreadnoughts from other systems into the chosen system.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Diaspora",
      name: intl.formatMessage({
        id: "TF.Paradigm.Diaspora.Name",
        description: "Name of Twilight's Fall Paradigm: Diaspora",
        defaultMessage: "Diaspora",
      }),
      origin: "L1Z1X Mindnet",
      timing: "COMPONENT_ACTION",
    },
    "Eternitys End": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Eternity's End.Text",
          description: "Text of Twilight's Fall Paradigm: Eternity's End",
          defaultMessage:
            "ACTION: Search the ability, unit upgrade, or genome deck for any card and gain it.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Eternitys End",
      name: intl.formatMessage({
        id: "TF.Paradigm.Eternity's End.Name",
        description: "Name of Twilight's Fall Paradigm: Eternity's End",
        defaultMessage: "Eternity's End",
      }),
      origin: "Obsidian",
      timing: "COMPONENT_ACTION",
    },
    // TODO: Verify this.
    "Event Horizon": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Event Horizon.Text",
          description: "Text of Twilight's Fall Paradigm: Event Horizon",
          defaultMessage:
            "ACTION: Each other player rolls a die for each of their non-fighter ships that are in or adjacent to a system that contains a gravity rift; on a 1-5, return that unit to their reinforcements.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Event Horizon",
      name: intl.formatMessage({
        id: "TF.Paradigm.Event Horizon.Name",
        description: "Name of Twilight's Fall Paradigm: Event Horizon",
        defaultMessage: "Event Horizon",
      }),
      origin: "Vuil'raith Cabal",
      timing: "COMPONENT_ACTION",
    },
    Extortion: {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Extortion.Text",
          description: "Text of Twilight's Fall Paradigm: Extortion",
          defaultMessage:
            "ACTION: Each other player shows you 1 action card from their hand. For each player, you may either take that card or force that player to discard 3 random action cards from their hand.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Extortion",
      name: intl.formatMessage({
        id: "TF.Paradigm.Extortion.Name",
        description: "Name of Twilight's Fall Paradigm: Extortion",
        defaultMessage: "Extortion",
      }),
      origin: "Yssaril Tribes",
      timing: "COMPONENT_ACTION",
    },
    "Flock Migration": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Flock Migration.Text",
          description: "Text of Twilight's Fall Paradigm: Flock Migration",
          defaultMessage:
            "ACTION: Move any number of your ships from any systems to any number of other systems that contain 1 of your command tokens and no other players' ships.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Flock Migration",
      name: intl.formatMessage({
        id: "TF.Paradigm.Flock Migration.Name",
        description: "Name of Twilight's Fall Paradigm: Flock Migration",
        defaultMessage: "Flock Migration",
      }),
      origin: "Argent Flight",
      timing: "COMPONENT_ACTION",
    },
    "Forge Legend": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Forge Legend.Text",
          description: "Text of Twilight's Fall Paradigm: Forge Legend",
          defaultMessage:
            "ACTION: Gain 1 relic and 2 command tokens.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Forge Legend",
      name: intl.formatMessage({
        id: "TF.Paradigm.Forge Legend.Name",
        description: "Name of Twilight's Fall Paradigm: Forge Legend",
        defaultMessage: "Forge Legend",
      }),
      origin: "Naaz-Rokha Alliance",
      timing: "COMPONENT_ACTION",
    },
    "Gravitational Collapse": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Gravitational Collapse.Text",
          description:
            "Text of Twilight's Fall Paradigm: Gravitational Collapse",
          defaultMessage:
            "After you move a war sun into a non-home system other than Mecatol Rex:{br}You may destroy all other players' units in that system and replace that system tile with the Muaat supernova tile. If you do, purge this card and each planet card that corresponds to the replaced system tile.",
        },
        { br: "\n\n" }
      ),
      id: "Gravitational Collapse",
      name: intl.formatMessage({
        id: "TF.Paradigm.Gravitational Collapse.Name",
        description: "Name of Twilight's Fall Paradigm: Gravitational Collapse",
        defaultMessage: "Gravitational Collapse",
      }),
      origin: "Embers of Muaat",
      timing: "OTHER",
    },
    Insurrection: {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Insurrection.Text",
          description: "Text of Twilight's Fall Paradigm: Insurrection",
          defaultMessage:
            "At the start of a space combat that you are participating in:{br}You may purge this card; if you do, for each other player's ship that is destroyed during this combat, place 1 ship of that type from your reinforcements in the active system.",
        },
        { br: "\n\n" }
      ),
      id: "Insurrection",
      name: intl.formatMessage({
        id: "TF.Paradigm.Insurrection.Name",
        description: "Name of Twilight's Fall Paradigm: Insurrection",
        defaultMessage: "Insurrection",
      }),
      origin: "Mentak Coalition",
      timing: "OTHER",
    },
    "Intelligence Unshackled": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Intelligence Unshackled.Text",
          description:
            "Text of Twilight's Fall Paradigm: Intelligence Unshackled",
          defaultMessage:
            "When one of your units is destroyed:{br}You may purge this card to designate that unit as the catalyst; roll 1 die for each other player's unit in the system. For each result equal to or greater than the catalyst's combat value, destroy that unit.",
        },
        { br: "\n\n" }
      ),
      id: "Intelligence Unshackled",
      name: intl.formatMessage({
        id: "TF.Paradigm.Intelligence Unshackled.Name",
        description:
          "Name of Twilight's Fall Paradigm: Intelligence Unshackled",
        defaultMessage: "Intelligence Unshackled",
      }),
      origin: "Last Bastion",
      timing: "OTHER",
    },
    "Limit Break": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Limit Break.Text",
          description: "Text of Twilight's Fall Paradigm: Limit Break",
          defaultMessage:
            "When the last player passes:{br}You may choose to no longer be passed; if you do, gain 2 command tokens, draw 1 action card, and purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Limit Break",
      name: intl.formatMessage({
        id: "TF.Paradigm.Limit Break.Name",
        description: "Name of Twilight's Fall Paradigm: Limit Break",
        defaultMessage: "Limit Break",
      }),
      origin: "Ral Nel Consortium",
      timing: "OTHER",
    },
    "Opening the Eye": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Opening the Eye.Text",
          description: "Text of Twilight's Fall Paradigm: Opening the Eye",
          defaultMessage:
            "ACTION: Place 1 frontier token in each system that does not contain any planets and does not already have a frontier token. Then, explore each frontier token that is in a system that contains 1 or more of your ships.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Opening the Eye",
      name: intl.formatMessage({
        id: "TF.Paradigm.Opening the Eye.Name",
        description: "Name of Twilight's Fall Paradigm: Opening the Eye",
        defaultMessage: "Opening the Eye",
      }),
      origin: "Empyrean",
      timing: "COMPONENT_ACTION",
    },
    Overgrowth: {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Overgrowth.Text",
          description: "Text of Twilight's Fall Paradigm: Overgrowth",
          defaultMessage:
            "ACTION: Produce any number of units in any number of systems that contain 1 or more of your ground forces.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Overgrowth",
      name: intl.formatMessage({
        id: "TF.Paradigm.Overgrowth.Name",
        description: "Name of Twilight's Fall Paradigm: Overgrowth",
        defaultMessage: "Overgrowth",
      }),
      origin: "Arborec",
      timing: "COMPONENT_ACTION",
    },
    "Poison of the Nefishh": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Poison of the Nefishh.Text",
          description:
            "Text of Twilight's Fall Paradigm: Poison of the Nefishh",
          defaultMessage:
            "At the end of the status phase:{br}You may choose an ability owned by another player; they must either give you that ability or give you 2 other abilities. If you do, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Poison of the Nefishh",
      name: intl.formatMessage({
        id: "TF.Paradigm.Poison of the Nefishh.Name",
        description: "Name of Twilight's Fall Paradigm: Poison of the Nefishh",
        defaultMessage: "Poison of the Nefishh",
      }),
      origin: "Naalu Collective",
      timing: "OTHER",
    },
    "Sanction of the Quieron": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Sanction of the Quieron.Text",
          description:
            "Text of Twilight's Fall Paradigm: Sanction of the Quieron",
          defaultMessage:
            "ACTION: Resolve the PRODUCTION abilities of your units in your home system. You may reduce the cost of each of your units to 0 during this use of PRODUCTION. Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Sanction of the Quieron",
      name: intl.formatMessage({
        id: "TF.Paradigm.Sanction of the Quieron.Name",
        description:
          "Name of Twilight's Fall Paradigm: Sanction of the Quieron",
        defaultMessage: "Sanction of the Quieron",
      }),
      origin: "Emirates of Hacan",
      timing: "COMPONENT_ACTION",
    },
    "Sins of the Father": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Sins of the Father.Text",
          description: "Text of Twilight's Fall Paradigm: Sins of the Father",
          defaultMessage:
            "ACTION: Perform the primary ability of any strategy card. Then, choose any number of other players. Those players may perform the secondary ability of that strategy card.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Sins of the Father",
      name: intl.formatMessage({
        id: "TF.Paradigm.Sins of the Father.Name",
        description: "Name of Twilight's Fall Paradigm: Sins of the Father",
        defaultMessage: "Sins of the Father",
      }),
      origin: "Winnu",
      timing: "COMPONENT_ACTION",
    },
    "The Laws Unwritten": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.The Laws Unwritten.Text",
          description: "Text of Twilight's Fall Paradigm: The Laws Unwritten",
          defaultMessage:
            "ACTION: Purge an ability owned by any player.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "The Laws Unwritten",
      name: intl.formatMessage({
        id: "TF.Paradigm.The Laws Unwritten.Name",
        description: "Name of Twilight's Fall Paradigm: The Laws Unwritten",
        defaultMessage: "The Laws Unwritten",
      }),
      origin: "Deepwrought Scholarate",
      timing: "COMPONENT_ACTION",
    },
    "The Lay of Lisis": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.The Lay of Lisis.Text",
          description: "Text of Twilight's Fall Paradigm: Awakening",
          defaultMessage:
            "ACTION: Choose 1 system that is adjacent to 1 of your space docks. Destroy all other players' infantry and fighters in that system.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "The Lay of Lisis",
      name: intl.formatMessage({
        id: "TF.Paradigm.The Lay of Lisis.Name",
        description: "Name of Twilight's Fall Paradigm: The Lay of Lisis",
        defaultMessage: "The Lay of Lisis",
      }),
      origin: "Clan of Saar",
      timing: "COMPONENT_ACTION",
    },
    "The Winds of Change": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.The Winds of Change.Text",
          description: "Text of Twilight's Fall Paradigm: The Winds of Change",
          defaultMessage:
            "ACTION: Reveal cards from the action card deck until you have 3 action cards that have component actions. Draw those cards and shuffle the rest back into the action card deck.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "The Winds of Change",
      name: intl.formatMessage({
        id: "TF.Paradigm.The Winds of Change.Name",
        description: "Name of Twilight's Fall Paradigm: The Winds of Change",
        defaultMessage: "The Winds of Change",
      }),
      origin: "Council Keleres",
      timing: "COMPONENT_ACTION",
    },
    "Time Warp": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Time Warp.Text",
          description: "Text of Twilight's Fall Paradigm: Time Warp",
          defaultMessage:
            "ACTION: Place this card near the game board; your flagship and units it transports can move out of systems that contain your command tokens during this game round.{br}At the end of that game round, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Time Warp",
      name: intl.formatMessage({
        id: "TF.Paradigm.Time Warp.Name",
        description: "Name of Twilight's Fall Paradigm: Time Warp",
        defaultMessage: "Time Warp",
      }),
      origin: "Nomad",
      timing: "COMPONENT_ACTION",
    },
    "Twilight Directive": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Twilight Directive.Text",
          description: "Text of Twilight's Fall Paradigm: Twilight Directive",
          defaultMessage:
            "ACTION: Remove each of your command tokens from the game board and return them to your reinforcements.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Twilight Directive",
      name: intl.formatMessage({
        id: "TF.Paradigm.Twilight Directive.Name",
        description: "Name of Twilight's Fall Paradigm: Twilight Directive",
        defaultMessage: "Twilight Directive",
      }),
      origin: "Federation of Sol",
      timing: "COMPONENT_ACTION",
    },
    "Voice of the Council": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Voice of the Council.Text",
          description: "Text of Twilight's Fall Paradigm: Voice of the Council",
          defaultMessage:
            "ACTION: Reveal 3 edicts; choose 1 to resolve and shuffle the rest back into the edict deck.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Voice of the Council",
      name: intl.formatMessage({
        id: "TF.Paradigm.Voice of the Council.Name",
        description: "Name of Twilight's Fall Paradigm: Voice of the Council",
        defaultMessage: "Voice of the Council",
      }),
      origin: "Xxcha Kingdom",
      timing: "COMPONENT_ACTION",
    },
    "Void Transference": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Void Transference.Text",
          description: "Text of Twilight's Fall Paradigm: Void Transference",
          defaultMessage:
            "ACTION: Place this card near the game board; the number of non-fighter ships you can have in systems is not limited by the number of command tokens in your fleet pool during this game round.{br}At the end of that game round, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Void Transference",
      name: intl.formatMessage({
        id: "TF.Paradigm.Void Transference.Name",
        description: "Name of Twilight's Fall Paradigm: Void Transference",
        defaultMessage: "Void Transference",
      }),
      origin: "Barony of Letnev",
      timing: "COMPONENT_ACTION",
    },
    "Witching Hour": {
      description: intl.formatMessage(
        {
          id: "TF.Paradigm.Witching Hour.Text",
          description: "Text of Twilight's Fall Paradigm: Witching Hour",
          defaultMessage:
            "ACTION: Choose a player other than the current speaker to gain the speaker token.{br}Choose a player other than the tyrant to gain the benediction token.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      id: "Witching Hour",
      name: intl.formatMessage({
        id: "TF.Paradigm.Witching Hour.Name",
        description: "Name of Twilight's Fall Paradigm: Witching Hour",
        defaultMessage: "Witching Hour",
      }),
      origin: "Council Keleres",
      timing: "COMPONENT_ACTION",
    },
  };
}
