export const DISCORDANT_STARS_LEADERS: Record<
  DiscordantStars.LeaderId,
  BaseLeader
> = {
  // Augurs of Ilyxum
  Clodho: {
    description:
      "After a player explores a legendary planet or a planet that has a technology specialty, you may exhaust this card to allow that player to gain 2 trade goods.",
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    name: "Clodho",
    timing: "OTHER",
    type: "AGENT",
  },
  Lachis: {
    description:
      "This card satisfies a yellow technology prerequisite.\n\nWhen you cast at least 1 vote, cast 1 additional vote for every 2 technologies you own.",
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    name: "Lachis",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Win a combat in a system that contains a legendary planet or a planet that has a technology specialty.",
  },
  Atropha: {
    abilityName: "Woven Fate",
    description:
      "ACTION: Draw 3 objective cards from 1 of the public objective decks; choose up to 1 of those cards to replace an objective card on a player's faction sheet, and return the others to the bottom of their corresponding decks.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    name: "Atropha",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Bentor Conglomerate
  "COO Mgur": {
    description:
      "ACTION: Exhaust this card and choose 1 player.\n\nFor each Fragment token on your faction sheet, that player gains 1 commodity. For each commodity they would gain in excess of their commodity value, they gain 1 trade good instead.",
    expansion: "DISCORDANT STARS",
    faction: "Bentor Conglomerate",
    name: "C.O.O. Mgur",
    timing: "COMPONENT_ACTION",
    type: "AGENT",
  },
  "CMO Ranc": {
    description: "Your commodity value is increased by 1.",
    expansion: "DISCORDANT STARS",
    faction: "Bentor Conglomerate",
    name: "C.M.O. Ranc",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 3 Fragment tokens on your faction sheet.",
  },
  "CEO Ken Tucc": {
    abilityName: "Primordial Data Core",
    description:
      "ACTION: Purge this card to explore each planet you control in any order.",
    expansion: "DISCORDANT STARS",
    faction: "Bentor Conglomerate",
    name: "C.E.O. Ken Tucc",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Berserkers of Kjalengard
  "Merkismathr Asvand": {
    description:
      "At the start of a combat:\n\nExhaust this card to move a Glory token to the active system, if able. Then, the active player may gain a number of commodities equal to the number of neighbors they have.",
    expansion: "DISCORDANT STARS",
    faction: "Berserkers of Kjalengard",
    name: "Merkismathr Asvand",
    timing: "OTHER",
    type: "AGENT",
  },
  "Sdallari Tvungovot": {
    description:
      "After you roll dice during the first round of a combat:\n\nReroll the combat dice of up to 4 of your fighters or infantry, applying +1 to the results; the Kjalengard player captures any units that reroll dice this way and do not produce at least 1 hit.",
    expansion: "DISCORDANT STARS",
    faction: "Berserkers of Kjalengard",
    name: "Sdallari Tvungovot",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 2 Glory tokens on the game board.",
  },
  "Ygegnad The Thunder": {
    abilityName: "For Eternal Glory",
    description:
      "ACTION: For each system that contains a Glory token, remove up to 1 command token in or adjacent to that system from the game board and gain 1 command token, if able.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Berserkers of Kjalengard",
    name: "Ygegnad, The Thunder",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Blex Pestilence
  // Speygh: {
  //   abilityName: "Galactic Blight",
  //   description:
  //     "Attach this card to 1 of your strategy cards. Its initiative value is 9.\n\nNon-Blex Players may only resolve 1 clause of this strategy card's primary ability and must spend 1 additional command token from their strategy pool to resolve the secondary ability of this strategy card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Blex Pestilence",
  //   name: "Speygh",
  //   timing: "COMPONENT_ACTION",
  //   type: "HERO",
  // },
  // Celdauri Trade Confederation
  "George Nobin": {
    description:
      "At the end of a player's tactical action:\n\nYou may exhaust this card to allow that player to spend 2 trade goods or 2 commodities to place 1 spacedock from their reinforcements on a planet they control in the active system.",
    expansion: "DISCORDANT STARS",
    faction: "Celdauri Trade Confederation",
    name: "George Nobin",
    timing: "OTHER",
    type: "AGENT",
  },
  "Henry Storcher": {
    description:
      "After you activate a system that contains 1 or more of your space docks, gain 1 commodity.\n\nYour ships may treat systems that contain 1 or more of your space docks as adjacent to each other.",
    expansion: "DISCORDANT STARS",
    faction: "Celdauri Trade Confederation",
    name: "Henry Storcher",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Have 1 spacedock on the game board that is not adjacent to your home system.",
  },
  "Titus Flavius": {
    abilityName: "Merchant Rearmament",
    description:
      "After a player activates a system other than Mecatol Rex:\n\nYou may place 1 space dock on a planet you control in the active system, if able, replenish your commodities, and use the PRODUCTION ability of each of your units in the active system.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Celdauri Trade Confederation",
    name: "Titus Flavius",
    timing: "TACTICAL_ACTION",
    type: "HERO",
  },
  // Cheiran Hordes
  "Operator Kkavras": {
    description:
      "At the end of a player's turn:\n\nExhaust this card to allow that player to remove 1 of their command tokens from the game board and place that token in an adjacent system that contains 1 or more of their structures and none of their command tokens.",
    expansion: "DISCORDANT STARS",
    faction: "Cheiran Hordes",
    name: "Operator Kkavras",
    timing: "OTHER",
    type: "AGENT",
  },
  "Spc Phquaiset": {
    description:
      "While you are the defender during ground combat:\n\nAfter your opponent produces 1 or more hits against your units, you may spend 1 commodity or 1 trade good to cancel 1 of those hits.",
    expansion: "DISCORDANT STARS",
    faction: "Cheiran Hordes",
    name: "Spc. Phquaiset",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 4 structures on non-home planets.",
  },
  "Thakt Clqua": {
    abilityName: "Biomass Event",
    description:
      "ACTION: Gather units from your reinforcements up to equal to your starting units. Place these units, in any combination, in the space area of any systems that contain 1 of your structures and no other players' ships, or on planets you control.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Cheiran Hordes",
    name: "Thakt Clqua",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Dih-Mohn Flotilla
  "Jgin Faru": {
    description:
      "When a player commits 1 or more units to a planet during invasion:\n\nYou may exhaust this card to allow that player to place 1 infantry from their reinforcements on that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Dih-Mohn Flotilla",
    name: "Jgin Faru",
    timing: "OTHER",
    type: "AGENT",
  },
  "Clona Bathru": {
    description:
      "This card satisfies a red technology prerequisite.\n\nAt the start of a space combat in a system that contains 3 or more different types of your non-fighter ships, produce 1 hit against your opponent's ships.",
    expansion: "DISCORDANT STARS",
    faction: "Dih-Mohn Flotilla",
    name: "Clona Bathru",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Research a ship unit upgrade technology.",
  },
  "Verrisus Ypru": {
    abilityName: "Volatile EMP Burst",
    description:
      'After the "Roll Dice" step of space combat:\n\nYou may purge this card. If you do, all ships in the active system become damaged; during this round of space combat your ships cannot be destroyed.',
    expansion: "DISCORDANT STARS",
    faction: "Dih-Mohn Flotilla",
    name: "Verrisus Ypru",
    timing: "OTHER",
    type: "HERO",
  },
  // Edyn Mandate
  Allant: {
    description:
      "After a player passes:\n\nYou may exhaust this card to choose 1 player; that player may perform up to 1 action.\n\nThen, look at the top card of the agenda deck; you may discard that agenda card.",
    expansion: "DISCORDANT STARS",
    faction: "Edyn Mandate",
    name: "Allant",
    timing: "OTHER",
    type: "AGENT",
  },
  Kadryn: {
    description:
      "When any game effect would allow you to score a public objective, you may instead draw 1 secret objective.",
    expansion: "DISCORDANT STARS",
    faction: "Edyn Mandate",
    name: "Kadryn",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 1 or more laws in play.",
  },
  Midir: {
    abilityName: "Golden Order",
    description:
      "ACTION: For each Sigil on the game board, draw 1 agenda. Reveal and resolve each agenda in any order as if you had cast 1 vote for an outcome of your choice. Other players cannot resolve abilities during this action.",
    expansion: "DISCORDANT STARS",
    faction: "Edyn Mandate",
    name: "Midir",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Florzen Profiteers
  "Sal Gavda": {
    description:
      "At the start of a player's turn:\n\nYou may exhaust this card to allow that player to remove an attachment from a non-home planet they control and attach it to a non-home planet they control other than Mecatol Rex adjacent to that planet's system.",
    expansion: "DISCORDANT STARS",
    faction: "Florzen Profiteers",
    name: "Sal Gavda",
    timing: "OTHER",
    type: "AGENT",
  },
  "Quaxdol Junitas": {
    description:
      "After the second agenda is revealed during the agenda phase:\n\nYou may ready 1 planet you control; explore that planet, if able.",
    expansion: "DISCORDANT STARS",
    faction: "Florzen Profiteers",
    name: "Quaxdol Junitas",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Have the outcome you voted for or predicted on an agenda resolved.",
  },
  "Banua Gowen": {
    abilityName: "Shady Acquisitions",
    description:
      "ACTION: Place 2 fighters from your reinforcements in each system that contains 1 or more planets you control and no other player's ships.\n\nThen, you may remove 1 attachment from any planet in a non-home system that contains 1 or more of your ships and attach it to 1 planet in your home system.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Florzen Profiteers",
    name: "Banua Gowen",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Free Systems Compact
  "Cordo Haved": {
    description:
      "While ready, this card has the text ability of each legendary planet ability card any player controls, even if that card is exhausted.\n\nYou may allow another player to use this card's ability.",
    expansion: "DISCORDANT STARS",
    faction: "Free Systems Compact",
    name: "Cordo Haved",
    timing: "OTHER",
    type: "AGENT",
  },
  "President Cyhn": {
    description:
      "After you gain control of a non-home planet during a tactical action:\n\nIf you have 1 or more ships in the active system, you may produce 1 ship in that system.",
    expansion: "DISCORDANT STARS",
    faction: "Free Systems Compact",
    name: "President Cyhn",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Each non-legendary planet on the game board is controlled.",
  },
  "Count Otto Pmay": {
    abilityName: "Freedom or Death",
    description:
      "ACTION: Ready a non-home planet other than Mecatol Rex that you control, remove all units on that planet and attach this card to it.\n\nUnits cannot be committed to, produced on, or placed on this planet.",
    expansion: "DISCORDANT STARS",
    faction: "Free Systems Compact",
    name: "Count Otto P'may",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Ghemina Raiders
  "Skarvald & Torvar": {
    description:
      "When the active player produces 1 or more hits during a round of combat:\n\nYou may exhaust this card to allow that player to produce 1 additional hit.",
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    name: "Skarvald & Torvar",
    timing: "OTHER",
    type: "AGENT",
  },
  "Jarl Vel & Jarl Jotrun": {
    description:
      "After you win a space combat in a system that contains no planets or a planet with a structure, you may gain 1 trade good.",
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    name: "Jarl Vel & Jarl Jotrun",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 2 flagships on the game board.",
  },
  Korela: {
    abilityName: "Fear and Ash",
    description:
      "ACTION: Purge this card to destroy all units on a non-home planet other than Mecatol Rex that is adjacent to a system that contains 1 of your flagships.",
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    name: "Korela",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  Kantrus: {
    abilityName: "Alleged Birthright",
    description:
      "ACTION: Purge this card to choose 1 non-home planet other than Mecatol Rex that does not contain another player's units and is adjacent to a system that contains 1 of your flagships; gain control of that planet.\n\nThen, ready that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Ghemina Raiders",
    name: "Kantrus",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Ghoti Wayfarers
  Becece: {
    description:
      "When a player produces 1 or more units:\n\nYou may exhaust this card to allow that player to either produce 2 additional units or gain 1 trade good.",
    expansion: "DISCORDANT STARS",
    faction: "Ghoti Wayfarers",
    name: "Becece",
    timing: "OTHER",
    type: "AGENT",
  },
  "Ceie Doleegueaunm": {
    description:
      "After you activate a system, you may treat each system that contains no planets as adjacent to each other system that contains no planets during this tactical action.",
    expansion: "DISCORDANT STARS",
    faction: "Ghoti Wayfarers",
    name: "Ceie Doleegueaunm",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have units in 3 systems that do not contain planets.",
  },
  Nmenmede: {
    abilityName: "The Ghoti Arise",
    description:
      "ACTION: For each system that contains 1 or more of your ships, you may replace 1 of your non-fighter ships in that system with a ship from your reinforcements that has a cost value of up to 2 greater than the cost value of that ship.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Ghoti Wayfarers",
    name: "Nmenmede",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Gledge Union
  Durran: {
    description:
      "When 1 or more of a player's units use PRODUCTION: You may exhaust this card to apply +3 to the total PRODUCTION value of that player's units.",
    expansion: "DISCORDANT STARS",
    faction: "Gledge Union",
    name: "Durran",
    timing: "OTHER",
    type: "AGENT",
  },
  Voldun: {
    description:
      "When you use the PRODUCTION of 1 or more of your units, you may increase the total PRODUCTION value of those units by 1 for each space dock you control.",
    expansion: "DISCORDANT STARS",
    faction: "Gledge Union",
    name: "Voldun",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Control non-fighter ships with a total combined cost value of at least 10 in 1 system.",
  },
  Gorthrim: {
    abilityName: "World Shapers",
    description:
      "ACTION: Reveal cards from any non-frontier exploration decks until you reveal up to 3 attachments, if able; attach those cards to any planets you control of the corresponding planet type, and discard the rest.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Gledge Union",
    name: "Gorthrim",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Glimmer of Mortheus
  Walik: {
    description:
      "When a player produces 1 or more units in a system:\n\nYou may exhaust this card to allow that player to place 1 of the produced units in the space area of an adjacent system that does not contain another player's ships.",
    expansion: "DISCORDANT STARS",
    faction: "Glimmer of Mortheus",
    name: "Walik",
    timing: "OTHER",
    type: "AGENT",
  },
  Komat: {
    description:
      "At the start of a space combat while you are not the active player:\n\nChoose 1 of your non-fighter ships in the active system to gain SUSTAIN DAMAGE until the end of combat.",
    expansion: "DISCORDANT STARS",
    faction: "Glimmer of Mortheus",
    name: "Komat",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have ships in 3 systems not adjacent to your home system.",
  },
  Bayan: {
    abilityName: "Two by Two",
    description:
      "ACTION: Purge this card to choose 1 ship you control in each system;\n\nfor each of those units, you may place 1 unit of that type from your reinforcements in the space area of that unit's system, if able.",
    expansion: "DISCORDANT STARS",
    faction: "Glimmer of Mortheus",
    name: "Bayan",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Kollecc Society
  "Captain Dust": {
    description:
      "At the start of a player's turn:\n\nYou may exhaust this card to allow that player to reveal the top 2 cards of an exploration deck that matches a planet they control; they gain any relic fragments that they revealed and discard the rest.",
    expansion: "DISCORDANT STARS",
    faction: "Kollecc Society",
    name: "Captain Dust",
    timing: "OTHER",
    type: "AGENT",
  },
  "Kado Smah-Qar": {
    description:
      "This card satisfies a blue technology prerequisite.\n\nWhen you retreat, if the active system does not contain 1 of your command tokens, you do not place a command token in the system your ships retreated to.",
    expansion: "DISCORDANT STARS",
    faction: "Kollecc Society",
    name: "Kado S'mah-Qar",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 4 relic fragments.",
  },
  "Dorrahn Griphyn": {
    abilityName: "Stealth Expedition",
    description:
      "ACTION: Draw a number of relic cards up to an amount equal to the number of players in the game, choose 1 to gain, and return the rest to the relic deck.\n\nThen, shuffle that deck and purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Kollecc Society",
    name: "Dorrahn Griphyn",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Kortali Tribunal
  "Queen Lucreia": {
    description:
      "When a player wins a ground combat:\n\nYou may exhaust this card to allow that player to take 1 relic fragment their opponent owns, at random, if able.",
    expansion: "DISCORDANT STARS",
    faction: "Kortali Tribunal",
    name: "Queen Lucreia",
    timing: "OTHER",
    type: "AGENT",
  },
  "Queen Lorena": {
    description:
      "During the first round of a combat, you may cancel 1 hit produced against your units.",
    expansion: "DISCORDANT STARS",
    faction: "Kortali Tribunal",
    name: "Queen Lorena",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Destroy the last of a player's units in a system.",
  },
  "Queen Nadalia": {
    abilityName: "Mother Goddesses",
    description:
      "When you win a combat:\n\nYou may purge this card to choose and take up to 1 of your opponent's relics.\n\nThen, for each planet you control that is a legendary planet or has a technology specialty, gain 1 command token.",
    expansion: "DISCORDANT STARS",
    faction: "Kortali Tribunal",
    name: "Queen Nadalia",
    timing: "OTHER",
    type: "HERO",
  },
  // Kyro Sodality
  Tox: {
    description:
      "After a player loses or draws a ground combat: You may exhaust this card to allow that player to replenish their commodities; place a number of infantry equal to 1 less than their commodity value on 1 planet you control.",
    expansion: "DISCORDANT STARS",
    faction: "Kyro Sodality",
    name: "Tox",
    timing: "OTHER",
    type: "AGENT",
  },
  "Silas Deriga": {
    description:
      "When you cast votes: Remove any number of your infantry from the game board to cast 1 additional vote for each infantry removed.",
    expansion: "DISCORDANT STARS",
    faction: "Kyro Sodality",
    name: "Silas Deriga",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 6 infantry and 6 fighters on the game board.",
  },
  Speygh: {
    abilityName: "Galactic Blight",
    description:
      "ACTION: Attach this card to 1 of your strategy cards. Its initiative value is 9.\n\nNon-Kyro Players may only resolve 1 clause of this strategy card's primary ability.\n\nThe Kyro player gains any trade goods placed on this card.",
    expansion: "DISCORDANT STARS",
    faction: "Kyro Sodality",
    name: "Speygh",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Monks of Kolume
  "Disciple Fran": {
    description:
      "ACTION: Exhaust this card to allow a player to redistribute 1 of their command tokens on their command sheet.",
    expansion: "DISCORDANT STARS",
    faction: "Monks of Kolume",
    name: "Disciple Fran",
    timing: "COMPONENT_ACTION",
    type: "AGENT",
  },
  "Issac of Sinci": {
    description: "Apply +1 to each of your unit's ability rolls.",
    expansion: "DISCORDANT STARS",
    faction: "Monks of Kolume",
    name: "Issac of Sinci",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "During the action phase, ready 1 of your technologies.",
  },
  "Wonell the Silent": {
    abilityName: "Streaks in the Night",
    description:
      "ACTION: Place this card near the game board; during this game round, after you perform a component action, you may use 1 of your unit's SPACE CANNON against ships in or adjacent to that unit's system, without rolling additional dice.\n\nAt the end of this game round, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Monks of Kolume",
    name: "Wonell the Silent",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Lanefir Remnants
  "Vassa Hagi": {
    description:
      "When a player explores, you may exhaust this card to allow that player to discard 1 exploration card they drew and draw another.",
    expansion: "DISCORDANT STARS",
    faction: "Lanefir Remnants",
    name: "Vassa Hagi",
    timing: "OTHER",
    type: "AGENT",
  },
  "Master Halbert": {
    description:
      "After you explore a planet: You may place 1 infantry from your reinforcements on that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Lanefir Remnants",
    name: "Master Halbert",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "7 relic fragments have been purged.",
  },
  "The Venerable": {
    abilityName: "Broken Legacy",
    description:
      "ACTION: Draw and reveal up to 3 relics. For each relic that started this action in a player's play area, gain 1 command token. Then, you may swap that relic for 1 of the revealed relics or relics in a player's play area. \n\nThen, shuffle the remaining relics into the relic deck and purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Lanefir Remnants",
    name: "The Venerable",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Li-Zho Dynasty
  "Vasra Ivo": {
    description:
      "At the end of a player's turn:\n\nYou may exhaust this card to allow that player to place 2 fighters from their reinforcements in the space area of a system that contains 1 or more of their ships.",
    expansion: "DISCORDANT STARS",
    faction: "Li-Zho Dynasty",
    name: "Vasra Ivo",
    timing: "OTHER",
    type: "AGENT",
  },
  "Dhume Tathu": {
    abilityName: "Closing Moves",
    description:
      "During a round of combat in which no more than 1 of your non-fighter ships or 1 of your infantry is participating, you may choose 1 of your units in that combat, that unit rolls 1 additional combat die.",
    expansion: "DISCORDANT STARS",
    faction: "Li-Zho Dynasty",
    name: "Dhume Tathu",
    timing: "OTHER",
    type: "COMMANDER",
    unlock: "Have 3 trap attachments on the game board.",
  },
  "Khaz-Rin Li-Zho": {
    abilityName: "Closing Moves",
    description:
      "ACTION: You may attach, or remove and attach, each Trap card to a planet on the game board; place a total of up to 12 fighters in any number of systems that contain 1 or more planets with Trap attachments and no other player's ships. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Li-Zho Dynasty",
    name: "Khaz-Rin Li-Zho",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // L'tokk Khrask
  "Udosh Brtul": {
    description:
      "When a player would spend influence:\n\nYou may exhaust this card to allow that player to spend the resources of 1 non-home planet they control as influence, in addition to its influence.",
    expansion: "DISCORDANT STARS",
    faction: "L'tokk Khrask",
    name: "Udosh B'rtul",
    timing: "OTHER",
    type: "AGENT",
  },
  "Hkot Tokal": {
    description:
      "At the start of invasion:\n\nYou may place 1 infantry unit from your reinforcements in the active system's space area if you have unused capacity in that system.",
    expansion: "DISCORDANT STARS",
    faction: "L'tokk Khrask",
    name: "Hkot Tokal",
    timing: "OTHER",
    type: "COMMANDER",
    unlock: "Win a ground combat on a planet you do not control.",
  },
  "Vehl-Tikar": {
    abilityName: "Worlds Awaken",
    description:
      "ACTION: Purge this card to choose up to 4 planets; exhaust or ready each of those planets.",
    expansion: "DISCORDANT STARS",
    faction: "L'tokk Khrask",
    name: "Vehl-Tikar",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Mirveda Protectorate
  "Logic Machina": {
    description:
      "After a player gains a unit upgrade technology:\n\nYou may exhaust this card to allow that player to spend 1 command token from their strategy pool to research 1 technology of the same color as any 1 of that unit upgrade's prerequisites.",
    expansion: "DISCORDANT STARS",
    faction: "Mirveda Protectorate",
    name: "Logic Machina",
    timing: "OTHER",
    type: "AGENT",
  },
  "Assault Machina": {
    description:
      "During Movement, for each infantry you transport, you may replace that unit with 1 fighter.\n\nYou may use the SPACE CANNON of 1 of your units against ships that are adjacent to that unit's system.",
    expansion: "DISCORDANT STARS",
    faction: "Mirveda Protectorate",
    name: "Assault Machina",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Own 2 unit upgrade technologies.",
  },
  "Wrath Machina": {
    abilityName: "Peace at Last",
    description:
      "ACTION: Place up to 3 PDS units from your reinforcements on planets you control and choose 1 system; your PDS units may use their SPACE CANNON on ships in that system, and BOMBARDMENT against units on 1 planet in that system.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Mirveda Protectorate",
    name: "Wrath Machina",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Myko-Mentori
  "Lactarius Indigo": {
    description:
      "Before a player rolls a die, you may instead exhaust this card and choose 1 Omen die near the Myko-Mentori player's faction sheet; resolve that die roll as if it had the result of that Omen die.",
    expansion: "DISCORDANT STARS",
    faction: "Myko-Mentori",
    name: "Lactarius Indigo",
    timing: "OTHER",
    type: "AGENT",
  },
  "Amanita Muscaria": {
    description:
      "After another player produces 1 or more hits against your units during space combat, you may spend 1 commodity or 1 trade good to cancel 1 of those hits.",
    expansion: "DISCORDANT STARS",
    faction: "Myko-Mentori",
    name: "Amanita Muscaria",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 4 commodities on your faction sheet.",
  },
  "Coprinus Comatus": {
    abilityName: "Rise Again",
    description:
      "When another player's hero would be purged, instead attach it to this card. You may resolve this card as if it instead had the text of any single hero attached to this card. When this card is purged, purge each of its attachments as well.",
    expansion: "DISCORDANT STARS",
    faction: "Myko-Mentori",
    name: "Coprinus Comatus",
    timing: "MULTIPLE",
    type: "HERO",
  },
  // Nivyn Star Kings
  "Suldhan Wraeg": {
    description:
      "When a player would use 1 unit's non-PRODUCTION unit ability in a system that contains or is adjacent to an anomaly, you may exhaust this card to prevent that unit from using that unit ability.",
    expansion: "DISCORDANT STARS",
    faction: "Nivyn Star Kings",
    name: "Suldhan Wraeg",
    timing: "OTHER",
    type: "AGENT",
  },
  "Thussad Krath": {
    abilityName: "Eye of the Abyss",
    description:
      "When 1 or more of your damaged units make a combat roll, up to 2 of those units may roll an additional combat die.",
    expansion: "DISCORDANT STARS",
    faction: "Nivyn Star Kings",
    name: "Thussad Krath",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have units in 2 different non-home anomalies.",
  },
  "Krill Drakkon": {
    abilityName: "Eye of the Abyss",
    description:
      "ACTION: Each unit on the game board with SUSTAIN DAMAGE, other than your mechs, becomes damaged, if able. Place this card near the game board; you may treat each unit you control as adjacent to the system that contains the Wound token until the end of this game round.\n\nAt the end of this game round, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Nivyn Star Kings",
    name: "Krill Drakkon",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Nokar Sellships
  "Sal Sparrow": {
    description:
      "You may exhaust this card to allow 1 player with 1 or more ships in the active system to place 1 destroyer from their reinforcements in that system.\n\nThen, you may resolve 1 transaction with that player.",
    expansion: "DISCORDANT STARS",
    faction: "Nokar Sellships",
    name: "Sal Sparrow",
    timing: "OTHER",
    type: "AGENT",
  },
  "Jack Hallard": {
    description:
      "Before you assign hits to your ships during a space combat, if you announced a retreat, cancel up to 2 hits. During combat, you may treat the active system as adjacent to each system adjacent to your home system.",
    expansion: "DISCORDANT STARS",
    faction: "Nokar Sellships",
    name: "Jack Hallard",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Another player moves 1 of your ships.",
  },
  Starsails: {
    abilityName: "Galactic Press Gang",
    description:
      "ACTION: Place this card near the game board, until the end of this game round, each of your planets gains the PRODUCTION 3 ability as if it were a unit.\n\nAt the end of this game round, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Nokar Sellships",
    name: "Starsails",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Olradin League
  "Baggil Wildpaw": {
    description:
      "After a player exhausts a cultural, hazardous, or industrial planet they control:\n\nYou may exhaust this card to allow that player to ready a planet they control of a different trait than that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Olradin League",
    name: "Baggil Wildpaw",
    timing: "OTHER",
    type: "AGENT",
  },
  "Knak Halfear": {
    description:
      "When you pass:\n\nYou may exhaust 1 non-home planet you control other than Mecatol Rex to gain a number of trade goods equal to that planet's resource or influence value.",
    expansion: "DISCORDANT STARS",
    faction: "Olradin League",
    name: "Knak Halfear",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Control 1 cultural planet, 1 hazardous planet, and 1 industrial planet.",
  },
  "Pahn Silverfur": {
    abilityName: "Change of Plans",
    description:
      "ACTION: Place 1 infantry from your reinforcements on each planet you control; you may choose and flip 1 policy card.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Olradin League",
    name: "Pahn Silverfur",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Roh'Dhna Mechatronics
  "Rond Briay": {
    description:
      "When 1 or more of a player's units use PRODUCTION:\n\nYou may exhaust this card to allow that player to gain 1 command token.",
    expansion: "DISCORDANT STARS",
    faction: "Roh'Dhna Mechatronics",
    name: "Rond Bri'ay",
    timing: "OTHER",
    type: "AGENT",
  },
  "B-Unit 205643a": {
    description:
      'When you spend a command token to resolve the secondary ability of the "Construction" strategy card, you may resolve the primary ability instead.',
    expansion: "DISCORDANT STARS",
    faction: "Roh'Dhna Mechatronics",
    name: "B-Unit 205643a",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Have units with a combined PRODUCTION value of at least 7 in a single system.",
  },
  "RohVhin Dhna mk4": {
    abilityName: "Subversive Automation",
    description:
      "After you move 1 or more of your ships into the active system:\n\nYou may purge this card to produce ships using the PRODUCTION abilities of any units in the active system as if they were your own, regardless of whether that system contains another player's ships.",
    expansion: "DISCORDANT STARS",
    faction: "Roh'Dhna Mechatronics",
    name: "Roh'Vhin Dhna mk4",
    timing: "OTHER",
    type: "HERO",
  },
  // Savages of Cymiae
  "Skhot Unit X-12": {
    description:
      "When a player discards or purges an action card:\n\nYou may exhaust this card to allow that player to draw 1 action card.",
    expansion: "DISCORDANT STARS",
    faction: "Savages of Cymiae",
    name: "Skhot Unit X-12",
    timing: "OTHER",
    type: "AGENT",
  },
  "Koryl Ferax": {
    description:
      "After you gain control of a planet during a tactical action: \n\nYou may discard 1 action card to place or move 1 mech onto that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Savages of Cymiae",
    name: "Koryl Ferax",
    timing: "PASSIVE",
    type: "COMMANDER",
  },
  "The Voice United": {
    abilityName: "Symphony of Agony",
    description:
      "ACTION: Draw and reveal a number of action cards from the action card deck equal to 1 more than the number of players in the game, give 1 to each other player in the game and keep the rest; each other player must discard 1 action card.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Savages of Cymiae",
    name: "The Voice United",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Shipwrights of Axis
  "Shipmonger Zsknck": {
    description:
      "ACTION: Exhaust this card to choose 1 player; that player may place 1 cruiser or 1 destroyer from their reinforcements in a system that contains their ships.\n\nThen, if you chose another player, gain 2 commodities.",
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    name: "Shipmonger Zsknck",
    timing: "COMPONENT_ACTION",
    type: "AGENT",
  },
  "Designer TckVsk": {
    description:
      "After a player resolves an Axis Order card:\n\nYou may spend 6 resources to gain the corresponding unit’s unit upgrade technology.",
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    name: "Designer TckVsk",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Have 4 Axis Order cards of different unit types in 1 or more players' play areas.",
  },
  "Demi-Queen Mdcksssk": {
    abilityName: "Galactic Field Test",
    description:
      "ACTION: Purge this card and give 1 or more Axis Order cards in your play area to 1 or more other players; for each Axis Order card you give to another player, you may force that player to give you 1 promissory note from their hand.",
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    name: "Demi-Queen Mdcksssk",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Tnelis Syndicate
  "Davish SNorri": {
    description:
      "At the start of invasion:\n\nYou may exhaust this card to choose 1 ship in the active system. During this invasion, that ship may use its ANTI-FIGHTER BARRAGE as if it were BOMBARDMENT.",
    expansion: "DISCORDANT STARS",
    faction: "Tnelis Syndicate",
    name: "Davish S'Norri",
    timing: "OTHER",
    type: "AGENT",
  },
  "Fillipo Rois": {
    description:
      "After you activate a system, you may produce and assign 1 hit to a non-fighter ship you control in a system to apply +1 to the move value of 1 of your ships in that system until the end of this tactical action.",
    expansion: "DISCORDANT STARS",
    faction: "Tnelis Syndicate",
    name: "Fillipo Rois",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 6 of your destroyers on the game board.",
  },
  "Turra Sveyar": {
    abilityName: "Friends in Low Places",
    description:
      "After another player scores a secret objective:\n\nYou may attach, or remove and attach, this card to that secret objective. You treat the attached secret objective as if it were a public objective.\n\nAfter you score the attached objective, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Tnelis Syndicate",
    name: "Turra Sveyar",
    timing: "OTHER",
    type: "HERO",
  },
  // Vaden Banking Clans
  "Yudri Sukhov": {
    description:
      "At the start of a player's turn:\n\nYou may exhaust this card to allow that player to choose 1 planet they control; that player gains a number of commodities equal to that planet's influence value.",
    expansion: "DISCORDANT STARS",
    faction: "Vaden Banking Clans",
    name: "Yudri Sukhov",
    timing: "OTHER",
    type: "AGENT",
  },
  "Komdar Borodin": {
    description:
      "At the start of the status phase:\n\nGain 1 trade good for each secret objective you have scored and 1 commodity for each public objective you have scored.",
    expansion: "DISCORDANT STARS",
    faction: "Vaden Banking Clans",
    name: "Komdar Borodin",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "Have 1 or more different players’ control tokens on your faction sheet for every 2 players in this game.",
  },
  "Putriv Sirvonsk": {
    abilityName: "Debts Come Due",
    description:
      "ACTION: For each control token that belongs to another player on your faction sheet, you may return that token. If you do, that player must give you 1 of their trade goods, 2 of their commodities, or 1 promissory note from their hand, if able.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Vaden Banking Clans",
    name: "Putriv Sirvonsk",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Vaylerian Scourge
  "Yvin Korduul": {
    description:
      "After a player gains control of a planet, you may exhaust this card to allow that player to draw 1 action card.",
    expansion: "DISCORDANT STARS",
    faction: "Vaylerian Scourge",
    name: "Yvin Korduul",
    timing: "OTHER",
    type: "AGENT",
  },
  "Pyndil Gonsuul": {
    description:
      "After you activate a system:\n\nChoose 1 ship you control with a capacity value, apply +2 to that value during this tactical action.",
    expansion: "DISCORDANT STARS",
    faction: "Vaylerian Scourge",
    name: "Pyndil Gonsuul",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Control 3 planets that each have the same trait.",
  },
  "Dyln Harthuul": {
    abilityName: "Hidden Vanguard",
    description:
      "After you activate a system:\n\nRemove 1 of your command tokens from the board and gain 1 command token. Until the end of this tactical action, apply +1 to the move value of each of your ships and the result of each of your ships' combat rolls.\n\nAt the end of this turn, purge this card. ",
    expansion: "DISCORDANT STARS",
    faction: "Vaylerian Scourge",
    name: "Dyln Harthuul",
    timing: "OTHER",
    type: "HERO",
  },
  // Veldyr Sovereignty
  "Solis Morden": {
    description:
      "When a player spends resources to research:\n\nYou may exhaust this card to allow that player to spend the influence of 1 planet they control as resources.",
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    name: "Solis Morden",
    timing: "OTHER",
    type: "AGENT",
  },
  "Vera Khage": {
    description:
      "When you research a technology that is owned by a player who controls a planet with a Branch Office attachment, you may ignore 1 prerequisite on that technology.",
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    name: "Vera Khage",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock:
      "2 other players control 1 or more planets that have Branch Office attachments.",
  },
  "Auberon Elyrin": {
    abilityName: "A New Dawn",
    description:
      "ACTION: For each planet that has a Branch Office attachment, you may gain 1 unit upgrade technology of the same unit type as 1 owned by the player that controls that planet.\n\nThen, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    name: "Auberon Elyrin",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Zealots of Rhodun
  "Priestess Tuh": {
    description:
      "After a player researches a technology:\n\nYou may exhaust this card to allow that player to produce 1 ship in their home system or a system that contains a planet they control that has a technology specialty.",
    expansion: "DISCORDANT STARS",
    faction: "Zealots of Rhodun",
    name: "Priestess Tuh",
    timing: "PASSIVE",
    type: "AGENT",
  },
  "Bishop Ulin": {
    description:
      "When researching a technology, you may use the technology specialty of 1 planet you control to ignore any 1 prerequisite on the technology card you are researching.",
    expansion: "DISCORDANT STARS",
    faction: "Zealots of Rhodun",
    name: "Bishop Ulin",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have a technology with 2 or more prerequisites.",
  },
  "Saint Binal": {
    abilityName: "Forgotten Sorcery",
    description:
      "Place this card and up to 3 non-faction technologies near the game board, you gain those technologies. At the start of the next strategy phase, purge all but 1 of those technologies and this card.",
    expansion: "DISCORDANT STARS",
    faction: "Zealots of Rhodun",
    name: "Saint Binal",
    timing: "COMPONENT_ACTION",
    type: "HERO",
  },
  // Zelian Purifier
  "Zelian A": {
    description:
      "At the start of invasion:\n\nYou may exhaust this card to allow the active player to replace 1 of their infantry in the space area of the active system with 1 mech from their reinforcements.",
    expansion: "DISCORDANT STARS",
    faction: "Zelian Purifier",
    name: "Zelian A",
    timing: "OTHER",
    type: "AGENT",
  },
  "Zelian B": {
    description:
      "Each of your Dreadnoughts and War Suns without ANTI-FIGHTER BARRAGE gains ANTI-FIGHTER BARRAGE 5.",
    expansion: "DISCORDANT STARS",
    faction: "Zelian Purifier",
    name: "Zelian B",
    timing: "PASSIVE",
    type: "COMMANDER",
    unlock: "Have 1 or more ships in 2 systems that contain an asteroid field.",
  },
  "Zelian R": {
    abilityName: "Celestial Impact",
    description:
      "After you move a unit with BOMBARDMENT into a non-home system other than Mecatol Rex:\n\nYou may gain trade goods equal to the total combined resource values of planets in that system. If you do, destroy all units on planets in that system and replace that system tile with the Zelian asteroid tile. Then, purge this card and each planet card that corresponds to the replaced system tile.",
    expansion: "DISCORDANT STARS",
    faction: "Zelian Purifier",
    name: "Zelian R",
    timing: "OTHER",
    type: "HERO",
  },
};
