import { IntlShape } from "react-intl";

export function getBaseAgendas(intl: IntlShape): Record<AgendaId, BaseAgenda> {
  return {
    "Anti-Intellectual Revolution": {
      description: intl.formatMessage({
        id: "Anti-Intellectual Revolution.Description",
        description:
          "Description for Agenda Card: Anti-Intellectual Revolution",
        defaultMessage:
          "FOR : After a player researches a technology, they must destroy 1 of their non-fighter ships.\\n\\nAGAINST : At the start of the next strategy phase, each player chooses and exhausts 1 planet for each technology they own.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Anti-Intellectual Revolution",
      name: intl.formatMessage({
        id: "Anti-Intellectual Revolution.Title",
        description: "Title of Agenda Card: Anti-Intellectual Revolution",
        defaultMessage: "Anti-Intellectual Revolution",
      }),
      type: "LAW",
    },
    "Archived Secret": {
      description: intl.formatMessage({
        id: "Archived Secret.Description",
        description: "Description for Agenda Card: Archived Secret",
        defaultMessage: "Elected player draws 1 secret objective.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Archived Secret",
      name: intl.formatMessage({
        id: "Archived Secret.Title",
        description: "Title of Agenda Card: Archived Secret",
        defaultMessage: "Archived Secret",
      }),
      type: "DIRECTIVE",
    },
    "Armed Forces Standardization": {
      description: intl.formatMessage({
        id: "Armed Forces Standardization.Description",
        description:
          "Description for Agenda Card: Armed Forces Standardization",
        defaultMessage:
          "The elected player places command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements.",
      }),
      elect: "Player",
      expansion: "POK",
      id: "Armed Forces Standardization",
      name: intl.formatMessage({
        id: "Armed Forces Standardization.Title",
        description: "Title of Agenda Card: Armed Forces Standardization",
        defaultMessage: "Armed Forces Standardization",
      }),
      type: "DIRECTIVE",
    },
    "Arms Reduction": {
      description: intl.formatMessage({
        id: "Arms Reduction.Description",
        description: "Description for Agenda Card: Arms Reduction",
        defaultMessage:
          "FOR : Each player destroys all but 2 of their dreadnaughts and all but 4 of their cruisers.\\n\\nAGAINST : At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Arms Reduction",
      name: intl.formatMessage({
        id: "Arms Reduction.Title",
        description: "Title of Agenda Card: Arms Reduction",
        defaultMessage: "Arms Reduction",
      }),
      type: "DIRECTIVE",
    },
    "Articles of War": {
      description: intl.formatMessage({
        id: "Articles of War.Description",
        description: "Description for Agenda Card: Articles of War",
        defaultMessage:
          'FOR : All mechs lose their printed abilities except for SUSTAIN DAMAGE.\\n\\nAGAINST : Each player that voted "For" gains 3 trade goods.',
      }),
      elect: "For/Against",
      expansion: "POK",
      id: "Articles of War",
      name: intl.formatMessage({
        id: "Articles of War.Title",
        description: "Title of Agenda Card: Articles of War",
        defaultMessage: "Articles of War",
      }),
      type: "LAW",
    },
    "Checks and Balances": {
      description: intl.formatMessage({
        id: "Checks and Balances.Description",
        description: "Description for Agenda Card: Checks and Balances",
        defaultMessage:
          "FOR : When a player chooses a strategy card during the strategy phase, they give that strategy card to another player that does not have 1 (or a player that does not have 2 in a three- or four-player game), if able.\\n\\nAGAINST : Each player readies only 3 of their planets at the end of this agenda phase.",
      }),
      elect: "For/Against",
      expansion: "POK",
      id: "Checks and Balances",
      name: intl.formatMessage({
        id: "Checks and Balances.Title",
        description: "Title of Agenda Card: Checks and Balances",
        defaultMessage: "Checks and Balances",
      }),
      type: "LAW",
    },
    "Clandestine Operations": {
      description: intl.formatMessage({
        id: "Clandestine Operations.Description",
        description: "Description for Agenda Card: Clandestine Operations",
        defaultMessage:
          "FOR : Each player removes 2 command tokens from their command sheet and returns those tokens to their reinforcements.\\n\\nAGAINST : Each player removes 1 command token from their fleet pool and returns that token to their reinforcements.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Clandestine Operations",
      name: intl.formatMessage({
        id: "Clandestine Operations.Title",
        description: "Title of Agenda Card: Clandestine Operations",
        defaultMessage: "Clandestine Operations",
      }),
      type: "DIRECTIVE",
    },
    "Classified Document Leaks": {
      description: intl.formatMessage({
        id: "Classified Document Leaks.Description",
        description: "Description for Agenda Card: Classified Document Leaks",
        defaultMessage:
          "When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deck.\\n\\nThe elected secret objective becomes a public objective; place it near the other public objectives in the common play area.",
      }),
      elect: "Scored Secret Objective",
      expansion: "BASE",
      id: "Classified Document Leaks",
      name: intl.formatMessage({
        id: "Classified Document Leaks.Title",
        description: "Title of Agenda Card: Classified Document Leaks",
        defaultMessage: "Classified Document Leaks",
      }),
      type: "LAW",
    },
    "Colonial Redistribution": {
      description: intl.formatMessage({
        id: "Colonial Redistribution.Description",
        description: "Description for Agenda Card: Colonial Redistribution",
        defaultMessage:
          "Destroy each unit on the elected planet.\\n\\nThen, the player who controls that planet chooses 1 player with the fewest victory points; that player may place 1 infantry from their reinforcements on the elected planet.",
      }),
      elect: "Non-Home Planet Other Than Mecatol Rex",
      expansion: "BASE",
      id: "Colonial Redistribution",
      name: intl.formatMessage({
        id: "Colonial Redistribution.Title",
        description: "Title of Agenda Card: Colonial Redistribution",
        defaultMessage: "Colonial Redistribution",
      }),
      type: "DIRECTIVE",
    },
    "Committee Formation": {
      description: intl.formatMessage({
        id: "Committee Formation.Description",
        description: "Description for Agenda Card: Committee Formation",
        defaultMessage:
          "The elected player gains this card.\\n\\nBefore players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Committee Formation",
      name: intl.formatMessage({
        id: "Committee Formation.Title",
        description: "Title of Agenda Card: Committee Formation",
        defaultMessage: "Committee Formation",
      }),
      type: "LAW",
    },
    "Compensated Disarmament": {
      description: intl.formatMessage({
        id: "Compensated Disarmament.Description",
        description: "Description for Agenda Card: Compensated Disarmament",
        defaultMessage:
          "Destroy each ground force on the elected planet; for each unit that was destroyed, the player who controls that planet gains 1 trade good.",
      }),
      elect: "Planet",
      expansion: "BASE",
      id: "Compensated Disarmament",
      name: intl.formatMessage({
        id: "Compensated Disarmament.Title",
        description: "Title of Agenda Card: Compensated Disarmament",
        defaultMessage: "Compensated Disarmament",
      }),
      type: "DIRECTIVE",
    },
    "Conventions of War": {
      description: intl.formatMessage({
        id: "Conventions of War.Description",
        description: "Description for Agenda Card: Conventions of War",
        defaultMessage:
          'FOR : Players cannot use BOMBARDMENT against units that are on cultural planets.\\n\\nAGAINST : Each player that voted "Against" discards all of their action cards.',
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Conventions of War",
      name: intl.formatMessage({
        id: "Conventions of War.Title",
        description: "Title of Agenda Card: Conventions of War",
        defaultMessage: "Conventions of War",
      }),
      type: "LAW",
    },
    "Core Mining": {
      description: intl.formatMessage({
        id: "Core Mining.Description",
        description: "Description for Agenda Card: Core Mining",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nThen, destroy 1 infantry on the planet.\\n\\nThe resource value of this planet is increased by 2.",
      }),
      elect: "Hazardous Planet",
      expansion: "BASE ONLY",
      id: "Core Mining",
      name: intl.formatMessage({
        id: "Core Mining.Title",
        description: "Title of Agenda Card: Core Mining",
        defaultMessage: "Core Mining",
      }),
      type: "LAW",
    },
    "Covert Legislation": {
      description: intl.formatMessage({
        id: "Covert Legislation.Description",
        description: "Description for Agenda Card: Covert Legislation",
        defaultMessage:
          "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other players.\\n\\nInstead, the speaker reads the eligible outcomes aloud (For, Against, Elect Player, etc.); the other players vote for these outcomes as if they were outcomes of this agenda, without knowing their effects.",
      }),
      elect: "???",
      expansion: "POK",
      id: "Covert Legislation",
      name: intl.formatMessage({
        id: "Covert Legislation.Title",
        description: "Title of Agenda Card: Covert Legislation",
        defaultMessage: "Covert Legislation",
      }),
      type: "DIRECTIVE",
    },
    "Demilitarized Zone": {
      description: intl.formatMessage({
        id: "Demilitarized Zone.Description",
        description: "Description for Agenda Card: Demilitarized Zone",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nThen, destroy all units on that planet.\\n\\nPlayer's units cannot land, be produced, or be placed on this planet.",
      }),
      elect: "Cultural Planet",
      expansion: "BASE ONLY",
      id: "Demilitarized Zone",
      name: intl.formatMessage({
        id: "Demilitarized Zone.Title",
        description: "Title of Agenda Card: Demilitarized Zone",
        defaultMessage: "Demilitarized Zone",
      }),
      type: "LAW",
    },
    "Economic Equality": {
      description: intl.formatMessage({
        id: "Economic Equality.Description",
        description: "Description for Agenda Card: Economic Equality",
        defaultMessage:
          "FOR : Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods.\\n\\nAGAINST : Each player returns all of their trade goods to the supply.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Economic Equality",
      name: intl.formatMessage({
        id: "Economic Equality.Title",
        description: "Description for Agenda Card: Economic Equality",
        defaultMessage: "Economic Equality",
      }),
      type: "DIRECTIVE",
    },
    "Enforced Travel Ban": {
      description: intl.formatMessage({
        id: "Enforced Travel Ban.Description",
        description: "Description for Agenda Card: Enforced Travel Ban",
        defaultMessage:
          "FOR : Alpha and beta wormholes have no effect during movement.\\n\\nAGAINST : Destroy each PDS in or adjacent to a system that contains a wormhole.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Enforced Travel Ban",
      name: intl.formatMessage({
        id: "Enforced Travel Ban.Title",
        description: "Title of Agenda Card: Enforced Travel Ban",
        defaultMessage: "Enforced Travel Ban",
      }),
      type: "LAW",
    },
    "Executive Sanctions": {
      description: intl.formatMessage({
        id: "Executive Sanctions.Description",
        description: "Description for Agenda Card: Executive Sanctions",
        defaultMessage:
          "FOR : Each player can have a maximum of 3 action cards in their hand.\\n\\nAGAINST : Each player discards 1 random action card from their hand.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Executive Sanctions",
      name: intl.formatMessage({
        id: "Executive Sanctions.Title",
        description: "Title of Agenda Card: Executive Sanctions",
        defaultMessage: "Executive Sanctions",
      }),
      type: "LAW",
    },
    "Fleet Regulations": {
      description: intl.formatMessage({
        id: "Fleet Regulations.Description",
        description: "Description for Agenda Card: Fleet Regulations",
        defaultMessage:
          "FOR : Each player cannot have more than 4 tokens in their fleet pool.\\n\\nAGAINST : Each player places 1 command token from their reinforcements in their fleet pool.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Fleet Regulations",
      name: intl.formatMessage({
        id: "Fleet Regulations.Title",
        description: "Title of Agenda Card: Fleet Regulations",
        defaultMessage: "Fleet Regulations",
      }),
      type: "LAW",
    },
    "Galactic Crisis Pact": {
      description: intl.formatMessage({
        id: "Galactic Crisis Pact.Description",
        description: "Description for Agenda Card: Galactic Crisis Pact",
        defaultMessage:
          "Each player may perform the secondary ability of the elected strategy card without spending a command token; command tokens placed by the ability are placed from a player's reinforcements instead.",
      }),
      elect: "Strategy Card",
      expansion: "POK",
      id: "Galactic Crisis Pact",
      name: intl.formatMessage({
        id: "Galactic Crisis Pact.Title",
        description: "Title of Agenda Card: Galactic Crisis Pact",
        defaultMessage: "Galactic Crisis Pact",
      }),
      type: "DIRECTIVE",
    },
    "Holy Planet of Ixth": {
      description: intl.formatMessage({
        id: "Holy Planet of Ixth.Description",
        description: "Description for Agenda Card: Holy Planet of Ixth",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nThe planet's owner gains 1 victory point.\\n\\nUnits on this planet cannot use PRODUCTION.\\n\\nWhen a player gains control of this planet, they gain 1 victory point.\\n\\nWhen a player loses control of this planet, they lose 1 victory point.",
      }),
      elect: "Cultural Planet",
      expansion: "BASE ONLY",
      id: "Holy Planet of Ixth",
      name: intl.formatMessage({
        id: "Holy Planet of Ixth.Title",
        description: "Title of Agenda Card: Holy Planet of Ixth",
        defaultMessage: "Holy Planet of Ixth",
      }),
      type: "LAW",
    },
    "Homeland Defense Act": {
      description: intl.formatMessage({
        id: "Homeland Defense Act.Description",
        description: "Description for Agenda Card: Homeland Defense Act",
        defaultMessage:
          "FOR : Each player can have any number of PDS units on planets they control.\\n\\nAGAINST : Each player destroys 1 of their PDS units.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Homeland Defense Act",
      name: intl.formatMessage({
        id: "Homeland Defense Act.Title",
        description: "Title of Agenda Card: Homeland Defense Act",
        defaultMessage: "Homeland Defense Act",
      }),
      type: "LAW",
    },
    "Imperial Arbiter": {
      description: intl.formatMessage({
        id: "Imperial Arbiter.Description",
        description: "Description for Agenda Card: Imperial Arbiter",
        defaultMessage:
          "The elected player gains this card.\\n\\nAt the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Imperial Arbiter",
      name: intl.formatMessage({
        id: "Imperial Arbiter.Title",
        description: "Title of Agenda Card: Imperial Arbiter",
        defaultMessage: "Imperial Arbiter",
      }),
      type: "LAW",
    },
    "Incentive Program": {
      description: intl.formatMessage({
        id: "Incentive Program.Description",
        description: "Description for Agenda Card: Incentive Program",
        defaultMessage:
          "FOR : Draw and reveal 1 stage I public objective from the deck and place it near the public objectives.\\n\\nAGAINST : Draw and reveal 1 stage II public objective from the deck and place it near the public objectives.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Incentive Program",
      name: intl.formatMessage({
        id: "Incentive Program.Title",
        description: "Title for Agenda Card: Incentive Program",
        defaultMessage: "Incentive Program",
      }),
      type: "DIRECTIVE",
    },
    "Ixthian Artifact": {
      description: intl.formatMessage({
        id: "Ixthian Artifact.Description",
        description: "Description for Agenda Card: Ixthian Artifact",
        defaultMessage:
          "FOR : The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their units in each of those systems.\\n\\nAGAINST : No effect.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Ixthian Artifact",
      name: intl.formatMessage({
        id: "Ixthian Artifact.Title",
        description: "Title of Agenda Card: Ixthian Artifact",
        defaultMessage: "Ixthian Artifact",
      }),
      type: "DIRECTIVE",
    },
    "Judicial Abolishment": {
      description: intl.formatMessage({
        id: "Judicial Abolishment.Description",
        description: "Description for Agenda Card: Judicial Abolishment",
        defaultMessage:
          "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.\\n\\nDiscard the elected law from play.",
      }),
      elect: "Law",
      expansion: "BASE",
      id: "Judicial Abolishment",
      name: intl.formatMessage({
        id: "Judicial Abolishment.Title",
        description: "Title of Agenda Card: Judicial Abolishment",
        defaultMessage: "Judicial Abolishment",
      }),
      type: "DIRECTIVE",
    },
    "Minister of Antiques": {
      description: intl.formatMessage({
        id: "Minister of Antiques.Description",
        description: "Description for Agenda Card: Minister of Antiques",
        defaultMessage: "The elected player gains 1 relic.",
      }),
      elect: "Player",
      expansion: "POK",
      id: "Minister of Antiques",
      name: intl.formatMessage({
        id: "Minister of Antiques.Title",
        description: "Title of Agenda Card: Minister of Antiques",
        defaultMessage: "Minister of Antiques",
      }),
      type: "DIRECTIVE",
    },
    "Minister of Commerce": {
      description: intl.formatMessage({
        id: "Minister of Commerce.Description",
        description: "Description for Agenda Card: Minister of Commerce",
        defaultMessage:
          "The elected player gains this card.\\n\\nAfter the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Commerce",
      name: intl.formatMessage({
        id: "Minister of Commerce.Title",
        description: "Title of Agenda Card: Minister of Commerce",
        defaultMessage: "Minister of Commerce",
      }),
      type: "LAW",
    },
    "Minister of Exploration": {
      description: intl.formatMessage({
        id: "Minister of Exploration.Description",
        description: "Description for Agenda Card: Minister of Exploration",
        defaultMessage:
          "The elected player gains this card.\\n\\nWhen the owner of this card gains control of a planet, they gain 1 trade good.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Exploration",
      name: intl.formatMessage({
        id: "Minister of Exploration.Title",
        description: "Title of Agenda Card: Minister of Exploration",
        defaultMessage: "Minister of Exploration",
      }),
      type: "LAW",
    },
    "Minister of Industry": {
      description: intl.formatMessage({
        id: "Minister of Industry.Description",
        description: "Description for Agenda Card: Minister of Industry",
        defaultMessage:
          "The elected player gains this card.\\n\\nWhen the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Industry",
      name: intl.formatMessage({
        id: "Minister of Industry.Title",
        description: "Title of Agenda Card: Minister of Industry",
        defaultMessage: "Minister of Industry",
      }),
      type: "LAW",
    },
    "Minister of Peace": {
      description: intl.formatMessage({
        id: "Minister of Peace.Description",
        description: "Description for Agenda Card: Minister of Peace",
        defaultMessage:
          "The elected player gains this card.\\n\\nAfter a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card; immediately end the active player's turn.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Peace",
      name: intl.formatMessage({
        id: "Minister of Peace.Title",
        description: "Title of Agenda Card: Minister of Peace",
        defaultMessage: "Minister of Peace",
      }),
      type: "LAW",
    },
    "Minister of Policy": {
      description: intl.formatMessage({
        id: "Minister of Policy.Description",
        description: "Description for Agenda Card: Minister of Policy",
        defaultMessage:
          "The elected player gains this card.\\n\\nAt the end of the status phase, the owner of this card draws 1 action card.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Policy",
      name: intl.formatMessage({
        id: "Minister of Policy.Title",
        description: "Title of Agenda Card: Minister of Policy",
        defaultMessage: "Minister of Policy",
      }),
      type: "LAW",
    },
    "Minister of Sciences": {
      description: intl.formatMessage({
        id: "Minister of Sciences.Description",
        description: "Description for Agenda Card: Minister of Sciences",
        defaultMessage:
          'The elected player gains this card.\\n\\nWhen the owner of this card resolves the primary or secondary ability of the "Technology" strategy card, they do not need to spend resources to research technology.',
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of Sciences",
      name: intl.formatMessage({
        id: "Minister of Sciences.Title",
        description: "Title of Agenda Card: Minister of Sciences",
        defaultMessage: "Minister of Sciences",
      }),
      type: "LAW",
    },
    "Minister of War": {
      description: intl.formatMessage({
        id: "Minister of War.Description",
        description: "Description for Agenda Card: Minister of War",
        defaultMessage:
          "The elected player gains this card.\\n\\nThe owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements; then they may perform 1 additional action.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Minister of War",
      name: intl.formatMessage({
        id: "Minister of War.Title",
        description: "Title of Agenda Card: Minister of War",
        defaultMessage: "Minister of War",
      }),
      type: "LAW",
    },
    "Miscount Disclosed": {
      description: intl.formatMessage({
        id: "Miscount Disclosed.Description",
        description: "Description for Agenda Card: Miscount Disclosed",
        defaultMessage:
          "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.\\n\\nVote on the elected law as if it were just revealed from the top of the deck.",
      }),
      elect: "Law",
      expansion: "BASE",
      id: "Miscount Disclosed",
      name: intl.formatMessage({
        id: "Miscount Disclosed.Title",
        description: "Title of Agenda Card: Miscount Disclosed",
        defaultMessage: "Miscount Disclosed",
      }),
      type: "DIRECTIVE",
    },
    Mutiny: {
      description: intl.formatMessage({
        id: "Mutiny.Description",
        description: "Description for Agenda Card: Mutiny",
        defaultMessage:
          'FOR : Each player who voted "For" gains 1 victory point.\\n\\nAGAINST : Each player who voted "For" loses 1 victory point.',
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Mutiny",
      name: intl.formatMessage({
        id: "Mutiny.Title",
        description: "Title of Agenda Card: Mutiny",
        defaultMessage: "Mutiny",
      }),
      type: "DIRECTIVE",
    },
    "New Constitution": {
      description: intl.formatMessage({
        id: "New Constitution.Description",
        description: "Description for Agenda Card: New Constitution",
        defaultMessage:
          "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.\\n\\nFOR : Discard all laws in play. At the start of the next strategy phase, each player exhausts each planet in their home system.\\n\\nAGAINST : No effect.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "New Constitution",
      name: intl.formatMessage({
        id: "New Constitution.Title",
        description: "Title of Agenda Card: New Constitution",
        defaultMessage: "New Constitution",
      }),
      type: "DIRECTIVE",
    },
    "Nexus Sovereignty": {
      description: intl.formatMessage({
        id: "Nexus Sovereignty.Description",
        description: "Description for Agenda Card: Nexus Sovereignty",
        defaultMessage:
          "FOR : Alpha and beta wormholes in the wormhole nexus have no effect during movement.\\n\\nAGAINST : Place a gamma wormhole token in the Mecatol Rex system.",
      }),
      elect: "For/Against",
      expansion: "POK",
      id: "Nexus Sovereignty",
      name: intl.formatMessage({
        id: "Nexus Sovereignty.Title",
        description: "Title of Agenda Card: Nexus Sovereignty",
        defaultMessage: "Nexus Sovereignty",
      }),
      type: "LAW",
    },
    "Political Censure": {
      description: intl.formatMessage({
        id: "Political Censure.Description",
        description: "Description for Agenda Card: Political Censure",
        defaultMessage:
          "The elected player gains this card and 1 victory point.\\n\\nThe elected player cannot play action cards.\\n\\nIf the owner of this card loses this card, they lose 1 victory point.",
      }),
      elect: "Player",
      expansion: "POK",
      id: "Political Censure",
      name: intl.formatMessage({
        id: "Political Censure.Title",
        description: "Title of Agenda Card: Political Censure",
        defaultMessage: "Political Censure",
      }),
      type: "LAW",
    },
    "Prophecy of Ixth": {
      description: intl.formatMessage({
        id: "Prophecy of Ixth.Description",
        description: "Description for Agenda Card: Prophecy of Ixth",
        defaultMessage:
          "The elected player gains this card.\\n\\nThe owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Prophecy of Ixth",
      name: intl.formatMessage({
        id: "Prophecy of Ixth.Title",
        description: "Title of Agenda Card: Prophecy of Ixth",
        defaultMessage: "Prophecy of Ixth",
      }),
      type: "LAW",
    },
    "Public Execution": {
      description: intl.formatMessage({
        id: "Public Execution.Description",
        description: "Description for Agenda Card: Public Execution",
        defaultMessage:
          "The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their left. The elected player cannot vote on any agendas during this agenda phase.",
      }),
      elect: "Player",
      expansion: "BASE",
      id: "Public Execution",
      name: intl.formatMessage({
        id: "Public Execution.Title",
        description: "Title of Agenda Card: Public Execution",
        defaultMessage: "Public Execution",
      }),
      type: "DIRECTIVE",
    },
    "Publicize Weapon Schematics": {
      description: intl.formatMessage({
        id: "Publicize Weapon Schematics.Description",
        description: "Description for Agenda Card: Publicize Weapon Schematics",
        defaultMessage:
          "FOR : If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE.\\n\\nAGAINST : Each player that owns a war sun technology discards all of their action cards.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Publicize Weapon Schematics",
      name: intl.formatMessage({
        id: "Publicize Weapon Schematics.Title",
        description: "Title of Agenda Card: Publicize Weapon Schematics",
        defaultMessage: "Publicize Weapon Schematics",
      }),
      type: "LAW",
    },
    "Rearmament Agreement": {
      description: intl.formatMessage({
        id: "Rearmament Agreement.Description",
        description: "Description for Agenda Card: Rearmament Agreement",
        defaultMessage:
          "FOR : Each player places 1 mech from their reinforcements on a planet they control in their home system.\\n\\nAGAINST : Each player replaces each of their mechs with 1 infantry from their reinforcements.",
      }),
      elect: "For/Against",
      expansion: "POK",
      id: "Rearmament Agreement",
      name: intl.formatMessage({
        id: "Rearmament Agreement.Title",
        description: "Title of Agenda Card: Rearmament Agreement",
        defaultMessage: "Rearmament Agreement",
      }),
      type: "DIRECTIVE",
    },
    "Regulated Conscription": {
      description: intl.formatMessage({
        id: "Regulated Conscription.Description",
        description: "Description for Agenda Card: Regulated Conscription",
        defaultMessage:
          "FOR : When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.\\n\\nAGAINST : No effect.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Regulated Conscription",
      name: intl.formatMessage({
        id: "Regulated Conscription.Title",
        description: "Title of Agenda Card: Regulated Conscription",
        defaultMessage: "Regulated Conscription",
      }),
      type: "LAW",
    },
    "Representative Government": {
      description: intl.formatMessage({
        id: "Representative Government.Description",
        description: "Description for Agenda Card: Representative Government",
        defaultMessage:
          'FOR : Players cannot exhaust planets to cast votes during the agenda phase. Each player may cast 1 vote on each agenda instead.\\n\\nAGAINST : At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets.',
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Representative Government",
      name: intl.formatMessage({
        id: "Representative Government.Title",
        description: "Title of Agenda Card: Representative Government",
        defaultMessage: "Representative Government",
      }),
      omega: {
        expansion: "POK",
        description: intl.formatMessage({
          id: "Representative Government.Omega.Description",
          description:
            "Omega description for Agenda Card: Representative Government",
          defaultMessage:
            'FOR : Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead. Players cannot cast additional votes.\\n\\nAGAINST : At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets.',
        }),
      },
      type: "LAW",
    },
    "Research Grant Reallocation": {
      description: intl.formatMessage({
        id: "Research Grant Reallocation.Description",
        description: "Description for Agenda Card: Research Grant Reallocation",
        defaultMessage:
          "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology, they remove 1 token from their fleet pool and return it to their reinforcements.",
      }),
      elect: "Player",
      expansion: "POK",
      id: "Research Grant Reallocation",
      name: intl.formatMessage({
        id: "Research Grant Reallocation.Title",
        description: "Title of Agenda Card: Research Grant Reallocation",
        defaultMessage: "Research Grant Reallocation",
      }),
      type: "DIRECTIVE",
    },
    "Research Team: Biotic": {
      description: intl.formatMessage({
        id: "Research Team: Biotic.Description",
        description: "Description for Agenda Card: Research Team: Biotic",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 green prerequisite.",
      }),
      elect: "Industrial Planet",
      expansion: "BASE ONLY",
      id: "Research Team: Biotic",
      name: intl.formatMessage({
        id: "Research Team: Biotic.Title",
        description: "Title of Agenda Card: Research Team: Biotic",
        defaultMessage: "Research Team: Biotic",
      }),
      type: "LAW",
    },
    "Research Team: Cybernetic": {
      description: intl.formatMessage({
        id: "Research Team: Cybernetic.Description",
        description: "Description for Agenda Card: Research Team: Cybernetic",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 yellow prerequisite.",
      }),
      elect: "Industrial Planet",
      expansion: "BASE ONLY",
      id: "Research Team: Cybernetic",
      name: intl.formatMessage({
        id: "Research Team: Cybernetic.Title",
        description: "Title of Agenda Card: Research Team: Cybernetic",
        defaultMessage: "Research Team: Cybernetic",
      }),
      type: "LAW",
    },
    "Research Team: Propulsion": {
      description: intl.formatMessage({
        id: "Research Team: Propulsion.Description",
        description: "Description for Agenda Card: Research Team: Propulsion",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 blue prerequisite.",
      }),
      elect: "Industrial Planet",
      expansion: "BASE ONLY",
      id: "Research Team: Propulsion",
      name: intl.formatMessage({
        id: "Research Team: Propulsion.Title",
        description: "Title of Agenda Card: Research Team: Propulsion",
        defaultMessage: "Research Team: Propulsion",
      }),
      type: "LAW",
    },
    "Research Team: Warfare": {
      description: intl.formatMessage({
        id: "Research Team: Warfare.Description",
        description: "Description for Agenda Card: Research Team: Warfare",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 red prerequisite.",
      }),
      elect: "Hazardous Planet",
      expansion: "BASE ONLY",
      id: "Research Team: Warfare",
      name: intl.formatMessage({
        id: "Research Team: Warfare.Title",
        description: "Title of Agenda Card: Research Team: Warfare",
        defaultMessage: "Research Team: Warfare",
      }),
      type: "LAW",
    },
    "Search Warrant": {
      description: intl.formatMessage({
        id: "Search Warrant.Description",
        description: "Description for Agenda Card: Search Warrant",
        defaultMessage:
          "The elected player gains this card and draws 2 secret objectives.\\n\\nThe owner of this card plays with their secret objectives revealed.",
      }),
      elect: "Player",
      expansion: "POK",
      id: "Search Warrant",
      name: intl.formatMessage({
        id: "Search Warrant.Title",
        description: "Title of Agenda Card: Search Warrant",
        defaultMessage: "Search Warrant",
      }),
      type: "LAW",
    },
    "Seed of an Empire": {
      description: intl.formatMessage({
        id: "Seed of an Empire.Description",
        description: "Description for Agenda Card: Seed of an Empire",
        defaultMessage:
          "FOR : The player with most victory points gains 1 victory point.\\n\\nAGAINST : The player with the fewest victory points gains 1 victory point.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Seed of an Empire",
      name: intl.formatMessage({
        id: "Seed of an Empire.Title",
        description: "Title of Agenda Card: Seed of an Empire",
        defaultMessage: "Seed of an Empire",
      }),
      type: "DIRECTIVE",
    },
    "Senate Sanctuary": {
      description: intl.formatMessage({
        id: "Senate Sanctuary.Description",
        description: "Description for Agenda Card: Senate Sanctuary",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nThe influence value of this planet is increased by 2.",
      }),
      elect: "Cultural Planet",
      expansion: "BASE ONLY",
      id: "Senate Sanctuary",
      name: intl.formatMessage({
        id: "Senate Sanctuary.Title",
        description: "Title of Agenda Card: Senate Sanctuary",
        defaultMessage: "Senate Sanctuary",
      }),
      type: "LAW",
    },
    "Shard of the Throne": {
      description: intl.formatMessage({
        id: "Shard of the Throne.Description",
        description: "Description for Agenda Card: Shard of the Throne",
        defaultMessage:
          "The elected player gains this card.\\n\\nA player gains this card and 1 victory point when they win a combat against the owner of this card.\\n\\nThen, the previous owner of this card loses 1 victory point.",
      }),
      elect: "Player",
      expansion: "BASE ONLY",
      id: "Shard of the Throne",
      name: intl.formatMessage({
        id: "Shard of the Throne.Title",
        description: "Title of Agenda Card: Shard of the Throne",
        defaultMessage: "Shard of the Throne",
      }),
      type: "LAW",
    },
    "Shared Research": {
      description: intl.formatMessage({
        id: "Shared Research.Description",
        description: "Description for Agenda Card: Shared Research",
        defaultMessage:
          "FOR : Each player's units can move through nebulae.\\n\\nAGAINST : Each player places a command token from their reinforcements in their home system, if able.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Shared Research",
      name: intl.formatMessage({
        id: "Shared Research.Title",
        description: "Title of Agenda Card: Shared Research",
        defaultMessage: "Shared Research",
      }),
      type: "LAW",
    },
    "Swords to Plowshares": {
      description: intl.formatMessage({
        id: "Swords to Plowshares.Description",
        description: "Description for Agenda Card: Swords to Plowshares",
        defaultMessage:
          "FOR : Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed.\\n\\nAGAINST : Each player places 1 infantry from their reinforcements on each planet they control.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Swords to Plowshares",
      name: intl.formatMessage({
        id: "Swords to Plowshares.Title",
        description: "Title of Agenda Card: Swords to Plowshares",
        defaultMessage: "Swords to Plowshares",
      }),
      type: "DIRECTIVE",
    },
    "Terraforming Initiative": {
      description: intl.formatMessage({
        id: "Terraforming Initiative.Description",
        description: "Description for Agenda Card: Terraforming Initiative",
        defaultMessage:
          "Attach this card to the elected planet's card.\\n\\nThe resource and influence values of this planet are increased by 1.",
      }),
      elect: "Hazardous Planet",
      expansion: "BASE ONLY",
      id: "Terraforming Initiative",
      name: intl.formatMessage({
        id: "Terraforming Initiative.Title",
        description: "Title of Agenda Card: Terraforming Initiative",
        defaultMessage: "Terraforming Initiative",
      }),
      type: "LAW",
    },
    "The Crown of Emphidia": {
      description: intl.formatMessage({
        id: "The Crown of Emphidia.Description",
        description: "Description for Agenda Card: The Crown of Emphidia",
        defaultMessage:
          "The elected player gains this card.\\n\\nA player gains this card and 1 victory point after they gain control of a planet in the home system of this card's owner.\\n\\nThen, the previous owner of this card loses 1 victory point.",
      }),
      elect: "Player",
      expansion: "BASE ONLY",
      id: "The Crown of Emphidia",
      name: intl.formatMessage({
        id: "The Crown of Emphidia.Title",
        description: "Title of Agenda Card: The Crown of Emphidia",
        defaultMessage: "The Crown of Emphidia",
      }),
      type: "LAW",
    },
    "The Crown of Thalnos": {
      description: intl.formatMessage({
        id: "The Crown of Thalnos.Description",
        description: "Description for Agenda Card: The Crown of Thalnos",
        defaultMessage:
          "The elected player gains this card.\\n\\nDuring each combat round, the owner of this card may reroll any number of dice; they must destroy each of their units that did not produce a hit with its reroll.",
      }),
      elect: "Player",
      expansion: "BASE ONLY",
      id: "The Crown of Thalnos",
      name: intl.formatMessage({
        id: "The Crown of Thalnos.Title",
        description: "Title of Agenda Card: The Crown of Thalnos",
        defaultMessage: "The Crown of Thalnos",
      }),
      type: "LAW",
    },
    "Unconventional Measures": {
      description: intl.formatMessage({
        id: "Unconventional Measures.Description",
        description: "Description for Agenda Card: Unconventional Measures",
        defaultMessage:
          'FOR : Each player that voted "For" draws 2 action cards.\\n\\nAGAINST : Each player that voted "For" discards all of their action cards.',
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Unconventional Measures",
      name: intl.formatMessage({
        id: "Unconventional Measures.Title",
        description: "Title of Agenda Card: Unconventional Measures",
        defaultMessage: "Unconventional Measures",
      }),
      type: "DIRECTIVE",
    },
    "Wormhole Reconstruction": {
      description: intl.formatMessage({
        id: "Wormhole Reconstruction.Description",
        description: "Description for Agenda Card: Wormhole Reconstruction",
        defaultMessage:
          "FOR : All systems that contain either an alpha or beta wormhole are adjacent to each other.\\n\\nAGAINST : Each player places a command token from their reinforcements in each system that contains a wormhole and 1 or more of their ships.",
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Wormhole Reconstruction",
      name: intl.formatMessage({
        id: "Wormhole Reconstruction.Title",
        description: "Title of Agenda Card: Wormhole Reconstruction",
        defaultMessage: "Wormhole Reconstruction",
      }),
      type: "LAW",
    },
    "Wormhole Research": {
      description: intl.formatMessage({
        id: "Wormhole Research.Description",
        description: "Description for Agenda Card: Wormhole Research",
        defaultMessage:
          'FOR : Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole.\\n\\nAGAINST : Each player that voted "Against" removes 1 command token from their command sheet and returns it to their reinforcements.',
      }),
      elect: "For/Against",
      expansion: "BASE",
      id: "Wormhole Research",
      name: intl.formatMessage({
        id: "Wormhole Research.Title",
        description: "Title of Agenda Card: Wormhole Research",
        defaultMessage: "Wormhole Research",
      }),
      type: "DIRECTIVE",
    },
  };
}
