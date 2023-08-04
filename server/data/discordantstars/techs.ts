import { BaseTech } from "../../../src/util/api/techs";

export const DISCORDANT_STARS_TECHS: Record<DiscordantStars.TechId, BaseTech> =
  {
    // Augurs of Ilyxum
    Psychographics: {
      description:
        "During the status phase, you may score 1 additional public objective instead of a secret objective.",
      expansion: "DISCORDANT STARS",
      faction: "Augurs of Ilyxum",
      name: "Psychographics",
      prereqs: ["GREEN", "GREEN", "GREEN"],
      type: "GREEN",
    },
    "Sentient Datapool": {
      description:
        "At the start of the status phase, you may spend 3 trade goods to research 1 technology.",
      expansion: "DISCORDANT STARS",
      faction: "Augurs of Ilyxum",
      name: "Sentient Datapool",
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    // Bentor Conglomerate
    // "Broker Network": {
    //   description:
    //     "Each planet you control that has a technology specialty or an attachment gains the PRODUCTION 1 ability as if it were a unit.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Bentor Conglomerate",
    //   name: "Broker Network",
    //   prereqs: ["GREEN"],
    //   type: "GREEN",
    // },
    // "Merged Replicators": {
    //   description:
    //     "When 1 or more of your units use PRODUCTION, you may exhaust this card to increase the PRODUCTION value of 1 of those units to match the PRODUCTION value of the unit on the game board with the highest PRODUCTION value, or apply +2 to the total PRODUCTION value of those units.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Bentor Conglomerate",
    //   name: "Merged Replicators",
    //   prereqs: ["YELLOW", "YELLOW"],
    //   type: "YELLOW",
    // },
    // Berserkers of Kjalengard
    // "Star Dragon II": {
    //   description: "This unit may ignore the movement effects of anomalies.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Berserkers of Kjalengard",
    //   name: "Star Dragon II",
    //   prereqs: ["BLUE", "BLUE"],
    //   replaces: "Carrier II",
    //   stats: {
    //     capacity: 6,
    //     combat: 7,
    //     cost: 3,
    //     move: 2,
    //   },
    //   type: "UPGRADE",
    // },
    // "Zhrgar Stimulants": {
    //   description:
    //     "After you activate a system that contains a Glory token, you may return 3 of your captured units to gain 1 command token.\n\nAfter a player rolls combat dice, you may exhaust this card to allow that player reroll up to 3 of those dice.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Berserkers of Kjalengard",
    //   name: "Zhrgar Stimulants",
    //   prereqs: ["GREEN"],
    //   type: "GREEN",
    // },
    // Blex Pestilence
    // "Biotic Weapons": {
    //   description:
    //     "During each round of combat in systems that contain Blight tokens, 1 of your units may roll 1 additional combat die.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Blex Pestilence",
    //   name: "Biotic Weapons",
    //   prereqs: ["GREEN", "GREEN"],
    //   type: "GREEN",
    // },
    // "Vector II": {
    //   description:
    //     "This unit may move without being transported, and through systems that contain other players' ships. Each fighter in excess of your ship's capacity counts against your fleet pool.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Blex Pestilence",
    //   name: "Vector II",
    //   prereqs: ["GREEN", "BLUE"],
    //   replaces: "Fighter II",
    //   stats: {
    //     combat: 8,
    //     cost: "1 (x2)",
    //     move: 3,
    //   },
    //   type: "UPGRADE",
    // },
    // Celdauri Trade Confederation
    "Emergency Mobilization Protocols": {
      description:
        "At the end of your turn, you may exhaust this card and spend 1 token from your strategy pool to remove a command token from a system that contains 1 or more of your space docks.",
      expansion: "DISCORDANT STARS",
      faction: "Celdauri Trade Confederation",
      name: "Emergency Mobilization Protocols",
      prereqs: ["RED", "RED"],
      type: "RED",
    },
    "Trade Port II": {
      description:
        "This unit's PRODUCTION value is equal to 4 more than the resource or influence value of this planet.\n\nUp to 3 fighters in this system do not count against your ships' capacity.\n\nThis unit may use its ANTI-FIGHTER BARRAGE during each round of space combat.\n\nPRODUCTION X\n\nANTI-FIGHTER BARRAGE 6(x2)",
      expansion: "DISCORDANT STARS",
      faction: "Celdauri Trade Confederation",
      name: "Trade Port II",
      prereqs: ["YELLOW", "YELLOW"],
      replaces: "Space Dock II",
      type: "UPGRADE",
    },
    // Cheiran Hordes
    // "Chitin Hulk II": {
    //   description:
    //     "This unit cannot be destroyed by “Direct Hit” action cards.\n\nWhen this unit is destroyed, you may place 1 fighter or 1 destroyer from your reinforcements in this system's space area.\n\nSUSTAIN DAMAGE\n\nBOMBARDMENT 5",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Cheiran Hordes",
    //   name: "Chitin Hulk II",
    //   prereqs: ["BLUE", "BLUE", "YELLOW"],
    //   replaces: "Dreadnought II",
    //   stats: {
    //     capacity: 1,
    //     combat: 5,
    //     cost: 4,
    //     move: 2,
    //   },
    //   type: "UPGRADE",
    // },
    // "Brood Pod": {
    //   description:
    //     "After another player activates a system that contains 1 of your structures, you may exhaust this card to produce 1 ship in the active system.\n\nFor each of your structures in the active system, you may remove that unit from the game board to reduce the cost of the produced ship by 3.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Cheiran Hordes",
    //   name: "Brood Pod",
    //   prereqs: ["RED", "RED"],
    //   type: "RED",
    // },
    // Dih-Mohn Flotilla
    "Impressment Programs": {
      description:
        "When you explore a planet, you may produce 1 ship in that planet's system.\n\nACTION: Exhaust this card and 1 planet you control to explore that planet.",
      expansion: "DISCORDANT STARS",
      faction: "Dih-Mohn Flotilla",
      name: "Impressment Programs",
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    "Aegis II": {
      description:
        "When another ship in this system would be destroyed by a game effect, you may have this ship become damaged instead.\n\nSUSTAIN DAMAGE\n\nBOMBARDMENT 5",
      expansion: "DISCORDANT STARS",
      faction: "Dih-Mohn Flotilla",
      name: "Aegis II",
      prereqs: ["BLUE", "BLUE", "YELLOW"],
      replaces: "Dreadnought II",
      stats: {
        capacity: 1,
        combat: 4,
        cost: 4,
        move: 2,
      },
      type: "UPGRADE",
    },
    // Edyn Mandate
    // "Unity Algorithm": {
    //   description:
    //     "Once per agenda phase, after an agenda is revealed, you may predict aloud an outcome of that agenda.\n\nIf your prediction is correct, you may score 1 public objective if you fulfill its requirements; each other player who voted for that outcome draws 1 secret objective.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Edyn Mandate",
    //   name: "Unity Algorithm",
    //   prereqs: ["GREEN", "GREEN", "GREEN"],
    //   type: "GREEN",
    // },
    // "Encrypted Trade Hub": {
    //   description:
    //     "You may exhaust this card to allow a player to exchange 1 of their relics or agendas as part of a transaction.\n\nYou always vote last during the agenda phase. When an outcome you voted for or predicted is resolved, each player who voted for that outcome gains 1 commodity.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Edyn Mandate",
    //   name: "Encrypted Trade Hub",
    //   prereqs: ["YELLOW", "YELLOW"],
    //   type: "YELLOW",
    // },
    // Florzen Profiteers
    "Blackmail Programs": {
      description:
        "When a player would perform a strategic action, you may exhaust this card and spend 1 token from your strategy pool to end that player's turn; the strategic action is not resolved and the strategy card is not exhausted.",
      expansion: "DISCORDANT STARS",
      faction: "Florzen Profiteers",
      name: "Blackmail Programs",
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    },
    "Corsair II": {
      description:
        "This unit may move without being transported.\n\nFighters in excess of your ships' capacity count against your fleet pool.\n\nANTI-FIGHTER BARRAGE 8",
      expansion: "DISCORDANT STARS",
      faction: "Florzen Profiteers",
      name: "Corsair II",
      prereqs: ["GREEN", "BLUE"],
      replaces: "Fighter II",
      stats: {
        combat: 8,
        cost: "1 (x2)",
        move: 3,
      },
      type: "UPGRADE",
    },
    // Free Systems Compact
    "Envoy Network": {
      description:
        "At the start of the agenda phase, you may choose and exhaust 1 cultural, 1 hazardous, and 1 industrial planet.\n\nWhen you cast 1 or more votes, if you exhaust at least 1 cultural, 1 hazardous, and 1 industrial planet to cast votes, you may cast 4 additional votes.",
      expansion: "DISCORDANT STARS",
      faction: "Free Systems Compact",
      name: "Envoy Network",
      prereqs: ["GREEN"],
      type: "GREEN",
    },
    "Covert Strike Teams": {
      description:
        "At the start of a ground combat, you may roll 1 die for each of up to 2 of your ground forces on that planet.\n\nFor each result equal to or greater than that unit's combat value, produce 1 hit; your opponent must assign it to 1 of their units on that planet.",
      expansion: "DISCORDANT STARS",
      faction: "Free Systems Compact",
      name: "Covert Strike Teams",
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    // Ghemina Raiders
    "War Song Implants": {
      description:
        "After you win a space combat, you may ready 1 planet you control.",
      expansion: "DISCORDANT STARS",
      faction: "Ghemina Raiders",
      name: "War Song Implants",
      prereqs: ["GREEN", "GREEN", "GREEN"],
      type: "GREEN",
    },
    "Combat Transport II": {
      description:
        "You may reroll 1 of your unit's combat dice during each round of ground combat on a planet in this system that contains 2 or fewer of your infantry.",
      expansion: "DISCORDANT STARS",
      faction: "Ghemina Raiders",
      name: "Combat Transport II",
      prereqs: ["BLUE", "BLUE"],
      replaces: "Carrier II",
      stats: {
        capacity: 6,
        combat: 9,
        cost: 3,
        move: 2,
      },
      type: "UPGRADE",
    },
    // Ghoti Wayfarers
    // "Networked Command": {
    //   description:
    //     "Up to 3 ships in your home system do not count against your fleet pool.\n\nWhen you cast 1 or more votes, you may exhaust this card to cast an additional number of votes equal to the number of command tokens in your fleet pool.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Ghoti Wayfarers",
    //   name: "Networked Command",
    //   prereqs: ["GREEN"],
    //   type: "GREEN",
    // },
    // "Parallel Production": {
    //   description:
    //     "When you produce 1 or more units, you may produce 1 additional unit in a system that contains 1 or more of your ships and 1 of your command tokens.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Ghoti Wayfarers",
    //   name: "Parallel Production",
    //   prereqs: ["YELLOW"],
    //   type: "YELLOW",
    // },
    // Gledge Union
    // "Orion Platform II": {
    //   description:
    //     "When this unit produces 1 or more hits against another player's units, explore this planet.\n\nYou may use this unit's SPACE CANNON against ships that are adjacent to this unit's system.\n\nPLANETARY SHIELD\n\nSPACE CANNON 5",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Gledge Union",
    //   name: "Orion Platform II",
    //   prereqs: ["RED", "YELLOW"],
    //   replaces: "PDS II",
    //   type: "UPGRADE",
    // },
    // "Lightning Drives": {
    //   description:
    //     "During movement, you may increase the move value of each of your units not transporting fighters or infantry by 1.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Gledge Union",
    //   name: "Lightning Drives",
    //   prereqs: ["BLUE", "BLUE", "BLUE"],
    //   type: "BLUE",
    // },
    // Glimmer of Mortheus
    "Fractal Plating": {
      description:
        "After a unit you control in a system is destroyed, you may exhaust this card to place 1 unit of that type from your reinforcements in the space area of a system adjacent to that system that contains 1 or more of your ships.",
      expansion: "DISCORDANT STARS",
      faction: "Glimmer of Mortheus",
      name: "Fractal Plating",
      prereqs: ["RED", "RED"],
      type: "RED",
    },
    "Fabrication Grid": {
      description:
        "Each system that contains 1 or more of your ships and no planets gains PRODUCTION 2 as if it were a unit you control.",
      expansion: "DISCORDANT STARS",
      faction: "Glimmer of Mortheus",
      name: "Fabrication Grid",
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    // Kollecc Society
    "Seeker Drones": {
      description:
        "ACTION: Exhaust this card to choose 1 of your neighbors that has 1 or more relic fragments. That player gains 2 trade goods and must give you 1 of those relic fragments of your choice.",
      expansion: "DISCORDANT STARS",
      faction: "Kollecc Society",
      name: "Seeker Drones",
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    "Shrouded Skirmishers": {
      description:
        "At the start of a space combat, you may choose 1 of your ships in the active system that did not begin this action in that system; roll a die. On a result equal to or greater than that ship's combat value, produce 1 hit; your opponent must assign it to 1 of their ships.",
      expansion: "DISCORDANT STARS",
      faction: "Kollecc Society",
      name: "Shrouded Skirmishers",
      prereqs: ["BLUE"],
      type: "BLUE",
    },
    // Monks of Kolume
    // "Applied Biothermics": {
    //   description:
    //     "When you pass, you may gain 1 trade good for each other player who has passed.\n\nACTION: Exhaust this card.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Monks of Kolume",
    //   name: "Applied Biothermics",
    //   prereqs: ["GREEN", "GREEN"],
    //   type: "GREEN",
    // },
    // "Omniscience Field": {
    //   description:
    //     "After a system is activated, you may exhaust this card to choose 1 player. Apply +1 or -1 to all rolls that player makes during this tactical action.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Monks of Kolume",
    //   name: "Omniscience Field",
    //   prereqs: ["RED", "RED", "RED"],
    //   type: "RED",
    // },
    // Kortali Tribunal
    "Tempest Drive": {
      description:
        "After you win a combat in a system, you may exhaust this card to remove 1 command token from that system.",
      expansion: "DISCORDANT STARS",
      faction: "Kortali Tribunal",
      name: "Tempest Drive",
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    },
    "Deliverance Engine": {
      description:
        "Once per space combat, after 1 of your non-fighter ships is destroyed, you may produce 1 hit and assign it to 1 of your opponent's non-carrier ships.",
      expansion: "DISCORDANT STARS",
      faction: "Kortali Tribunal",
      name: "Deliverance Engine",
      prereqs: ["RED", "RED"],
      type: "RED",
    },
    // Lanefir Remnants
    // "Spark Thrusters": {
    //   description:
    //     "ACTION: Spend 1 command token from your strategy pool or purge 1 relic fragment to move 1 of your ships to an adjacent system that contains no other player’s ships. If you spent a command token, exhaust this card.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Lanefir Remnants",
    //   name: "Spark Thrusters",
    //   prereqs: ["BLUE", "BLUE"],
    //   type: "BLUE",
    // },
    // "ATS Armaments": {
    //   description:
    //     "After you explore, or purge 1 or more relic fragments, place 1 commodity token on this card.\n\nAt the start of a round of combat, remove any number of tokens from this card to reroll up to that many of your dice during this round of combat.",
    //   expansion: "DISCORDANT STARS",
    //   faction: "Lanefir Remnants",
    //   name: "ATS Armaments",
    //   prereqs: ["RED", "RED"],
    //   type: "RED",
    // },
    // Li-Zho Dynasty
    "Heavy Bomber II": {
      description:
        "This unit may move without being transported. Fighters in excess of your ships' capacity count against your fleet pool.\n\nBOMBARDMENT 8",
      expansion: "DISCORDANT STARS",
      faction: "Li-Zho Dynasty",
      name: "Heavy Bomber II",
      prereqs: ["BLUE", "GREEN"],
      replaces: "Fighter II",
      stats: {
        cost: "1 (x2)",
        combat: 8,
        move: 2,
      },
      type: "UPGRADE",
    },
    "Wraith Engine": {
      description:
        "After you activate a non-home system, you may exhaust this card to choose 1 ship you control; you may treat that ship as adjacent to the active system until the end of this tactical action.",
      expansion: "DISCORDANT STARS",
      faction: "Li-Zho Dynasty",
      name: "Wraith Engine",
      prereqs: ["BLUE", "BLUE"],
      type: "BLUE",
    },
    // Myko-Mentori
    "Mycelium Ring II": {
      description:
        "This unit's PRODUCTION value is equal to 5 more than the resource value of this planet.\n\nDEPLOY: When you gain control of a planet, you may replace 3 infantry on that planet with 1 space dock.\n\nPLANETARY SHIELD\n\nPRODUCTION X",
      expansion: "DISCORDANT STARS",
      faction: "Myko-Mentori",
      name: "Mycelium Ring II",
      prereqs: ["YELLOW", "YELLOW"],
      replaces: "Space Dock II",
      type: "UPGRADE",
    },
    "Psychoactive Armaments": {
      description:
        "After your opponent makes a combat roll, you may exhaust this card. If you do, for each of their units that did not produce a hit, you may reroll that unit's combat roll; any hits that roll produces are produced against your opponent's units instead.",
      expansion: "DISCORDANT STARS",
      faction: "Myko-Mentori",
      name: "Psychoactive Armaments",
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    },
    // Nivyn Star Kings
    "Voidwake Missiles": {
      description:
        "After 1 or more of your units with SUSTAIN DAMAGE makes a combat roll, you may choose 1 of those units to become damaged to reroll its combat roll.",
      expansion: "DISCORDANT STARS",
      faction: "Nivyn Star Kings",
      name: "Voidwake Missiles",
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    "Voidflare Warden II": {
      description:
        "After a system is activated, you may have this unit become damaged to place or move the Wound token into this system.\n\nSUSTAIN DAMAGE",
      expansion: "DISCORDANT STARS",
      faction: "Nivyn Star Kings",
      name: "Voidflare Warden II",
      prereqs: ["BLUE", "YELLOW", "RED"],
      stats: {
        cost: 2,
        combat: 4,
      },
      type: "UPGRADE",
    },
    // Olradin League
    "False Flag Operations": {
      description:
        "At the start of your turn, you may exhaust this card and 1 planet you control to ready 1 non-home planet other than Mecatol Rex.",
      expansion: "DISCORDANT STARS",
      faction: "Olradin League",
      name: "False Flag Operations",
      prereqs: ["RED"],
      type: "RED",
    },
    "Geosympathic Impeller": {
      description:
        "After you activate a system, you may exhaust a planet you control of the same type as a planet in that system to apply +1 to the move value of each of your ships during this tactical action.",
      expansion: "DISCORDANT STARS",
      faction: "Olradin League",
      name: "Geosympathetic Impeller",
      prereqs: ["BLUE"],
      type: "BLUE",
    },
    // Roh'Dhna Mechatronics
    "Contractual Obligations": {
      description:
        "At the start of the agenda phase, for each unit upgrade technology you control, you may choose 1 player. Each of those players must produce 1 ship in a system that contains 1 or more of their space docks or war suns.",
      expansion: "DISCORDANT STARS",
      faction: "Roh'Dhna Mechatronics",
      name: "Contractual Obligations",
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    "Terrafactory II": {
      description:
        "Other player’s units in this system lose PLANETARY SHIELD.\n\nThis unit produces only 1 fighter or infantry for their cost instead of 2.\n\nSUSTAIN DAMAGE\nPRODUCTION 5\nBOMBARDMENT 3(x3)",
      expansion: "DISCORDANT STARS",
      faction: "Roh'Dhna Mechatronics",
      name: "Terrafactory II",
      prereqs: ["YELLOW", "RED", "RED", "RED"],
      replaces: "War Sun",
      stats: {
        cost: 12,
        combat: "3 (x3)",
        move: 2,
        capacity: 6,
      },
      type: "UPGRADE",
    },
    // Savages of Cymiae
    "Unholy Abomination II": {
      description:
        "After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your turn, place each unit that is on this card on a planet you control, if able.",
      expansion: "DISCORDANT STARS",
      faction: "Savages of Cymiae",
      name: "Unholy Abomination II",
      prereqs: ["GREEN", "GREEN"],
      replaces: "Infantry II",
      stats: {
        combat: 4,
        cost: 1,
      },
      type: "UPGRADE",
    },
    "Recursive Worm": {
      description:
        "At the start of your turn, you may exhaust this card to choose 1 non-home system other than Mecatol Rex that contains 1 or more of your units; place 1 other player's command token from their reinforcements in that system.",
      expansion: "DISCORDANT STARS",
      faction: "Savages of Cymiae",
      name: "Recursive Worm",
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    // L'tokk Khrask
    "Stone's Embrace": {
      description:
        "When you would spend a token from your strategy pool, you may exhaust 1 planet you control to spend 1 token from your reinforcements instead.",
      expansion: "DISCORDANT STARS",
      faction: "L'tokk Khrask",
      name: "Stone's Embrace",
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    },
    "Shattered Sky II": {
      description: "BOMBARDMENT 6",
      expansion: "DISCORDANT STARS",
      faction: "L'tokk Khrask",
      name: "Shattered Sky II",
      prereqs: ["GREEN", "YELLOW", "RED"],
      replaces: "Cruiser II",
      stats: {
        cost: 2,
        combat: 6,
        move: 3,
        capacity: 2,
      },
      type: "UPGRADE",
    },
    // Mirveda Protectorate
    "Gauss Cannon II": {
      description:
        "This unit is placed in a space area instead of on a planet. This unit can move and retreat as if it were a ship.\n\nThis unit can be blockaded, if it is blockaded, it is destroyed.\n\nSPACE CANNON 4\n\nBOMBARDMENT 4",
      expansion: "DISCORDANT STARS",
      faction: "Mirveda Protectorate",
      name: "Gauss Cannon II",
      prereqs: ["RED", "YELLOW"],
      replaces: "PDS II",
      stats: {
        capacity: 1,
        move: 2,
      },
      type: "UPGRADE",
    },
    "Orbital Defense Grid": {
      description:
        "At the start of invasion, choose up to 1 unit you control in the active system; that unit gains PLANETARY SHIELD.\n\nWhen a player commits a unit to land on a planet you control, you may exhaust this card to destroy that unit.",
      expansion: "DISCORDANT STARS",
      faction: "Mirveda Protectorate",
      name: "Orbital Defense Grid",
      prereqs: ["RED", "RED"],
      type: "RED",
    },
    // Shipwrights of Axis
    "Emergency Deployment": {
      description:
        "ACTION: Exhaust this card to place or move 1 of your space docks onto a planet you control.",
      expansion: "DISCORDANT STARS",
      faction: "Shipwrights of Axis",
      name: "Emergency Deployment",
      prereqs: ["YELLOW", "YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    "Rift Engines": {
      description:
        "After you activate a system, you may exhaust this card to choose 1 ship you control and roll a die. On a result of 1-3, remove that ship from the game board; on a result of 4-10, apply +2 to that ship's move value during this tactical action.",
      expansion: "DISCORDANT STARS",
      faction: "Shipwrights of Axis",
      name: "Rift Engines",
      prereqs: ["BLUE"],
      type: "BLUE",
    },
    // Tnelis Syndicate
    "Blockade Runner II": {
      description:
        "This ship can move through systems that contain other players' ships.\n\nANTI-FIGHTER BARRAGE 6(x4)",
      expansion: "DISCORDANT STARS",
      faction: "Tnelis Syndicate",
      name: "Blockade Runner II",
      prereqs: ["RED", "RED"],
      replaces: "Destroyer II",
      stats: {
        cost: 1,
        combat: 8,
        move: 2,
      },
      type: "UPGRADE",
    },
    "Daedalon Flight System": {
      description:
        "After a round of space combat in a system that contains 1 or more of your mechs, you may have 1 of those units become damaged to produce 1 hit and assign it to a cruiser, dreadnought, or destroyer you do not control in that system.",
      expansion: "DISCORDANT STARS",
      faction: "Tnelis Syndicate",
      name: "Daedalon Flight System",
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    // Vaden Banking Clans
    "Midas Turbine": {
      description:
        "After you activate a system, you may exhaust this card and spend any number of trade goods; for each trade good you spent, apply +1 to the move value of 1 non-fighter ship you control.",
      expansion: "DISCORDANT STARS",
      faction: "Vaden Banking Clans",
      name: "Midas Turbine",
      prereqs: ["BLUE"],
      type: "BLUE",
    },
    "Krovoz Strike Teams": {
      description:
        "After another player's unit uses SUSTAIN DAMAGE to cancel a hit produced by your units or abilities, you may exhaust this card to destroy that unit.\n\nAfter you produce 1 or more hits during a round of combat, you may spend 1 trade good to produce 1 additional hit.",
      expansion: "DISCORDANT STARS",
      faction: "Vaden Banking Clans",
      name: "Krovoz Strike Teams",
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    // Vaylerian Scourge
    "Scavenger Exos": {
      description:
        "Once per action, after you win a ground combat, you may draw 1 action card.",
      expansion: "DISCORDANT STARS",
      faction: "Vaylerian Scourge",
      name: "Scavenger Exos",
      prereqs: ["RED"],
      type: "RED",
    },
    "Raider II": {
      description:
        "During a round of space combat, if your opponent cannot declare a retreat, hits produced by this ship cannot be canceled and must be assigned to non-fighter ships, if able.",
      expansion: "DISCORDANT STARS",
      faction: "Vaylerian Scourge",
      name: "Raider II",
      prereqs: ["GREEN", "YELLOW", "RED"],
      replaces: "Cruiser II",
      stats: {
        cost: 2,
        combat: 6,
        move: 3,
        capacity: 1,
      },
      type: "UPGRADE",
    },
    // Veldyr Sovereignty
    "Lancer Dreadnought II": {
      description:
        'This unit cannot be destroyed by "Direct Hit" action cards.\n\nSUSTAIN DAMAGE\nBOMBARDMENT 5\nSPACE CANNON 5',
      expansion: "DISCORDANT STARS",
      faction: "Veldyr Sovereignty",
      name: "Lancer Dreadnought II",
      prereqs: ["BLUE", "BLUE", "YELLOW"],
      replaces: "Dreadnought II",
      stats: {
        cost: 4,
        combat: 5,
        move: 2,
        capacity: 1,
      },
      type: "UPGRADE",
    },
    "SEIDR Project": {
      description:
        "At the end of each round of space combat, you may use the SPACE CANNON of 1 of your units in the active system against your opponent's ships, without rolling additional dice.",
      expansion: "DISCORDANT STARS",
      faction: "Veldyr Sovereignty",
      name: "SEIDR Project",
      prereqs: ["RED", "RED"],
      type: "RED",
    },
    // Zealots of Rhodun
    "Sanctification Field": {
      description:
        "When you activate a system, or a system that contains 1 or more of your units is activated, you may choose 1 technology or non-fighter, non-structure unit upgrade technology another player controls; until the end of this tactical action, that card is treated as though it had no ability text.",
      expansion: "DISCORDANT STARS",
      faction: "Zealots of Rhodun",
      name: "Sanctification Field",
      prereqs: ["YELLOW", "YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    "Pilgrimage Beacons": {
      description:
        "Once during your turn, when you exhaust 1 or more planets you control that have a technology specialty, you may produce 1 ship in 1 system that contains 1 of those planets.",
      expansion: "DISCORDANT STARS",
      faction: "Zealots of Rhodun",
      name: "Pilgrimage Beacons",
      prereqs: ["BLUE", "BLUE"],
      type: "BLUE",
    },
    // Zelian Purifier
    "Shard Volley": {
      description:
        "When 1 or more of your units produce 1 or more hits during a BOMBARDMENT roll against a planet, produce 1 additional hit for that roll.",
      expansion: "DISCORDANT STARS",
      faction: "Zelian Purifier",
      name: "Shard Volley",
      prereqs: ["RED"],
      type: "RED",
    },
    "Impactor II": {
      description:
        "After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.\n\nBOMBARDMENT 8",
      expansion: "DISCORDANT STARS",
      faction: "Zelian Purifier",
      name: "Impactor II",
      prereqs: ["GREEN", "GREEN"],
      replaces: "Infantry II",
      stats: {
        cost: "1 (x2)",
        combat: 7,
      },
      type: "UPGRADE",
    },
  };
