import { IntlShape } from "react-intl";

export default function getTwilightsFallActionCards(
  intl: IntlShape
): Record<TwilightsFall.ActionCardId, BaseActionCard> {
  return {
    Atomize: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Atomize.Description",
          defaultMessage:
            "When your flagship is destroyed:{br}Purge your flagship and destroy all other units in its system.",
          description: "Description of action card: Atomize",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Atomize",
      name: intl.formatMessage({
        id: "Action Cards.Atomize.Name",
        defaultMessage: "Atomize",
        description: "Name of action card: Atomize",
      }),
      timing: "TACTICAL_ACTION",
    },
    Cloak: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Cloak.Description",
          defaultMessage:
            "After you activate a system:{br}Your ships can move through systems that contain other players' ships during this action, and SPACE CANNON cannot be used against them.",
          description: "Description of action card: Cloak",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Cloak",
      name: intl.formatMessage({
        id: "Action Cards.Cloak.Name",
        defaultMessage: "Cloak",
        description: "Name of action card: Cloak",
      }),
      timing: "TACTICAL_ACTION",
    },
    Coerce: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Coerce.Description",
          defaultMessage:
            "ACTION: Choose a player. That player must give you 1 of their abilities.",
          description: "Description of action card: Coerce",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Coerce",
      name: intl.formatMessage({
        id: "Action Cards.Coerce.Name",
        defaultMessage: "Coerce",
        description: "Name of action card: Coerce",
      }),
      timing: "COMPONENT_ACTION",
    },
    Command: {
      count: 2,
      description: intl.formatMessage(
        {
          id: "Action Cards.Command.Description",
          defaultMessage:
            "After you activate a system:{br}Apply +1 to the move value of each of your ships during this tactical action. Additionally, your ships may move through and into asteroid fields during this movement.",
          description: "Description of action card: Command",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Command",
      name: intl.formatMessage({
        id: "Action Cards.Command.Name",
        defaultMessage: "Command",
        description: "Name of action card: Command",
      }),
      timing: "TACTICAL_ACTION",
    },
    Converge: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Converge.Description",
          defaultMessage:
            "Before you roll dice for SPACE CANNON:{br}Your hits must be applied to non-fighter ships during SPACE CANNON OFFENSE, or mechs during SPACE CANNON DEFENSE, if able.",
          description: "Description of action card: Converge",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Converge",
      name: intl.formatMessage({
        id: "Action Cards.Converge.Name",
        defaultMessage: "Converge",
        description: "Name of action card: Converge",
      }),
      timing: "TACTICAL_ACTION",
    },
    Create: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Create.Description",
          defaultMessage: "ACTION: Gain 1 relic.",
          description: "Description of action card: Create",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Create",
      name: intl.formatMessage({
        id: "Action Cards.Create.Name",
        defaultMessage: "Create",
        description: "Name of action card: Create",
      }),
      timing: "COMPONENT_ACTION",
    },
    Divinity: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Divinity.Description",
          defaultMessage:
            "When 1 of your units would be destroyed:{br}It is not destroyed instead.",
          description: "Description of action card: Divinity",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Divinity",
      name: intl.formatMessage({
        id: "Action Cards.Divinity.Name",
        defaultMessage: "Divinity",
        description: "Name of action card: Divinity",
      }),
      timing: "TACTICAL_ACTION",
    },
    Elevate: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Elevate.Description",
          defaultMessage: "ACTION: Draw 1 paradigm.",
          description: "Description of action card: Elevate",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Elevate",
      name: intl.formatMessage({
        id: "Action Cards.Elevate.Name",
        defaultMessage: "Elevate",
        description: "Name of action card: Elevate",
      }),
      timing: "COMPONENT_ACTION",
    },
    Engineer: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Engineer.Description",
          defaultMessage:
            "When you draw cards for a splice that you initiated:{br}Add 2 additional cards to the splice; after you choose your card, choose and discard 2 of the spliced cards before passing them to the next player.",
          description: "Description of action card: Engineer",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Engineer",
      name: intl.formatMessage({
        id: "Action Cards.Engineer.Name",
        defaultMessage: "Engineer",
        description: "Name of action card: Engineer",
      }),
      timing: "OTHER",
    },
    Entangle: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Entangle.Description",
          defaultMessage:
            "After you activate a system:{br}All systems that contain alpha wormholes, beta wormholes, gamma wormholes, and gravity rifts are adjacent during this movement.",
          description: "Description of action card: Entangle",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Entangle",
      name: intl.formatMessage({
        id: "Action Cards.Entangle.Name",
        defaultMessage: "Entangle",
        description: "Name of action card: Entangle",
      }),
      timing: "TACTICAL_ACTION",
    },
    Evolve: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Evolve.Description",
          defaultMessage: "ACTION: Draw 1 card from any splice deck.",
          description: "Description of action card: Evolve",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Evolve",
      name: intl.formatMessage({
        id: "Action Cards.Evolve.Name",
        defaultMessage: "Evolve",
        description: "Name of action card: Evolve",
      }),
      timing: "COMPONENT_ACTION",
    },
    Feint: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Feint.Description",
          defaultMessage:
            "When you announce a retreat:{br}Your units immediately retreat to an eligible system; do not place a command token in that system.",
          description: "Description of action card: Feint",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Feint",
      name: intl.formatMessage({
        id: "Action Cards.Feint.Name",
        defaultMessage: "Feint",
        description: "Name of action card: Feint",
      }),
      timing: "TACTICAL_ACTION",
    },
    Flux: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Flux.Description",
          defaultMessage:
            "ACTION: Either remove any player's command token from the board, or place a command token from any player's reinforcements in a system that contains or is adjacent to one of your ships.",
          description: "Description of action card: Flux",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Flux",
      name: intl.formatMessage({
        id: "Action Cards.Flux.Name",
        defaultMessage: "Flux",
        description: "Name of action card: Flux",
      }),
      timing: "COMPONENT_ACTION",
    },
    Genophage: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Genophage.Description",
          defaultMessage: "ACTION: Discard 1 of your neighbors' genomes.",
          description: "Description of action card: Genophage",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Genophage",
      name: intl.formatMessage({
        id: "Action Cards.Genophage.Name",
        defaultMessage: "Genophage",
        description: "Name of action card: Genophage",
      }),
      timing: "COMPONENT_ACTION",
    },
    Hardlight: {
      count: 2,
      description: intl.formatMessage(
        {
          id: "Action Cards.Hardlight.Description",
          defaultMessage:
            "Before hits are assigned to your units:{br}Cancel up to 2 hits.",
          description: "Description of action card: Hardlight",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Hardlight",
      name: intl.formatMessage({
        id: "Action Cards.Hardlight.Name",
        defaultMessage: "Hardlight",
        description: "Name of action card: Hardlight",
      }),
      timing: "TACTICAL_ACTION",
    },
    Helix: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Helix.Description",
          defaultMessage:
            "ACTION: Initiate a splice of any type, including all players.",
          description: "Description of action card: Helix",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Helix",
      name: intl.formatMessage({
        id: "Action Cards.Helix.Name",
        defaultMessage: "Helix",
        description: "Name of action card: Helix",
      }),
      timing: "COMPONENT_ACTION",
    },
    Ignis: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Ignis.Description",
          defaultMessage:
            "ACTION: Place a command token from your tactic pool in any non-home system; choose and destroy 1 unit in that system.",
          description: "Description of action card: Ignis",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Ignis",
      name: intl.formatMessage({
        id: "Action Cards.Ignis.Name",
        defaultMessage: "Ignis",
        description: "Name of action card: Ignis",
      }),
      timing: "COMPONENT_ACTION",
    },
    Irradiate: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Irradiate.Description",
          defaultMessage:
            "ACTION: Choose 1 unit type other than flagship; reveal cards from the unit upgrade deck until you reveal a card of that type, if able. Then, gain that card and shuffle the rest back into the unit upgrade deck.",
          description: "Description of action card: Irradiate",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Irradiate",
      name: intl.formatMessage({
        id: "Action Cards.Irradiate.Name",
        defaultMessage: "Irradiate",
        description: "Name of action card: Irradiate",
      }),
      timing: "COMPONENT_ACTION",
    },
    Lash: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Lash.Description",
          defaultMessage:
            "When 1 of your units is destroyed:{br}Destroy a unit in its system that has an equal or lower cost.",
          description: "Description of action card: Lash",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Lash",
      name: intl.formatMessage({
        id: "Action Cards.Lash.Name",
        defaultMessage: "Lash",
        description: "Name of action card: Lash",
      }),
      timing: "TACTICAL_ACTION",
    },
    Locust: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Locust.Description",
          defaultMessage:
            "ACTION: Choose 1 infantry in a system adjacent to your units and roll 1 die. On a result of 3 or higher, destroy that infantry and choose an infantry in the same or an adjacent system to repeat this roll; for each new roll, choose an infantry owned by a different player than the previous infantry, if able.",
          description: "Description of action card: Locust",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Locust",
      name: intl.formatMessage({
        id: "Action Cards.Locust.Name",
        defaultMessage: "Locust",
        description: "Name of action card: Locust",
      }),
      timing: "COMPONENT_ACTION",
    },
    Magnificence: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Magnificence.Description",
          defaultMessage:
            "ACTION: Move all units from the space area of any system into an adjacent system that contains a different player's ships. Space combat is resolved in that system; neither player can retreat or resolve abilities that would move their ships.",
          description: "Description of action card: Magnificence",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Magnificence",
      name: intl.formatMessage({
        id: "Action Cards.Magnificence.Name",
        defaultMessage: "Magnificence",
        description: "Name of action card: Magnificence",
      }),
      timing: "COMPONENT_ACTION",
    },
    Manifest: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Manifest.Description",
          defaultMessage:
            "ACTION: Resolve the PRODUCTION ability of 1 of your units; reduce the combined cost of the produced units by 3.",
          description: "Description of action card: Manifest",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Manifest",
      name: intl.formatMessage({
        id: "Action Cards.Manifest.Name",
        defaultMessage: "Manifest",
        description: "Name of action card: Manifest",
      }),
      timing: "COMPONENT_ACTION",
    },
    Manipulate: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Manipulate.Description",
          defaultMessage:
            "After cards are drawn for a splice that you are not participating in:{br}Take the cards and choose which card each participating player will take.",
          description: "Description of action card: Manipulate",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Manipulate",
      name: intl.formatMessage({
        id: "Action Cards.Manipulate.Name",
        defaultMessage: "Manipulate",
        description: "Name of action card: Manipulate",
      }),
      timing: "OTHER",
    },
    Meddle: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Meddle.Description",
          defaultMessage:
            "When any die is rolled:{br}Add or subtract 1 from its result.",
          description: "Description of action card: Meddle",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Meddle",
      name: intl.formatMessage({
        id: "Action Cards.Meddle.Name",
        defaultMessage: "Meddle",
        description: "Name of action card: Meddle",
      }),
      timing: "OTHER",
    },
    Meld: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Meld.Description",
          defaultMessage:
            "When a die is rolled by any player:{br}Roll two dice instead, and add the results together (max 10).",
          description: "Description of action card: Meld",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Meld",
      name: intl.formatMessage({
        id: "Action Cards.Meld.Name",
        defaultMessage: "Meld",
        description: "Name of action card: Meld",
      }),
      timing: "OTHER",
    },
    Meteor: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Meteor.Description",
          defaultMessage:
            "When you would remove ground forces due to insufficient capacity:{br}Commit those ground forces to a planet in that system instead; resolve an invasion on that planet using only those ground forces.",
          description: "Description of action card: Meteor",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Meteor",
      name: intl.formatMessage({
        id: "Action Cards.Meteor.Name",
        defaultMessage: "Meteor",
        description: "Name of action card: Meteor",
      }),
      timing: "OTHER",
    },
    Mutate: {
      count: 2,
      description: intl.formatMessage(
        {
          id: "Action Cards.Mutate.Description",
          defaultMessage:
            "ACTION: Discard 1 of your abilities, then draw 1 ability.",
          description: "Description of action card: Mutate",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Mutate",
      name: intl.formatMessage({
        id: "Action Cards.Mutate.Name",
        defaultMessage: "Mutate",
        description: "Name of action card: Mutate",
      }),
      timing: "COMPONENT_ACTION",
    },
    Pax: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Pax.Description",
          defaultMessage:
            "After another player commits units to land on a planet you control:{br}Return the committed units to the space area; choose 1 of them to destroy.",
          description: "Description of action card: Pax",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Pax",
      name: intl.formatMessage({
        id: "Action Cards.Pax.Name",
        defaultMessage: "Pax",
        description: "Name of action card: Pax",
      }),
      timing: "OTHER",
    },
    Reflect: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Reflect.Description",
          defaultMessage:
            "ACTION: For each trade good you have, either gain 1 commodity or convert 1 of your commodities to a trade good.",
          description: "Description of action card: Reflect",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Reflect",
      name: intl.formatMessage({
        id: "Action Cards.Reflect.Name",
        defaultMessage: "Reflect",
        description: "Name of action card: Reflect",
      }),
      timing: "COMPONENT_ACTION",
    },
    Reverse: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Reverse.Description",
          defaultMessage:
            "When a splice begins:{br}Reverse the order the spliced cards are passed.",
          description: "Description of action card: Reverse",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Reverse",
      name: intl.formatMessage({
        id: "Action Cards.Reverse.Name",
        defaultMessage: "Reverse",
        description: "Name of action card: Reverse",
      }),
      timing: "OTHER",
    },
    Rise: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Rise.Description",
          defaultMessage:
            "ACTION: Either place 1 infantry on each planet you control or place 1 fighter in each system that contains your ships or space docks and no other players' ships.",
          description: "Description of action card: Rise",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Rise",
      name: intl.formatMessage({
        id: "Action Cards.Rise.Name",
        defaultMessage: "Rise",
        description: "Name of action card: Rise",
      }),
      timing: "COMPONENT_ACTION",
    },
    Scarab: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Scarab.Description",
          defaultMessage:
            "ACTION: Choose a spliced card you own; gain 2 trade goods for each card you own with a faction origin that matches that card.",
          description: "Description of action card: Scarab",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Scarab",
      name: intl.formatMessage({
        id: "Action Cards.Scarab.Name",
        defaultMessage: "Scarab",
        description: "Name of action card: Scarab",
      }),
      timing: "COMPONENT_ACTION",
    },
    Shatter: {
      count: 2,
      description: intl.formatMessage(
        {
          id: "Action Cards.Shatter.Description",
          defaultMessage:
            'When another player exhausts a genome or plays an action card other than "Shatter":{br}That genome is exhausted without effect, or that action card is canceled.',
          description: "Description of action card: Shatter",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Shatter",
      name: intl.formatMessage({
        id: "Action Cards.Shatter.Name",
        defaultMessage: "Shatter",
        description: "Name of action card: Shatter",
      }),
      timing: "OTHER",
    },
    Spark: {
      count: 2,
      description: intl.formatMessage(
        {
          id: "Action Cards.Spark.Description",
          defaultMessage:
            "After another player's unit uses SUSTAIN DAMAGE to cancel a hit produced by your units or abilities:{br}Destroy that unit.",
          description: "Description of action card: Spark",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Spark",
      name: intl.formatMessage({
        id: "Action Cards.Spark.Name",
        defaultMessage: "Spark",
        description: "Name of action card: Spark",
      }),
      timing: "OTHER",
    },
    Starflare: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Starflare.Description",
          defaultMessage:
            "ACTION: Choose a supernova; each player destroys 3 of their units in that supernova and each adjacent system.",
          description: "Description of action card: Starflare",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Starflare",
      name: intl.formatMessage({
        id: "Action Cards.Starflare.Name",
        defaultMessage: "Starflare",
        description: "Name of action card: Starflare",
      }),
      timing: "COMPONENT_ACTION",
    },
    Stasis: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Stasis.Description",
          defaultMessage:
            "At the start of another player's turn:{br}Immediately end that player's turn.",
          description: "Description of action card: Stasis",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Stasis",
      name: intl.formatMessage({
        id: "Action Cards.Stasis.Name",
        defaultMessage: "Stasis",
        description: "Name of action card: Stasis",
      }),
      timing: "OTHER",
    },
    Tartarus: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Tartarus.Description",
          defaultMessage:
            "At the start of the strategy phase:{br}Choose a strategy card; that card cannot be picked unless there is no other option.",
          description: "Description of action card: Tartarus",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Tartarus",
      name: intl.formatMessage({
        id: "Action Cards.Tartarus.Name",
        defaultMessage: "Tartarus",
        description: "Name of action card: Tartarus",
      }),
      timing: "OTHER",
    },
    Thieve: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Thieve.Description",
          defaultMessage:
            "When a splice ends, if you did not participate:{br}Take all of the remaining spliced cards.",
          description: "Description of action card: Thieve",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Thieve",
      name: intl.formatMessage({
        id: "Action Cards.Thieve.Name",
        defaultMessage: "Thieve",
        description: "Name of action card: Thieve",
      }),
      timing: "OTHER",
    },
    Timestop: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Timestop.Description",
          defaultMessage:
            "When a player activates a system that contains your units:{br}Immediately perform an action, during which you are the active player.",
          description: "Description of action card: Timestop",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Timestop",
      name: intl.formatMessage({
        id: "Action Cards.Timestop.Name",
        defaultMessage: "Timestop",
        description: "Name of action card: Timestop",
      }),
      timing: "OTHER",
    },
    Transpose: {
      count: 2,
      description: intl.formatMessage(
        {
          id: "Action Cards.Transpose.Description",
          defaultMessage:
            "ACTION: Give 1 of your abilities to one of your neighbors, then take 1 of their abilities.",
          description: "Description of action card: Transpose",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Transpose",
      name: intl.formatMessage({
        id: "Action Cards.Transpose.Name",
        defaultMessage: "Transpose",
        description: "Name of action card: Transpose",
      }),
      timing: "COMPONENT_ACTION",
    },
    Trine: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Trine.Description",
          defaultMessage:
            'During the "Space Cannon Offense" step of a tactical action:{br}Your units up to 2 systems away can use their SPACE CANNON abilities against ships in the active system.',
          description: "Description of action card: Trine",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Trine",
      name: intl.formatMessage({
        id: "Action Cards.Trine.Name",
        defaultMessage: "Trine",
        description: "Name of action card: Trine",
      }),
      timing: "OTHER",
    },
    Twinning: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Twinning.Description",
          defaultMessage:
            "After another player resolves the component action of an action card:{br}Immediately resolve that action card as if you played it.",
          description: "Description of action card: Twinning",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Twinning",
      name: intl.formatMessage({
        id: "Action Cards.Twinning.Name",
        defaultMessage: "Twinning",
        description: "Name of action card: Twinning",
      }),
      timing: "OTHER",
    },
    Unravel: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Unravel.Description",
          defaultMessage:
            "ACTION: Choose and purge a relic. If the relic belonged to another player, that player gains 1 victory point; if it belonged to you, put The Fracture into play and place 1 additional ingress token in a system that contains your units.",
          description: "Description of action card: Unravel",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Unravel",
      name: intl.formatMessage({
        id: "Action Cards.Unravel.Name",
        defaultMessage: "Unravel",
        description: "Name of action card: Unravel",
      }),
      timing: "COMPONENT_ACTION",
    },
    Vault: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Vault.Description",
          defaultMessage:
            "After you activate a system:{br}You may ignore the effects of anomalies during this movement.",
          description: "Description of action card: Vault",
        },
        { br: "\n\n" }
      ),
      expansion: "TWILIGHTS FALL",
      id: "Vault",
      name: intl.formatMessage({
        id: "Action Cards.Vault.Name",
        defaultMessage: "Vault",
        description: "Name of action card: Vault",
      }),
      timing: "TACTICAL_ACTION",
    },
  };
}
