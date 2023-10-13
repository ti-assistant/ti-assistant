export const BASE_AGENDAS: Record<AgendaId, BaseAgenda> = {
  "Anti-Intellectual Revolution": {
    description:
      "FOR: After a player researches a technology, they must destroy 1 of their non-fighter ships\n\nAGAINST: At the start of the next strategy phase, each player chooses and exhausts 1 planet for each technology they own",
    elect: "For/Against",
    expansion: "BASE",
    id: "Anti-Intellectual Revolution",
    name: "Anti-Intellectual Revolution",
    type: "LAW",
  },
  "Archived Secret": {
    description: "Elected player draws 1 secret objective",
    elect: "Player",
    expansion: "BASE",
    id: "Archived Secret",
    name: "Archived Secret",
    type: "DIRECTIVE",
  },
  "Armed Forces Standardization": {
    description:
      "The elected player places command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements",
    elect: "Player",
    expansion: "POK",
    id: "Armed Forces Standardization",
    name: "Armed Forces Standardization",
    type: "DIRECTIVE",
  },
  "Arms Reduction": {
    description:
      "FOR : Each player destroys all but 2 of their dreadnaughts and all but 4 of their cruisers\n\nAGAINST : At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty",
    elect: "For/Against",
    expansion: "BASE",
    id: "Arms Reduction",
    name: "Arms Reduction",
    type: "DIRECTIVE",
  },
  "Articles of War": {
    description:
      'FOR : All mechs lose their printed abilities except for SUSTAIN DAMAGE.\n\nAGAINST : Each player that voted "For" gains 3 trade goods.',
    elect: "For/Against",
    expansion: "POK",
    id: "Articles of War",
    name: "Articles of War",
    type: "LAW",
  },
  "Checks and Balances": {
    description:
      "FOR : When a player chooses a strategy card during the strategy phase, they give that strategy card to another player that does not have 1 (or a player that does not have 2 in a three- or four-player game), if able\n\nAGAINST : Each player readies only 3 of their planets at the end of this agenda phase",
    elect: "For/Against",
    expansion: "POK",
    id: "Checks and Balances",
    name: "Checks and Balances",
    type: "LAW",
  },
  "Clandestine Operations": {
    description:
      "FOR : Each player removes 2 command tokens from their command sheet and returns those tokens to their reinforcements\n\nAGAINST : Each player removes 1 command token from their fleet pool and returns that token to their reinforcements",
    elect: "For/Against",
    expansion: "BASE",
    id: "Clandestine Operations",
    name: "Clandestine Operations",
    type: "DIRECTIVE",
  },
  "Classified Document Leaks": {
    description:
      "When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deck\n\nThe elected secret objective becomes a public objective; place it near the other public objectives in the common play area",
    elect: "Scored Secret Objective",
    expansion: "BASE",
    id: "Classified Document Leaks",
    name: "Classified Document Leaks",
    type: "LAW",
  },
  "Colonial Redistribution": {
    description:
      "Destroy each unit on the elected planet.\nThen, the player who controls that planet chooses 1 player with the fewest victory points; that player may place 1 infantry from their reinforcements on the elected planet",
    elect: "Non-Home Planet Other Than Mecatol Rex",
    expansion: "BASE",
    id: "Colonial Redistribution",
    name: "Colonial Redistribution",
    type: "DIRECTIVE",
  },
  "Committee Formation": {
    description:
      "The elected player gains this card\n\nBefore players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda",
    elect: "Player",
    expansion: "BASE",
    id: "Committee Formation",
    name: "Committee Formation",
    type: "LAW",
  },
  "Compensated Disarmament": {
    description:
      "Destroy each ground force on the elected planet; for each unit that was destroyed, the player who controls that planet gains 1 trade good",
    elect: "Planet",
    expansion: "BASE",
    id: "Compensated Disarmament",
    name: "Compensated Disarmament",
    type: "DIRECTIVE",
  },
  "Conventions of War": {
    description:
      'FOR : Players cannot use BOMBARDMENT against units that are on cultural planets\n\nAGAINST : Each player that voted "Against" discards all of their action cards',
    elect: "For/Against",
    expansion: "BASE",
    id: "Conventions of War",
    name: "Conventions of War",
    type: "LAW",
  },
  "Core Mining": {
    description:
      "Attach this card to the elected planet's card.\nThen, destroy 1 infantry on the planet.\nThe resource value of this planet is increased by 2",
    elect: "Hazardous Planet",
    expansion: "BASE ONLY",
    id: "Core Mining",
    name: "Core Mining",
    type: "LAW",
  },
  "Covert Legislation": {
    description:
      "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other players. Instead, the speaker reads the eligible outcomes aloud (For, Against, Elect Player, etc.); the other players vote for these outcomes as if they were outcomes of this agenda, without knowing their effects",
    elect: "???",
    expansion: "POK",
    id: "Covert Legislation",
    name: "Covert Legislation",
    type: "DIRECTIVE",
  },
  "Demilitarized Zone": {
    description:
      "Attach this card to the elected planet's card.\nThen, destroy all units on that planet.\nPlayer's units cannot land, be produced, or be placed on this planet",
    elect: "Cultural Planet",
    expansion: "BASE ONLY",
    id: "Demilitarized Zone",
    name: "Demilitarized Zone",
    type: "LAW",
  },
  "Economic Equality": {
    description:
      "FOR : Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods\n\nAGAINST : Each player returns all of their trade goods to the supply",
    elect: "For/Against",
    expansion: "BASE",
    id: "Economic Equality",
    name: "Economic Equality",
    type: "DIRECTIVE",
  },
  "Enforced Travel Ban": {
    description:
      "FOR : Alpha and beta wormholes have no effect during movement\n\nAGAINST : Destroy each PDS in or adjacent to a system that contains a wormhole",
    elect: "For/Against",
    expansion: "BASE",
    id: "Enforced Travel Ban",
    name: "Enforced Travel Ban",
    type: "LAW",
  },
  "Executive Sanctions": {
    description:
      "FOR : Each player can have a maximum of 3 action cards in their hand\n\nAGAINST : Each player discards 1 random action card from their hand",
    elect: "For/Against",
    expansion: "BASE",
    id: "Executive Sanctions",
    name: "Executive Sanctions",
    type: "LAW",
  },
  "Fleet Regulations": {
    description:
      "FOR : Each player cannot have more than 4 tokens in their fleet pool\n\nAGAINST : Each player places 1 command token from their reinforcements in their fleet pool",
    elect: "For/Against",
    expansion: "BASE",
    id: "Fleet Regulations",
    name: "Fleet Regulations",
    type: "LAW",
  },
  "Galactic Crisis Pact": {
    description:
      "Each player may perform the secondary ability of the elected strategy card without spending a command token; command tokens placed by the ability are placed from a player's reinforcements instead",
    elect: "Strategy Card",
    expansion: "POK",
    id: "Galactic Crisis Pact",
    name: "Galactic Crisis Pact",
    type: "DIRECTIVE",
  },
  "Holy Planet of Ixth": {
    description:
      "Attach this card to the elected planet's card.\nThe planet's owner gains 1 victory point.\nUnits on this planet cannot use PRODUCTION.\nWhen a player gains control of this planet, they gain 1 victory point.\nWhen a player loses control of this planet, they lose 1 victory point",
    elect: "Cultural Planet",
    expansion: "BASE ONLY",
    id: "Holy Planet of Ixth",
    name: "Holy Planet of Ixth",
    type: "LAW",
  },
  "Homeland Defense Act": {
    description:
      "FOR : Each player can have any number of PDS units on planets they control\n\nAGAINST : Each player destroys 1 of their PDS units",
    elect: "For/Against",
    expansion: "BASE",
    id: "Homeland Defense Act",
    name: "Homeland Defense Act",
    type: "LAW",
  },
  "Imperial Arbiter": {
    description:
      "The elected player gains this card\n\nAt the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards",
    elect: "Player",
    expansion: "BASE",
    id: "Imperial Arbiter",
    name: "Imperial Arbiter",
    type: "LAW",
  },
  "Incentive Program": {
    description:
      "FOR : Draw and reveal 1 stage I public objective from the deck and place it near the public objectives\n\nAGAINST : Draw and reveal 1 stage II public objective from the deck and place it near the public objectives",
    elect: "For/Against",
    expansion: "BASE",
    id: "Incentive Program",
    name: "Incentive Program",
    type: "DIRECTIVE",
  },
  "Ixthian Artifact": {
    description:
      "FOR : The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their units in each of those systems\n\nAGAINST : No effect",
    elect: "For/Against",
    expansion: "BASE",
    id: "Ixthian Artifact",
    name: "Ixthian Artifact",
    type: "DIRECTIVE",
  },
  "Judicial Abolishment": {
    description:
      "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck\n\nDiscard the elected law from play",
    elect: "Law",
    expansion: "BASE",
    id: "Judicial Abolishment",
    name: "Judicial Abolishment",
    type: "DIRECTIVE",
  },
  "Minister of Antiques": {
    description: "The elected player gains 1 relic",
    elect: "Player",
    expansion: "POK",
    id: "Minister of Antiques",
    name: "Minister of Antiques",
    type: "DIRECTIVE",
  },
  "Minister of Commerce": {
    description:
      "The elected player gains this card\n\nAfter the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor",
    elect: "Player",
    expansion: "BASE",
    id: "Minister of Commerce",
    name: "Minister of Commerce",
    type: "LAW",
  },
  "Minister of Exploration": {
    description:
      "The elected player gains this card\n\nWhen the owner of this card gains control of a planet, they gain 1 trade good",
    elect: "Player",
    expansion: "BASE",
    id: "Minister of Exploration",
    name: "Minister of Exploration",
    type: "LAW",
  },
  "Minister of Industry": {
    description:
      "The elected player gains this card\n\nWhen the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities",
    elect: "Player",
    expansion: "BASE",
    id: "Minister of Industry",
    name: "Minister of Industry",
    type: "LAW",
  },
  "Minister of Peace": {
    description:
      "The elected player gains this card\n\nAfter a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card; immediately end the active player's turn",
    elect: "Player",
    expansion: "BASE",
    id: "Minister of Peace",
    name: "Minister of Peace",
    type: "LAW",
  },
  "Minister of Policy": {
    description:
      "The elected player gains this card\n\nAt the end of the status phase, the owner of this card draws 1 action card",
    elect: "Player",
    expansion: "BASE",
    id: "Minister of Policy",
    name: "Minister of Policy",
    type: "LAW",
  },
  "Minister of Sciences": {
    description:
      'The elected player gains this card\n\nWhen the owner of this card resolves the primary or secondary ability of the "Technology" strategy card, they do not need to spend resources to research technology',
    elect: "Player",
    expansion: "BASE",
    id: "Minister of Sciences",
    name: "Minister of Sciences",
    type: "LAW",
  },
  "Minister of War": {
    description:
      "The elected player gains this card\n\nThe owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements; then they may perform 1 additional action",
    elect: "Player",
    expansion: "BASE",
    id: "Minister of War",
    name: "Minister of War",
    type: "LAW",
  },
  "Miscount Disclosed": {
    description:
      "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck\n\nVote on the elected law as if it were just revealed from the top of the deck",
    elect: "Law",
    expansion: "BASE",
    id: "Miscount Disclosed",
    name: "Miscount Disclosed",
    type: "DIRECTIVE",
  },
  Mutiny: {
    description:
      'FOR : Each player who voted "For" gains 1 victory point\n\nAGAINST : Each player who voted "For" loses 1 victory point',
    elect: "For/Against",
    expansion: "BASE",
    id: "Mutiny",
    name: "Mutiny",
    type: "DIRECTIVE",
  },
  "New Constitution": {
    description:
      "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck\n\nFOR : Discard all laws in play. At the start of the next strategy phase, each player exhausts each planet in their home system\n\nAGAINST : No effect",
    elect: "For/Against",
    expansion: "BASE",
    id: "New Constitution",
    name: "New Constitution",
    type: "DIRECTIVE",
  },
  "Nexus Sovereignty": {
    description:
      "FOR : Alpha and beta wormholes in the wormhole nexus have no effect during movement\n\nAGAINST : Place a gamma wormhole token in the Mecatol Rex system",
    elect: "For/Against",
    expansion: "POK",
    id: "Nexus Sovereignty",
    name: "Nexus Sovereignty",
    type: "LAW",
  },
  "Political Censure": {
    description:
      "The elected player gains this card and 1 victory point.\nThe elected player cannot play action cards.\nIf the owner of this card loses this card, they lose 1 victory point",
    elect: "Player",
    expansion: "POK",
    id: "Political Censure",
    name: "Political Censure",
    type: "LAW",
  },
  "Prophecy of Ixth": {
    description:
      "The elected player gains this card\n\nThe owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters",
    elect: "Player",
    expansion: "BASE",
    id: "Prophecy of Ixth",
    name: "Prophecy of Ixth",
    type: "LAW",
  },
  "Public Execution": {
    description:
      "The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their left. The elected player cannot vote on any agendas during this agenda phase",
    elect: "Player",
    expansion: "BASE",
    id: "Public Execution",
    name: "Public Execution",
    type: "DIRECTIVE",
  },
  "Publicize Weapon Schematics": {
    description:
      "FOR : If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE\n\nAGAINST : Each player that owns a war sun technology discards all of their action cards",
    elect: "For/Against",
    expansion: "BASE",
    id: "Publicize Weapon Schematics",
    name: "Publicize Weapon Schematics",
    type: "LAW",
  },
  "Rearmament Agreement": {
    description:
      "FOR : Each player places 1 mech from their reinforcements on a planet they control in their home system\n\nAGAINST : Each player replaces each of their mechs with 1 infantry from their reinforcements",
    elect: "For/Against",
    expansion: "POK",
    id: "Rearmament Agreement",
    name: "Rearmament Agreement",
    type: "DIRECTIVE",
  },
  "Regulated Conscription": {
    description:
      "FOR : When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2\n\nAGAINST : No effect",
    elect: "For/Against",
    expansion: "BASE",
    id: "Regulated Conscription",
    name: "Regulated Conscription",
    type: "LAW",
  },
  "Representative Government": {
    description:
      'FOR : Players cannot exhaust planets to cast votes during the agenda phase. Each player may cast 1 vote on each agenda instead\n\nAGAINST : At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets',
    elect: "For/Against",
    expansion: "BASE",
    id: "Representative Government",
    name: "Representative Government",
    omega: {
      expansion: "POK",
      description:
        'FOR : Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead. Players cannot cast additional votes\n\nAGAINST : At the start of the next strategy phase, each player that voted "Against" exhausts all of their cultural planets',
    },
    type: "LAW",
  },
  "Research Grant Reallocation": {
    description:
      "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology, they remove 1 token from their fleet pool and return it to their reinforcements",
    elect: "Player",
    expansion: "POK",
    id: "Research Grant Reallocation",
    name: "Research Grant Reallocation",
    type: "DIRECTIVE",
  },
  "Research Team: Biotic": {
    description:
      "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 green prerequisite",
    elect: "Industrial Planet",
    expansion: "BASE ONLY",
    id: "Research Team: Biotic",
    name: "Research Team: Biotic",
    type: "LAW",
  },
  "Research Team: Cybernetic": {
    description:
      "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 yellow prerequisite",
    elect: "Industrial Planet",
    expansion: "BASE ONLY",
    id: "Research Team: Cybernetic",
    name: "Research Team: Cybernetic",
    type: "LAW",
  },
  "Research Team: Propulsion": {
    description:
      "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 blue prerequisite",
    elect: "Industrial Planet",
    expansion: "BASE ONLY",
    id: "Research Team: Propulsion",
    name: "Research Team: Propulsion",
    type: "LAW",
  },
  "Research Team: Warfare": {
    description:
      "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 red prerequisite",
    elect: "Hazardous Planet",
    expansion: "BASE ONLY",
    id: "Research Team: Warfare",
    name: "Research Team: Warfare",
    type: "LAW",
  },
  "Search Warrant": {
    description:
      "The elected player gains this card and draws 2 secret objectives.\nThe owner of this card plays with their secret objectives revealed",
    elect: "Player",
    expansion: "POK",
    id: "Search Warrant",
    name: "Search Warrant",
    type: "LAW",
  },
  "Seed of an Empire": {
    description:
      "FOR : The player with most victory points gains 1 victory point\n\nAGAINST : The player with the fewest victory points gains 1 victory point",
    elect: "For/Against",
    expansion: "BASE",
    id: "Seed of an Empire",
    name: "Seed of an Empire",
    type: "DIRECTIVE",
  },
  "Senate Sanctuary": {
    description:
      "Attach this card to the elected planet's card.\nThe influence value of this planet is increased by 2",
    elect: "Cultural Planet",
    expansion: "BASE ONLY",
    id: "Senate Sanctuary",
    name: "Senate Sanctuary",
    type: "LAW",
  },
  "Shard of the Throne": {
    description:
      "The elected player gains this card\n\nA player gains this card and 1 victory point when they win a combat against the owner of this card.\nThen, the previous owner of this card loses 1 victory point",
    elect: "Player",
    expansion: "BASE ONLY",
    id: "Shard of the Throne",
    name: "Shard of the Throne",
    type: "LAW",
  },
  "Shared Research": {
    description:
      "FOR : Each player's units can move through nebulae\n\nAGAINST : Each player places a command token from their reinforcements in their home system, if able",
    elect: "For/Against",
    expansion: "BASE",
    id: "Shared Research",
    name: "Shared Research",
    type: "LAW",
  },
  "Swords to Plowshares": {
    description:
      "FOR : Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed\n\nAGAINST : Each player places 1 infantry from their reinforcements on each planet they control",
    elect: "For/Against",
    expansion: "BASE",
    id: "Swords to Plowshares",
    name: "Swords to Plowshares",
    type: "DIRECTIVE",
  },
  "Terraforming Initiative": {
    description:
      "Attach this card to the elected planet's card.\nThe resource and influence values of this planet are increased by 1",
    elect: "Hazardous Planet",
    expansion: "BASE ONLY",
    id: "Terraforming Initiative",
    name: "Terraforming Initiative",
    type: "LAW",
  },
  "The Crown of Emphidia": {
    description:
      "The elected player gains this card\n\nA player gains this card and 1 victory point after they gain control of a planet in the home system of this card's owner.\nThen, the previous owner of this card loses 1 victory point",
    elect: "Player",
    expansion: "BASE ONLY",
    id: "The Crown of Emphidia",
    name: "The Crown of Emphidia",
    type: "LAW",
  },
  "The Crown of Thalnos": {
    description:
      "The elected player gains this card\n\nDuring each combat round, the owner of this card may reroll any number of dice; they must destroy each of their units that did not produce a hit with its reroll",
    elect: "Player",
    expansion: "BASE ONLY",
    id: "The Crown of Thalnos",
    name: "The Crown of Thalnos",
    type: "LAW",
  },
  "Unconventional Measures": {
    description:
      'FOR : Each player that voted "For" draws 2 action cards\n\nAGAINST : Each player that voted "For" discards all of their action cards',
    elect: "For/Against",
    expansion: "BASE",
    id: "Unconventional Measures",
    name: "Unconventional Measures",
    type: "DIRECTIVE",
  },
  "Wormhole Reconstruction": {
    description:
      "FOR : All systems that contain either an alpha or beta wormhole are adjacent to each other\n\nAGAINST : Each player places a command token from their reinforcements in each system that contains a wormhole and 1 or more of their ships",
    elect: "For/Against",
    expansion: "BASE",
    id: "Wormhole Reconstruction",
    name: "Wormhole Reconstruction",
    type: "LAW",
  },
  "Wormhole Research": {
    description:
      'FOR : Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole\n\nAGAINST : Each player that voted "Against" removes 1 command token from their command sheet and returns it to their reinforcements',
    elect: "For/Against",
    expansion: "BASE",
    id: "Wormhole Research",
    name: "Wormhole Research",
    type: "DIRECTIVE",
  },
};
