import { IntlShape } from "react-intl";

export default function getBaseAgendas(
  intl: IntlShape
): Record<BaseGame.AgendaId, BaseAgenda> {
  return {
    "Anti-Intellectual Revolution": {
      description: intl.formatMessage(
        {
          id: "Agendas.Anti-Intellectual Revolution.Description",
          description:
            "Description for Agenda Card: Anti-Intellectual Revolution",
          defaultMessage:
            "For: After a player researches a technology, they must destroy 1 of their non-fighter ships.{br}Against: At the start of the next strategy phase, each player chooses and exhausts 1 planet for each technology they own.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Anti-Intellectual Revolution",
      name: intl.formatMessage({
        id: "Agendas.Anti-Intellectual Revolution.Title",
        description: "Title of Agenda Card: Anti-Intellectual Revolution",
        defaultMessage: "Anti-Intellectual Revolution",
      }),
      type: "LAW",
    },
    "Archived Secret": {
      description: intl.formatMessage({
        id: "Agendas.Archived Secret.Description",
        description: "Description for Agenda Card: Archived Secret",
        defaultMessage: "Elected player draws 1 secret objective.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Archived Secret",
      name: intl.formatMessage({
        id: "Agendas.Archived Secret.Title",
        description: "Title of Agenda Card: Archived Secret",
        defaultMessage: "Archived Secret",
      }),
      type: "DIRECTIVE",
    },
    "Arms Reduction": {
      description: intl.formatMessage(
        {
          id: "Agendas.Arms Reduction.Description",
          description: "Description for Agenda Card: Arms Reduction",
          defaultMessage:
            "For: Each player destroys all but 2 of their dreadnaughts and all but 4 of their cruisers.{br}Against: At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Arms Reduction",
      name: intl.formatMessage({
        id: "Agendas.Arms Reduction.Title",
        description: "Title of Agenda Card: Arms Reduction",
        defaultMessage: "Arms Reduction",
      }),
      type: "DIRECTIVE",
    },
    "Clandestine Operations": {
      description: intl.formatMessage(
        {
          id: "Agendas.Clandestine Operations.Description",
          description: "Description for Agenda Card: Clandestine Operations",
          defaultMessage:
            "For: Each player removes 2 command tokens from their command sheet and returns those tokens to their reinforcements.{br}Against: Each player removes 1 command token from their fleet pool and returns that token to their reinforcements.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Clandestine Operations",
      name: intl.formatMessage({
        id: "Agendas.Clandestine Operations.Title",
        description: "Title of Agenda Card: Clandestine Operations",
        defaultMessage: "Clandestine Operations",
      }),
      type: "DIRECTIVE",
    },
    "Classified Document Leaks": {
      description: intl.formatMessage(
        {
          id: "Agendas.Classified Document Leaks.Description",
          description: "Description for Agenda Card: Classified Document Leaks",
          defaultMessage:
            "When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deck.{br}The elected secret objective becomes a public objective; place it near the other public objectives in the common play area.",
        },
        { br: "\n\n" }
      ),
      elect: "Scored Secret Objective",
      expansion: "BASE",
      id: "Classified Document Leaks",
      name: intl.formatMessage({
        id: "Agendas.Classified Document Leaks.Title",
        description: "Title of Agenda Card: Classified Document Leaks",
        defaultMessage: "Classified Document Leaks",
      }),
      type: "LAW",
    },
    "Colonial Redistribution": {
      description: intl.formatMessage(
        {
          id: "Agendas.Colonial Redistribution.Description",
          description: "Description for Agenda Card: Colonial Redistribution",
          defaultMessage:
            "Destroy each unit on the elected planet.{br}Then, the player who controls that planet chooses 1 player with the fewest victory points; that player may place 1 infantry from their reinforcements on the elected planet.",
        },
        { br: "\n\n" }
      ),
      elect: "Non-Home Planet Other Than Mecatol Rex",
      expansion: "BASE",
      id: "Colonial Redistribution",
      name: intl.formatMessage({
        id: "Agendas.Colonial Redistribution.Title",
        description: "Title of Agenda Card: Colonial Redistribution",
        defaultMessage: "Colonial Redistribution",
      }),
      type: "DIRECTIVE",
    },
    "Committee Formation": {
      description: intl.formatMessage(
        {
          id: "Agendas.Committee Formation.Description",
          description: "Description for Agenda Card: Committee Formation",
          defaultMessage:
            "The elected player gains this card.{br}Before players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Committee Formation",
      name: intl.formatMessage({
        id: "Agendas.Committee Formation.Title",
        description: "Title of Agenda Card: Committee Formation",
        defaultMessage: "Committee Formation",
      }),
      type: "LAW",
    },
    "Compensated Disarmament": {
      description: intl.formatMessage({
        id: "Agendas.Compensated Disarmament.Description",
        description: "Description for Agenda Card: Compensated Disarmament",
        defaultMessage:
          "Destroy each ground force on the elected planet; for each unit that was destroyed, the player who controls that planet gains 1 trade good.",
      }),
      elect: "Planet",
      expansion: "BASE",
      id: "Compensated Disarmament",
      name: intl.formatMessage({
        id: "Agendas.Compensated Disarmament.Title",
        description: "Title of Agenda Card: Compensated Disarmament",
        defaultMessage: "Compensated Disarmament",
      }),
      type: "DIRECTIVE",
    },
    "Conventions of War": {
      description: intl.formatMessage(
        {
          id: "Agendas.Conventions of War.Description",
          description: "Description for Agenda Card: Conventions of War",
          defaultMessage:
            'For: Players cannot use BOMBARDMENT against units that are on cultural planets.{br}Against: Each player that voted "Against" discards all of their action cards.',
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Conventions of War",
      name: intl.formatMessage({
        id: "Agendas.Conventions of War.Title",
        description: "Title of Agenda Card: Conventions of War",
        defaultMessage: "Conventions of War",
      }),
      type: "LAW",
    },
    "Core Mining": {
      description: intl.formatMessage(
        {
          id: "Agendas.Core Mining.Description",
          description: "Description for Agenda Card: Core Mining",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}Then, destroy 1 infantry on the planet.{br}The resource value of this planet is increased by 2.",
        },
        { br: "\n\n" }
      ),
      elect: "Hazardous Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Core Mining",
      name: intl.formatMessage({
        id: "Agendas.Core Mining.Title",
        description: "Title of Agenda Card: Core Mining",
        defaultMessage: "Core Mining",
      }),
      type: "LAW",
    },
    "Demilitarized Zone": {
      description: intl.formatMessage(
        {
          id: "Agendas.Demilitarized Zone.Description",
          description: "Description for Agenda Card: Demilitarized Zone",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}Then, destroy all units on that planet.{br}Player's units cannot land, be produced, or be placed on this planet.",
        },
        { br: "\n\n" }
      ),
      elect: "Cultural Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Demilitarized Zone",
      name: intl.formatMessage({
        id: "Agendas.Demilitarized Zone.Title",
        description: "Title of Agenda Card: Demilitarized Zone",
        defaultMessage: "Demilitarized Zone",
      }),
      type: "LAW",
    },
    "Economic Equality": {
      description: intl.formatMessage(
        {
          id: "Agendas.Economic Equality.Description",
          description: "Description for Agenda Card: Economic Equality",
          defaultMessage:
            "For: Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods.{br}Against: Each player returns all of their trade goods to the supply.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Economic Equality",
      name: intl.formatMessage({
        id: "Agendas.Economic Equality.Title",
        description: "Description for Agenda Card: Economic Equality",
        defaultMessage: "Economic Equality",
      }),
      type: "DIRECTIVE",
    },
    "Enforced Travel Ban": {
      description: intl.formatMessage(
        {
          id: "Agendas.Enforced Travel Ban.Description",
          description: "Description for Agenda Card: Enforced Travel Ban",
          defaultMessage:
            "For: Alpha and beta wormholes have no effect during movement.{br}Against: Destroy each PDS in or adjacent to a system that contains a wormhole.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Enforced Travel Ban",
      name: intl.formatMessage({
        id: "Agendas.Enforced Travel Ban.Title",
        description: "Title of Agenda Card: Enforced Travel Ban",
        defaultMessage: "Enforced Travel Ban",
      }),
      type: "LAW",
    },
    "Executive Sanctions": {
      description: intl.formatMessage(
        {
          id: "Agendas.Executive Sanctions.Description",
          description: "Description for Agenda Card: Executive Sanctions",
          defaultMessage:
            "For: Each player can have a maximum of 3 action cards in their hand.{br}Against: Each player discards 1 random action card from their hand.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Executive Sanctions",
      name: intl.formatMessage({
        id: "Agendas.Executive Sanctions.Title",
        description: "Title of Agenda Card: Executive Sanctions",
        defaultMessage: "Executive Sanctions",
      }),
      type: "LAW",
    },
    "Fleet Regulations": {
      description: intl.formatMessage(
        {
          id: "Agendas.Fleet Regulations.Description",
          description: "Description for Agenda Card: Fleet Regulations",
          defaultMessage:
            "For: Each player cannot have more than 4 tokens in their fleet pool.{br}Against: Each player places 1 command token from their reinforcements in their fleet pool.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Fleet Regulations",
      name: intl.formatMessage({
        id: "Agendas.Fleet Regulations.Title",
        description: "Title of Agenda Card: Fleet Regulations",
        defaultMessage: "Fleet Regulations",
      }),
      type: "LAW",
    },
    "Holy Planet of Ixth": {
      description: intl.formatMessage(
        {
          id: "Agendas.Holy Planet of Ixth.Description",
          description: "Description for Agenda Card: Holy Planet of Ixth",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}The planet's owner gains 1 victory point.{br}Units on this planet cannot use PRODUCTION.{br}When a player gains control of this planet, they gain 1 victory point.{br}When a player loses control of this planet, they lose 1 victory point.",
        },
        { br: "\n\n" }
      ),
      elect: "Cultural Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Holy Planet of Ixth",
      name: intl.formatMessage({
        id: "Agendas.Holy Planet of Ixth.Title",
        description: "Title of Agenda Card: Holy Planet of Ixth",
        defaultMessage: "Holy Planet of Ixth",
      }),
      type: "LAW",
    },
    "Homeland Defense Act": {
      description: intl.formatMessage(
        {
          id: "Agendas.Homeland Defense Act.Description",
          description: "Description for Agenda Card: Homeland Defense Act",
          defaultMessage:
            "For: Each player can have any number of PDS units on planets they control.{br}Against: Each player destroys 1 of their PDS units.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Homeland Defense Act",
      name: intl.formatMessage({
        id: "Agendas.Homeland Defense Act.Title",
        description: "Title of Agenda Card: Homeland Defense Act",
        defaultMessage: "Homeland Defense Act",
      }),
      type: "LAW",
    },
    "Imperial Arbiter": {
      description: intl.formatMessage(
        {
          id: "Agendas.Imperial Arbiter.Description",
          description: "Description for Agenda Card: Imperial Arbiter",
          defaultMessage:
            "The elected player gains this card.{br}At the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Imperial Arbiter",
      name: intl.formatMessage({
        id: "Agendas.Imperial Arbiter.Title",
        description: "Title of Agenda Card: Imperial Arbiter",
        defaultMessage: "Imperial Arbiter",
      }),
      type: "LAW",
    },
    "Incentive Program": {
      description: intl.formatMessage(
        {
          id: "Agendas.Incentive Program.Description",
          description: "Description for Agenda Card: Incentive Program",
          defaultMessage:
            "For: Draw and reveal 1 stage I public objective from the deck and place it near the public objectives.{br}Against: Draw and reveal 1 stage II public objective from the deck and place it near the public objectives.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Incentive Program",
      name: intl.formatMessage({
        id: "Agendas.Incentive Program.Title",
        description: "Title for Agenda Card: Incentive Program",
        defaultMessage: "Incentive Program",
      }),
      type: "DIRECTIVE",
    },
    "Ixthian Artifact": {
      description: intl.formatMessage(
        {
          id: "Agendas.Ixthian Artifact.Description",
          description: "Description for Agenda Card: Ixthian Artifact",
          defaultMessage:
            "For: The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their units in each of those systems.{br}Against: No effect.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Ixthian Artifact",
      name: intl.formatMessage({
        id: "Agendas.Ixthian Artifact.Title",
        description: "Title of Agenda Card: Ixthian Artifact",
        defaultMessage: "Ixthian Artifact",
      }),
      type: "DIRECTIVE",
    },
    "Judicial Abolishment": {
      description: intl.formatMessage(
        {
          id: "Agendas.Judicial Abolishment.Description",
          description: "Description for Agenda Card: Judicial Abolishment",
          defaultMessage:
            "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.{br}Discard the elected law from play.",
        },
        { br: "\n\n" }
      ),
      elect: "Law",
      expansion: "BASE",
      id: "Judicial Abolishment",
      name: intl.formatMessage({
        id: "Agendas.Judicial Abolishment.Title",
        description: "Title of Agenda Card: Judicial Abolishment",
        defaultMessage: "Judicial Abolishment",
      }),
      type: "DIRECTIVE",
    },
    "Minister of Commerce": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of Commerce.Description",
          description: "Description for Agenda Card: Minister of Commerce",
          defaultMessage:
            "The elected player gains this card.{br}After the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Commerce",
      name: intl.formatMessage({
        id: "Agendas.Minister of Commerce.Title",
        description: "Title of Agenda Card: Minister of Commerce",
        defaultMessage: "Minister of Commerce",
      }),
      type: "LAW",
    },
    "Minister of Exploration": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of Exploration.Description",
          description: "Description for Agenda Card: Minister of Exploration",
          defaultMessage:
            "The elected player gains this card.{br}When the owner of this card gains control of a planet, they gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Exploration",
      name: intl.formatMessage({
        id: "Agendas.Minister of Exploration.Title",
        description: "Title of Agenda Card: Minister of Exploration",
        defaultMessage: "Minister of Exploration",
      }),
      type: "LAW",
    },
    "Minister of Industry": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of Industry.Description",
          description: "Description for Agenda Card: Minister of Industry",
          defaultMessage:
            "The elected player gains this card.{br}When the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Industry",
      name: intl.formatMessage({
        id: "Agendas.Minister of Industry.Title",
        description: "Title of Agenda Card: Minister of Industry",
        defaultMessage: "Minister of Industry",
      }),
      type: "LAW",
    },
    "Minister of Peace": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of Peace.Description",
          description: "Description for Agenda Card: Minister of Peace",
          defaultMessage:
            "The elected player gains this card.{br}After a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card; immediately end the active player's turn.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Peace",
      name: intl.formatMessage({
        id: "Agendas.Minister of Peace.Title",
        description: "Title of Agenda Card: Minister of Peace",
        defaultMessage: "Minister of Peace",
      }),
      type: "LAW",
    },
    "Minister of Policy": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of Policy.Description",
          description: "Description for Agenda Card: Minister of Policy",
          defaultMessage:
            "The elected player gains this card.{br}At the end of the status phase, the owner of this card draws 1 action card.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Policy",
      name: intl.formatMessage({
        id: "Agendas.Minister of Policy.Title",
        description: "Title of Agenda Card: Minister of Policy",
        defaultMessage: "Minister of Policy",
      }),
      type: "LAW",
    },
    "Minister of Sciences": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of Sciences.Description",
          description: "Description for Agenda Card: Minister of Sciences",
          defaultMessage:
            'The elected player gains this card.{br}When the owner of this card resolves the primary or secondary ability of the "Technology" strategy card, they do not need to spend resources to research technology.',
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Sciences",
      name: intl.formatMessage({
        id: "Agendas.Minister of Sciences.Title",
        description: "Title of Agenda Card: Minister of Sciences",
        defaultMessage: "Minister of Sciences",
      }),
      type: "LAW",
    },
    "Minister of War": {
      description: intl.formatMessage(
        {
          id: "Agendas.Minister of War.Description",
          description: "Description for Agenda Card: Minister of War",
          defaultMessage:
            "The elected player gains this card.{br}The owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements; then they may perform 1 additional action.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of War",
      name: intl.formatMessage({
        id: "Agendas.Minister of War.Title",
        description: "Title of Agenda Card: Minister of War",
        defaultMessage: "Minister of War",
      }),
      type: "LAW",
    },
    "Miscount Disclosed": {
      description: intl.formatMessage(
        {
          id: "Agendas.Miscount Disclosed.Description",
          description: "Description for Agenda Card: Miscount Disclosed",
          defaultMessage:
            "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.{br}Vote on the elected law as if it were just revealed from the top of the deck.",
        },
        { br: "\n\n" }
      ),
      elect: "Law",
      expansion: "BASE",
      id: "Miscount Disclosed",
      name: intl.formatMessage({
        id: "Agendas.Miscount Disclosed.Title",
        description: "Title of Agenda Card: Miscount Disclosed",
        defaultMessage: "Miscount Disclosed",
      }),
      type: "DIRECTIVE",
    },
    Mutiny: {
      description: intl.formatMessage(
        {
          id: "Agendas.Mutiny.Description",
          description: "Description for Agenda Card: Mutiny",
          defaultMessage:
            'For: Each player who voted "For" gains 1 victory point.{br}Against: Each player who voted "For" loses 1 victory point.',
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Mutiny",
      name: intl.formatMessage({
        id: "Agendas.Mutiny.Title",
        description: "Title of Agenda Card: Mutiny",
        defaultMessage: "Mutiny",
      }),
      type: "DIRECTIVE",
    },
    "New Constitution": {
      description: intl.formatMessage(
        {
          id: "Agendas.New Constitution.Description",
          description: "Description for Agenda Card: New Constitution",
          defaultMessage:
            "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.{br}For: Discard all laws in play. At the start of the next strategy phase, each player exhausts each planet in their home system.{br}Against: No effect.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "New Constitution",
      name: intl.formatMessage({
        id: "Agendas.New Constitution.Title",
        description: "Title of Agenda Card: New Constitution",
        defaultMessage: "New Constitution",
      }),
      type: "DIRECTIVE",
    },
    "Prophecy of Ixth": {
      description: intl.formatMessage(
        {
          id: "Agendas.Prophecy of Ixth.Description",
          description: "Description for Agenda Card: Prophecy of Ixth",
          defaultMessage:
            "The elected player gains this card.{br}The owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      id: "Prophecy of Ixth",
      name: intl.formatMessage({
        id: "Agendas.Prophecy of Ixth.Title",
        description: "Title of Agenda Card: Prophecy of Ixth",
        defaultMessage: "Prophecy of Ixth",
      }),
      type: "LAW",
    },
    "Public Execution": {
      description: intl.formatMessage({
        id: "Agendas.Public Execution.Description",
        description: "Description for Agenda Card: Public Execution",
        defaultMessage:
          "The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their left. The elected player cannot vote on any agendas during this agenda phase.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Public Execution",
      name: intl.formatMessage({
        id: "Agendas.Public Execution.Title",
        description: "Title of Agenda Card: Public Execution",
        defaultMessage: "Public Execution",
      }),
      type: "DIRECTIVE",
    },
    "Publicize Weapon Schematics": {
      description: intl.formatMessage(
        {
          id: "Agendas.Publicize Weapon Schematics.Description",
          description:
            "Description for Agenda Card: Publicize Weapon Schematics",
          defaultMessage:
            "For: If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE.{br}Against: Each player that owns a war sun technology discards all of their action cards.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Publicize Weapon Schematics",
      name: intl.formatMessage({
        id: "Agendas.Publicize Weapon Schematics.Title",
        description: "Title of Agenda Card: Publicize Weapon Schematics",
        defaultMessage: "Publicize Weapon Schematics",
      }),
      type: "LAW",
    },
    "Regulated Conscription": {
      description: intl.formatMessage(
        {
          id: "Agendas.Regulated Conscription.Description",
          description: "Description for Agenda Card: Regulated Conscription",
          defaultMessage:
            "For: When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.{br}Against: No effect.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Regulated Conscription",
      name: intl.formatMessage({
        id: "Agendas.Regulated Conscription.Title",
        description: "Title of Agenda Card: Regulated Conscription",
        defaultMessage: "Regulated Conscription",
      }),
      type: "LAW",
    },
    "Representative Government": {
      description: intl.formatMessage(
        {
          id: "Agendas.Representative Government.Description",
          description: "Description for Agenda Card: Representative Government",
          defaultMessage:
            'For: Players cannot exhaust planets to cast votes during the agenda phase. Each player may cast 1 vote on each agenda instead.{br}Against: At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets.',
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Representative Government",
      name: intl.formatMessage({
        id: "Agendas.Representative Government.Title",
        description: "Title of Agenda Card: Representative Government",
        defaultMessage: "Representative Government",
      }),
      omegas: [
        {
          expansion: "POK",
          description: intl.formatMessage(
            {
              id: "Agendas.Representative Government.Omega.Description",
              description:
                "Omega description for Agenda Card: Representative Government",
              defaultMessage:
                'For: Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead. Players cannot cast additional votes.{br}Against: At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets.',
            },
            { br: "\n\n" }
          ),
        },
      ],
      type: "LAW",
    },
    "Research Team: Biotic": {
      description: intl.formatMessage(
        {
          id: "Agendas.Research Team: Biotic.Description",
          description: "Description for Agenda Card: Research Team: Biotic",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}When the owner of this planet researches technology, they may exhaust this card to ignore 1 green prerequisite.",
        },
        { br: "\n\n" }
      ),
      elect: "Industrial Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Research Team: Biotic",
      name: intl.formatMessage({
        id: "Agendas.Research Team: Biotic.Title",
        description: "Title of Agenda Card: Research Team: Biotic",
        defaultMessage: "Research Team: Biotic",
      }),
      type: "LAW",
    },
    "Research Team: Cybernetic": {
      description: intl.formatMessage(
        {
          id: "Agendas.Research Team: Cybernetic.Description",
          description: "Description for Agenda Card: Research Team: Cybernetic",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}When the owner of this planet researches technology, they may exhaust this card to ignore 1 yellow prerequisite.",
        },
        { br: "\n\n" }
      ),
      elect: "Industrial Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Research Team: Cybernetic",
      name: intl.formatMessage({
        id: "Agendas.Research Team: Cybernetic.Title",
        description: "Title of Agenda Card: Research Team: Cybernetic",
        defaultMessage: "Research Team: Cybernetic",
      }),
      type: "LAW",
    },
    "Research Team: Propulsion": {
      description: intl.formatMessage(
        {
          id: "Agendas.Research Team: Propulsion.Description",
          description: "Description for Agenda Card: Research Team: Propulsion",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}When the owner of this planet researches technology, they may exhaust this card to ignore 1 blue prerequisite.",
        },
        { br: "\n\n" }
      ),
      elect: "Industrial Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Research Team: Propulsion",
      name: intl.formatMessage({
        id: "Agendas.Research Team: Propulsion.Title",
        description: "Title of Agenda Card: Research Team: Propulsion",
        defaultMessage: "Research Team: Propulsion",
      }),
      type: "LAW",
    },
    "Research Team: Warfare": {
      description: intl.formatMessage(
        {
          id: "Agendas.Research Team: Warfare.Description",
          description: "Description for Agenda Card: Research Team: Warfare",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}When the owner of this planet researches technology, they may exhaust this card to ignore 1 red prerequisite.",
        },
        { br: "\n\n" }
      ),
      elect: "Hazardous Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Research Team: Warfare",
      name: intl.formatMessage({
        id: "Agendas.Research Team: Warfare.Title",
        description: "Title of Agenda Card: Research Team: Warfare",
        defaultMessage: "Research Team: Warfare",
      }),
      type: "LAW",
    },
    "Seed of an Empire": {
      description: intl.formatMessage(
        {
          id: "Agendas.Seed of an Empire.Description",
          description: "Description for Agenda Card: Seed of an Empire",
          defaultMessage:
            "For: The player with most victory points gains 1 victory point.{br}Against: The player with the fewest victory points gains 1 victory point.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Seed of an Empire",
      name: intl.formatMessage({
        id: "Agendas.Seed of an Empire.Title",
        description: "Title of Agenda Card: Seed of an Empire",
        defaultMessage: "Seed of an Empire",
      }),
      type: "DIRECTIVE",
    },
    "Senate Sanctuary": {
      description: intl.formatMessage(
        {
          id: "Agendas.Senate Sanctuary.Description",
          description: "Description for Agenda Card: Senate Sanctuary",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}The influence value of this planet is increased by 2.",
        },
        { br: "\n\n" }
      ),
      elect: "Cultural Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Senate Sanctuary",
      name: intl.formatMessage({
        id: "Agendas.Senate Sanctuary.Title",
        description: "Title of Agenda Card: Senate Sanctuary",
        defaultMessage: "Senate Sanctuary",
      }),
      type: "LAW",
    },
    "Shard of the Throne": {
      description: intl.formatMessage(
        {
          id: "Agendas.Shard of the Throne.Description",
          description: "Description for Agenda Card: Shard of the Throne",
          defaultMessage:
            "The elected player gains this card.{br}A player gains this card and 1 victory point when they win a combat against the owner of this card.{br}Then, the previous owner of this card loses 1 victory point.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      removedIn: "POK",
      id: "Shard of the Throne",
      name: intl.formatMessage({
        id: "Agendas.Shard of the Throne.Title",
        description: "Title of Agenda Card: Shard of the Throne",
        defaultMessage: "Shard of the Throne",
      }),
      type: "LAW",
    },
    "Shared Research": {
      description: intl.formatMessage(
        {
          id: "Agendas.Shared Research.Description",
          description: "Description for Agenda Card: Shared Research",
          defaultMessage:
            "For: Each player's units can move through nebulae.{br}Against: Each player places a command token from their reinforcements in their home system, if able.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Shared Research",
      name: intl.formatMessage({
        id: "Agendas.Shared Research.Title",
        description: "Title of Agenda Card: Shared Research",
        defaultMessage: "Shared Research",
      }),
      type: "LAW",
    },
    "Swords to Plowshares": {
      description: intl.formatMessage(
        {
          id: "Agendas.Swords to Plowshares.Description",
          description: "Description for Agenda Card: Swords to Plowshares",
          defaultMessage:
            "For: Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed.{br}Against: Each player places 1 infantry from their reinforcements on each planet they control.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Swords to Plowshares",
      name: intl.formatMessage({
        id: "Agendas.Swords to Plowshares.Title",
        description: "Title of Agenda Card: Swords to Plowshares",
        defaultMessage: "Swords to Plowshares",
      }),
      type: "DIRECTIVE",
    },
    "Terraforming Initiative": {
      description: intl.formatMessage(
        {
          id: "Agendas.Terraforming Initiative.Description",
          description: "Description for Agenda Card: Terraforming Initiative",
          defaultMessage:
            "Attach this card to the elected planet's card.{br}The resource and influence values of this planet are increased by 1.",
        },
        { br: "\n\n" }
      ),
      elect: "Hazardous Planet",
      expansion: "BASE",
      removedIn: "POK",
      id: "Terraforming Initiative",
      name: intl.formatMessage({
        id: "Agendas.Terraforming Initiative.Title",
        description: "Title of Agenda Card: Terraforming Initiative",
        defaultMessage: "Terraforming Initiative",
      }),
      type: "LAW",
    },
    "The Crown of Emphidia": {
      description: intl.formatMessage(
        {
          id: "Agendas.The Crown of Emphidia.Description",
          description: "Description for Agenda Card: The Crown of Emphidia",
          defaultMessage:
            "The elected player gains this card.{br}A player gains this card and 1 victory point after they gain control of a planet in the home system of this card's owner.{br}Then, the previous owner of this card loses 1 victory point.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      removedIn: "POK",
      id: "The Crown of Emphidia",
      name: intl.formatMessage({
        id: "Agendas.The Crown of Emphidia.Title",
        description: "Title of Agenda Card: The Crown of Emphidia",
        defaultMessage: "The Crown of Emphidia",
      }),
      type: "LAW",
    },
    "The Crown of Thalnos": {
      description: intl.formatMessage(
        {
          id: "Agendas.The Crown of Thalnos.Description",
          description: "Description for Agenda Card: The Crown of Thalnos",
          defaultMessage:
            "The elected player gains this card.{br}During each combat round, the owner of this card may reroll any number of dice; they must destroy each of their units that did not produce a hit with its reroll.",
        },
        { br: "\n\n" }
      ),
      elect: "Player",
      expansion: "BASE",
      removedIn: "POK",
      id: "The Crown of Thalnos",
      name: intl.formatMessage({
        id: "Agendas.The Crown of Thalnos.Title",
        description: "Title of Agenda Card: The Crown of Thalnos",
        defaultMessage: "The Crown of Thalnos",
      }),
      type: "LAW",
    },
    "Unconventional Measures": {
      description: intl.formatMessage(
        {
          id: "Agendas.Unconventional Measures.Description",
          description: "Description for Agenda Card: Unconventional Measures",
          defaultMessage:
            'For: Each player that voted "For" draws 2 action cards.{br}Against: Each player that voted "For" discards all of their action cards.',
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Unconventional Measures",
      name: intl.formatMessage({
        id: "Agendas.Unconventional Measures.Title",
        description: "Title of Agenda Card: Unconventional Measures",
        defaultMessage: "Unconventional Measures",
      }),
      type: "DIRECTIVE",
    },
    "Wormhole Reconstruction": {
      description: intl.formatMessage(
        {
          id: "Agendas.Wormhole Reconstruction.Description",
          description: "Description for Agenda Card: Wormhole Reconstruction",
          defaultMessage:
            "For: All systems that contain either an alpha or beta wormhole are adjacent to each other.{br}Against: Each player places a command token from their reinforcements in each system that contains a wormhole and 1 or more of their ships.",
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Wormhole Reconstruction",
      name: intl.formatMessage({
        id: "Agendas.Wormhole Reconstruction.Title",
        description: "Title of Agenda Card: Wormhole Reconstruction",
        defaultMessage: "Wormhole Reconstruction",
      }),
      type: "LAW",
    },
    "Wormhole Research": {
      description: intl.formatMessage(
        {
          id: "Agendas.Wormhole Research.Description",
          description: "Description for Agenda Card: Wormhole Research",
          defaultMessage:
            'For: Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole.{br}Against: Each player that voted "Against" removes 1 command token from their command sheet and returns it to their reinforcements.',
        },
        { br: "\n\n" }
      ),
      elect: "For/Against",
      expansion: "BASE",
      id: "Wormhole Research",
      name: intl.formatMessage({
        id: "Agendas.Wormhole Research.Title",
        description: "Title of Agenda Card: Wormhole Research",
        defaultMessage: "Wormhole Research",
      }),
      type: "DIRECTIVE",
    },
  };
}
