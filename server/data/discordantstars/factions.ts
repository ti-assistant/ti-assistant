// TODO: Add colors for factions.
export const DISCORDANT_STARS_FACTIONS: Record<
  DiscordantStars.FactionId,
  BaseFaction
> = {
  "Augurs of Ilyxum": {
    abilities: [
      {
        name: "Oracle AI",
        description:
          "After the speaker reveals an unrevealed public objective, choose 1 unrevealed public objective card and place that card on your faction sheet. You may look at the card on your faction sheet at any time.",
      },
      {
        name: "Limited Vision",
        description:
          "You may not place a stage II objective card on your faction sheet until all stage I objectives have been revealed.",
      },
      {
        name: "Probability Algorithms",
        description:
          "When the speaker would reveal the next public objective, they must reveal the public objective card on your faction sheet instead. Place that card near the other public objectives.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Augurs of Ilyxum",
    name: "Augurs of Ilyxum",
    promissories: [
      {
        name: "Read the Fates",
        description:
          "ACTION: Place this face up in your play area.\n\nWhile this card is in your play area, you may look at the public objective card on the Ilyxum player's faction sheet.\n\nIf you activate a system that contains 1 or more of the Ilyxum player's units, return this card to the Ilyxum player.",
      },
    ],
    shortname: "Ilyxum",
    startswith: {
      planets: ["Chrion", "Demis"],
      techs: ["Scanlink Drone Network", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 2,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When this unit makes a combat roll, it rolls 1 additional die for each secret objective you have scored.",
        expansion: "DISCORDANT STARS",
        name: "Nemsys",
        stats: {
          cost: 8,
          combat: 5,
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After researching a technology, you may place 1 mech on a legendary planet, or a planet that has a technology specialty, that you control.",
        expansion: "DISCORDANT STARS",
        name: "Iledrith",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  // "Bentor Conglomerate": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Bentor Conglomerate",
  //   shortname: "Bentor",
  //   startswith: {
  //     planets: ["Benc", "Hau"],
  //     choice: {
  //       options: [
  //         "Psychoarchaeology",
  //         "Dark Energy Tap",
  //         "Scanlink Drone Network",
  //       ],
  //       select: 2,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Cruiser: 2,
  //       Fighter: 3,
  //       Infantry: 4,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  // "Berserkers of Kjalengard": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Berserkers of Kjalengard",
  //   shortname: "Kjalengard",
  //   startswith: {
  //     planets: ["Kjalengard", "Hulgade"],
  //     choice: {
  //       options: [
  //         "Cruiser II",
  //         "Destroyer II",
  //         "Dreadnought II",
  //         "Fighter II",
  //         "Infantry II",
  //         "PDS II",
  //         "Space Dock II",
  //         "War Sun",
  //       ],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 2,
  //       Destroyer: 1,
  //       Fighter: 4,
  //       Infantry: 4,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  // "Blex Pestilence": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Blex Pestilence",
  //   shortname: "Blex",
  //   startswith: {
  //     planets: ["Avicenna"],
  //     choice: {
  //       options: ["Daxcive Animators", "Bio-Stims"],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 1,
  //       Dreadnought: 1,
  //       Infantry: 3,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Celdauri Trade Confederation": {
    abilities: [
      {
        name: "Projection of Power",
        description:
          "At the start of any space combat in a system that is adjacent to or contains 1 or more of your space docks, choose up to 1 ship in that system to gain ANTI-FIGHTER BARRAGE 6 during that combat.",
      },
      {
        name: "Industrialists",
        description:
          "During setup, place 1 additional space dock in your reinforcements.",
      },
    ],
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    promissories: [
      {
        name: "Trade Alliance",
        description:
          "When you receive this card, if you are not the Celdauri player, you must place it face up in your play area.\n\nWhile this card is in your play area, you can use the Celdauri player’s commander ability, if it is unlocked.\n\nIf you activate a system that contains 1 or more of the Celdauri player’s units, return this card to the Celdauri player.",
      },
    ],
    id: "Celdauri Trade Confederation",
    name: "Celdauri Trade Confederation",
    shortname: "Celdauri",
    startswith: {
      planets: ["Louk", "Auldane"],
      choice: {
        options: ["Antimass Deflectors", "Sarween Tools", "Plasma Scoring"],
        select: 2,
      },
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 4,
        Infantry: 3,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE", "ANTI-FIGHTER BARRAGE 6 (x2)"],
        description:
          "You may use the PRODUCTION ability of other player's space docks in this system to produce ships.",
        expansion: "DISCORDANT STARS",
        name: "Supremacy",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 6,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After another player activates a system, you may spend 1 trade good or 1 commodity to place 1 mech on a planet in that system that contains 1 of your space docks.",
        expansion: "DISCORDANT STARS",
        name: "Minuteman",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["PRODUCTION X", "ANTI-FIGHTER BARRAGE 6 (x2)"],
        description:
          "This unit's PRODUCTION value is equal to 2 more than the resource or influence value of this planet.\n\nUp to 3 fighters in this system do not count against your ships' capacity.",
        expansion: "DISCORDANT STARS",
        name: "Trade Port I",
        stats: {},
        type: "Space Dock",
      },
    ],
  },
  // "Cheiran Hordes": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Cheiran Hordes",
  //   shortname: "Cheiran",
  //   startswith: {
  //     planets: ["Gghurn Theta", "Arche"],
  //     choice: {
  //       options: ["Magen Defense Grid", "Self-Assembly Routines"],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 1,
  //       Dreadnought: 1,
  //       Fighter: 2,
  //       Infantry: 2,
  //       Mech: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Dih-Mohn Flotilla": {
    abilities: [
      {
        name: "Capital Fleet",
        description:
          "Destroyers count as 1/2 of a ship against your fleet pool.",
      },
      {
        name: "Migrant Explorers",
        description:
          "After you explore a frontier token in a system, you may explore a planet you control that is adjacent to that system.",
      },
      {
        name: "Flotilla",
        description:
          "You cannot have more infantry than non-fighter ships in the space area of a system.",
      },
    ],
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    id: "Dih-Mohn Flotilla",
    name: "Dih-Mohn Flotilla",
    promissories: [
      {
        name: "Combat Drills",
        description:
          "When 1 of your ships would be destroyed:\n\nInstead of destroying that ship, place this card face up in your play area.\n\nReturn this card to the Dih-Mohn player at the start of the status phase.",
      },
    ],
    shortname: "Dih-Mohn",
    startswith: {
      planets: ["Abyssus"],
      techs: ["Dark Energy Tap", "Scanlink Drone Network"],
      units: {
        Destroyer: 2,
        Dreadnought: 2,
        Fighter: 2,
        Mech: 1,
        Infantry: 2,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After this unit moves into a system, produce up to 2 units that have a combined cost of 4 or less, regardless of other players' ships.",
        expansion: "DISCORDANT STARS",
        name: "Maximus",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of a combat in this system you may repair 1 unit you control that is participating in that combat.",
        expansion: "DISCORDANT STARS",
        name: "Repairitor",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 5"],
        description:
          "When another ship in this system would be destroyed during combat, you may have this ship become damaged instead.",
        expansion: "DISCORDANT STARS",
        name: "Aegis I",
        stats: {
          cost: 4,
          combat: 5,
          move: 1,
          capacity: 1,
        },
        type: "Dreadnought",
      },
    ],
  },
  // "Edyn Mandate": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Edyn Mandate",
  //   shortname: "Edyn",
  //   startswith: {
  //     planets: ["Edyn", "Ekko", "Okke"],
  //     techs: [
  //       "Psychoarchaeology",
  //       "Dark Energy Tap",
  //       "Scanlink Drone Network",
  //       "AI Development Algorithm",
  //     ],
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 2,
  //       Fighter: 4,
  //       Infantry: 2,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Florzen Profiteers": {
    abilities: [
      {
        name: "Mercenaries",
        description:
          "At the start of a space combat, you may remove up to 2 fighters you control in a system adjacent to the active system.\n\nThen, choose 1 player participating in that combat; that player places the same number of fighters from their reinforcements in the active system.",
      },
      {
        name: "Data Leak",
        description:
          "When you would gain a relic, you may draw 1 additional card; choose 1 to gain and return the rest to the relic deck.\n\nThen, shuffle the relic deck.",
      },
      {
        name: "Shadow Markets",
        description:
          "When you explore a planet, you may treat that planet as if it had the same trait as another planet you control.",
      },
    ],
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    id: "Florzen Profiteers",
    name: "Florzen Profiteers",
    promissories: [
      {
        name: "Underground Market",
        description:
          "When you would gain a relic:\n\nYou may draw 1 additional card; choose 1 to gain and return the rest to the relic deck. Then, shuffle the relic deck.\n\nThen, return this card to the Florzen player.",
      },
    ],
    shortname: "Florzen",
    startswith: {
      planets: ["Delmor", "Kyd"],
      techs: ["Neural Motivator", "Scanlink Drone Network"],
      units: {
        Carrier: 2,
        Fighter: 4,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Other players cannot play action cards during a space combat in this system.",
        expansion: "DISCORDANT STARS",
        name: "Man O' War",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 5,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "You may spend influence as resources to produce this unit.",
        expansion: "DISCORDANT STARS",
        name: "Privateer",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["ANTI-FIGHTER BARRAGE 9"],
        description:
          "This unit may move without being transported. Fighters in excess of your ships' capacity count against your fleet pool.",
        expansion: "DISCORDANT STARS",
        name: "Corsair I",
        stats: {
          cost: "1(x2)",
          combat: 9,
          move: 1,
        },
        type: "Fighter",
      },
    ],
  },
  "Free Systems Compact": {
    abilities: [
      {
        name: "Rally to the Cause",
        description:
          "Once per action, after you produce 1 or more ships in your home system, you may produce up to 2 ships in a system that contains a cultural, hazardous, or industrial planet and does not contain a legendary planet or other players' units.",
      },
      {
        name: "Diplomats",
        description:
          "Once per action, you may exhaust 1 uncontrolled planet's planet card that is on the game board to spend its resources or influence.",
      },
      {
        name: "Free People",
        description:
          "During setup, for each non-home planet other than Mecatol Rex on the game board, place that planet's planet card face up on the game board.",
      },
    ],
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    id: "Free Systems Compact",
    name: "Free Systems Compact",
    promissories: [
      {
        name: "Broadcast Teams",
        description:
          "When you gain control of a planet during a tactical action:\n\nIf the active system does not contain another player's ships, you may produce up to 2 ships in that system.\n\nThen, return this card to the Free Systems player.",
      },
    ],
    shortname: "Free Systems",
    startswith: {
      planets: ["Idyn", "Kroll", "Cyrra"],
      techs: ["Psychoarchaeology"],
      units: {
        Carrier: 1,
        Cruiser: 2,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When this unit makes a combat roll, it rolls 1 additional die for each planet in this system of any single trait.",
        expansion: "DISCORDANT STARS",
        name: "Vox",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After you use your RALLY TO THE CAUSE faction ability in a system, you may spend 1 trade good to place 1 mech on a planet you control adjacent to that system.",
        expansion: "DISCORDANT STARS",
        name: "Liberator",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Ghemina Raiders": {
    abilities: [
      {
        name: "The Lady & The Lord",
        description:
          "During setup, place 1 additional flagship in your reinforcements and the additional Ghemina Hero next to your faction sheet. This additional flagship has the abilities and attributes listed on the Lord flagship card. You have 2 Heroes.",
      },
      {
        name: "Rule of Two",
        description:
          "During a round of combat in a system that contains exactly 2 of your non-fighter ships, if those ships have the same unit type, apply +2 to the result of each of those unit's combat rolls.",
      },
    ],
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    id: "Ghemina Raiders",
    name: "Ghemina Raiders",
    promissories: [
      {
        name: "Raid Leaders",
        description:
          "After you activate a system:\n\nChoose 1 non-fighter ship you control; during this action, that unit gains BOMBARDMENT 5(x2) and a capacity value of 2.\n\nReturn this card to the Ghemina player at the end of this action.",
      },
    ],
    shortname: "Ghemina",
    startswith: {
      planets: ["Drah", "Trykk"],
      techs: ["Psychoarchaeology", "Dark Energy Tap"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 3,
        "Space Dock": 2,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 5 (x4)"],
        description:
          "When another player's structure in this system is destroyed, gain 2 trade goods.",
        expansion: "DISCORDANT STARS",
        name: "The Lady",
        stats: {
          cost: 6,
          combat: "7(x2)",
          move: 2,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After a player explores a planet in this system, place 1 infantry from their reinforcements on that planet.",
        expansion: "DISCORDANT STARS",
        name: "The Lord",
        stats: {
          cost: 6,
          combat: "7(x2)",
          move: 2,
          capacity: 7,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After you win a ground combat on this planet, if this planet contains exactly 1 other mech, explore this planet.",
        expansion: "DISCORDANT STARS",
        name: "Jotun",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: [],
        expansion: "DISCORDANT STARS",
        name: "Combat Transport I",
        stats: {
          cost: 3,
          combat: 9,
          move: 2,
          capacity: 4,
        },
        type: "Carrier",
      },
    ],
  },
  // "Ghoti Wayfarers": {
  //   colors: {},
  //   commodities: 4,
  //   expansion: "DISCORDANT STARS",
  //   name: "Ghoti Wayfarers",
  //   shortname: "Ghoti",
  //   startswith: {
  //     planets: ["Ghoti"],
  //     choice: {
  //       options: ["Gravity Drive", "Sling Relay"],
  //       select: 1,
  //     },
  //     units: {
  //       Cruiser: 1,
  //       Flagship: 1,
  //       Fighter: 2,
  //       Infantry: 3,
  //     },
  //   },
  // },
  // "Gledge Union": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Gledge Union",
  //   shortname: "Gledge",
  //   startswith: {
  //     planets: ["Last Stop"],
  //     choice: {
  //       options: [
  //         "Psychoarchaeology",
  //         "Scanlink Drone Network",
  //         "AI Development Algorithm",
  //       ],
  //       select: 2,
  //     },
  //     units: {
  //       Carrier: 1,
  //       Destroyer: 1,
  //       Dreadnought: 1,
  //       Fighter: 3,
  //       Infantry: 2,
  //       Mech: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Glimmer of Mortheus": {
    abilities: [
      {
        name: "Facsimile",
        description:
          "At the start of a space combat while you are the defender, you may spend influence equal to the cost value of 1 of your opponent's ships in the active system to place 1 unit of that type from your reinforcements in that system.",
      },
      {
        name: "Illusory Presence",
        description:
          "During the agenda phase, after another player casts votes, you may exhaust up to 2 planets you control; that player casts an additional number of votes equal to 1 more than the combined influence values of those planets.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Glimmer of Mortheus",
    name: "Glimmer of Mortheus",
    promissories: [
      {
        name: "Secrets of the Weave",
        description:
          "At the start of a space combat while you are the defender:\n\nYou may spend influence equal to the cost value of 1 of your opponent's ships in the active system to place 1 unit of that type from your reinforcements in that system.\n\nThen, return this card to the Mortheus player.",
      },
    ],
    shortname: "Mortheus",
    startswith: {
      planets: ["Biaheo", "Empero"],
      techs: ["Dark Energy Tap", "Sarween Tools"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After you activate this system, if it does not contain any planets, you may place 1 frontier token in this system.",
        expansion: "DISCORDANT STARS",
        name: "Particle Sieve",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When a player commits 1 or more units to a planet you control adjacent to this system, you may swap this unit with 1 of your infantry on that planet.",
        expansion: "DISCORDANT STARS",
        name: "Duuban",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Kollecc Society": {
    abilities: [
      {
        name: "Cloaked Fleets",
        description:
          "After you produce 1 or more ships, you may place up to 2 of those ships on your faction sheet, those ships are captured.",
      },
      {
        name: "Shroud of Lith",
        description:
          "After movement, if the active system contains 1 or more of your non-fighter ships, you may place up to 2 of your captured ships and 2 of your captured ground forces from your faction sheet in that system's space area.",
      },
      {
        name: "Treasure Hunters",
        description:
          "At the start of your turn, you may look at the top card of the cultural, hazardous, or industrial exploration deck. Then, look at the top card of the relic deck.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Kollecc Society",
    name: "Kollecc Society",
    promissories: [
      {
        name: "AI Survey",
        description:
          "At the start of your turn:\n\nYou may look at either the top card of the cultural, hazardous, and industrial exploration decks, or the top card of the relic deck.\n\nThen, return this card to the Kollecc player.",
      },
    ],
    shortname: "Kollecc",
    startswith: {
      planets: ["Susuros"],
      techs: ["Scanlink Drone Network"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 2,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When this unit retreats, you may capture each of your units that retreat.",
        expansion: "DISCORDANT STARS",
        name: "Nightingale V",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the end of a tactical action in this system, you may place up to 2 ground forces from this planet onto your faction sheet, those units are captured.",
        expansion: "DISCORDANT STARS",
        name: "Nightshade Vanguard",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  // "Monks of Kolume": {
  //   colors: {},
  //   commodities: 3,
  //   expansion: "DISCORDANT STARS",
  //   name: "Monks of Kolume",
  //   shortname: "Kolume",
  //   startswith: {
  //     planets: ["Alesna", "Azle"],
  //     choice: {
  //       options: ["Graviton Laser System", "Predictive Intelligence"],
  //       select: 1,
  //     },
  //     units: {
  //       Carrier: 2,
  //       Cruiser: 1,
  //       Fighter: 2,
  //       Infantry: 4,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Kortali Tribunal": {
    abilities: [
      {
        name: "Zealous",
        description:
          'When you spend a command token to resolve the secondary ability of the "Warfare" strategy card, you may resolve the primary ability instead.',
      },
      {
        name: "Ruthless",
        description:
          "At the start of a ground combat on an exhausted planet you do not control, you may produce 1 hit and assign it to 1 of your opponent's ground forces on that planet.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Kortali Tribunal",
    name: "Kortali Tribunal",
    promissories: [
      {
        name: "Blessing of the Queens",
        description:
          "ACTION: Place this card face up in your play area and remove 1 of your command tokens from the game board.\n\nAt the start of the status phase, return this card to the Kortali player.",
      },
    ],
    shortname: "Kortali",
    startswith: {
      planets: ["Ogdun", "Brthkul"],
      techs: ["Psychoarchaeology", "Plasma Scoring"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 3"],
        description:
          "After you win a space combat in this system, you may have this ship become damaged to gain 1 command token.",
        expansion: "DISCORDANT STARS",
        name: "Magistrate",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "PLANETARY SHIELD"],
        description: "This unit cannot lose its PLANETARY SHIELD.",
        expansion: "DISCORDANT STARS",
        name: "Justicar",
        stats: {
          cost: 2,
          combat: 5,
        },
        type: "Mech",
      },
    ],
  },
  // "Lanefir Remnants": {
  //   colors: {},
  //   commodities: 2,
  //   expansion: "DISCORDANT STARS",
  //   name: "Lanefir Remnants",
  //   shortname: "Lanefir",
  //   startswith: {
  //     planets: ["Aysis Rest", "Solitude"],
  //     choice: {
  //       options: [
  //         "Dark Energy Tap",
  //         "Scanlink Drone Network",
  //         "AI Development Algorithm",
  //       ],
  //       select: 2,
  //     },
  //     units: {
  //       Carrier: 2,
  //       Destroyer: 1,
  //       Fighter: 2,
  //       Infantry: 3,
  //       PDS: 1,
  //       "Space Dock": 1,
  //     },
  //   },
  // },
  "Li-Zho Dynasty": {
    abilities: [
      {
        name: "Cunning",
        description:
          'After you perform a tactical action in a system, you may attach 1 "Trap" card from your reinforcements to a planet in that system that contains 1 or more of your infantry units.',
      },
      {
        name: "Subterfuge",
        description:
          "Trap attachments are attached face-down and remain hidden until revealed; you may look at Trap attachments at any time. You do not count trap attachments toward fulfilling objectives.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Li-Zho Dynasty",
    name: "Li-Zho Dynasty",
    promissories: [
      {
        name: "Trusted Counselor",
        description:
          "At the start of a space combat you are participating in:\n\nYou may place up to 2 fighters from your reinforcements into the space area of the active system.\n\nThen, return this card to the Li-Zho player.",
      },
    ],
    shortname: "Li-Zho",
    startswith: {
      planets: ["Pax", "Vess", "Kyr"],
      techs: ["Psychoarchaeology", "Antimass Deflectors"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "This unit can only be destroyed by an uncanceled hit being assigned to it.",
        expansion: "DISCORDANT STARS",
        name: "Silence of Stars",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of your turn, you may remove 1 trap attachment from the game board and attach it to this planet, or swap any trap attachment with 1 on this planet.",
        expansion: "DISCORDANT STARS",
        name: "Oro-Zhin Elite",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["BOMBARDMENT 9"],
        expansion: "DISCORDANT STARS",
        name: "Heavy Bomber I",
        stats: {
          cost: "1(x2)",
          combat: 9,
        },
        type: "Mech",
      },
    ],
  },
  "L'tokk Khrask": {
    abilities: [
      {
        name: "Lithoids",
        description:
          "During the agenda phase, the number of votes you cast is instead equal to the combined resource value of the planets that you exhaust.",
      },
      {
        name: "Garden Worlds",
        description:
          "Apply +1 to the resource values of your planets that do not contain 1 or more ground forces.",
      },
      {
        name: "Meteor Slings",
        description:
          "When your units use BOMBARDMENT against a planet another player controls, you may cancel any number of hits you produce to place that many infantry from your reinforcements onto that planet. Those units participate in ground combat, if able.",
      },
    ],
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    id: "L'tokk Khrask",
    name: "L'tokk Khrask",
    promissories: [
      {
        name: "Stone Speakers",
        description:
          "During a tactical action, when you produce 1 or more hits during a BOMBARDMENT roll:\n\nFor each hit you produced, you may instead place 1 infantry from your reinforcements on the planet being bombarded.\n\nThen, return this card to the L'tokk Khrask player.",
      },
    ],
    shortname: "Khrask",
    startswith: {
      planets: ["Bohl-Dhur"],
      techs: ["Scanlink Drone Network", "Plasma Scoring"],
      units: {
        Cruiser: 3,
        Fighter: 1,
        Infantry: 3,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of a space combat in this system, choose up to 2 non-fighter ships to gain SUSTAIN DAMAGE until the end of combat.",
        expansion: "DISCORDANT STARS",
        name: "Splintering Gale",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Units other than your mechs do not make combat rolls during the first round of ground combat on this planet.",
        expansion: "DISCORDANT STARS",
        name: "Megalith",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["BOMBARDMENT 8"],
        expansion: "DISCORDANT STARS",
        name: "Shattered Sky I",
        stats: {
          cost: 2,
          combat: 7,
          move: 2,
          capacity: 1,
        },
        type: "Cruiser",
      },
    ],
  },
  "Mirveda Protectorate": {
    abilities: [
      {
        name: "Privileged Citizenry",
        description:
          "Each system can contain a number of your PDS equal to the number of command tokens in your fleet pool. For the purpose of scoring objectives, you may treat each of your PDS units as though it is a structure on any planet you control.",
      },
      {
        name: "Combat Drones",
        description:
          "Your space docks cannot produce infantry. At the start of invasion, you may replace each of your fighters in the active system with 1 infantry unit. During invasion, your infantry in the space area of the active system do not count against your ships' capacity.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Mirveda Protectorate",
    name: "Mirveda Protectorate",
    promissories: [
      {
        name: "Rapid Assembly",
        description:
          "At the start of your turn:\n\nYou may move up to 2 PDS units you control to a planet you control.\n\nThen, return this card to the Mirveda player.",
      },
    ],
    shortname: "Mirveda",
    startswith: {
      planets: ["Aldra", "Beata"],
      techs: ["AI Development Algorithm"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 5,
        Infantry: 2,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After each round of space combat in this system, place 1 fighter from your reinforcements in this system.",
        expansion: "DISCORDANT STARS",
        name: "Nexus",
        stats: {
          cost: 8,
          combat: "9(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "For every 2 unit upgrade technologies you own, apply +1 to the result of this unit's combat rolls.",
        expansion: "DISCORDANT STARS",
        name: "Javelin",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["SPACE CANNON 6", "BOMBARDMENT 6"],
        description:
          "This unit is placed in a space area instead of on a planet. This unit can move and retreat as if it were a ship.\n\nThis unit can be blockaded, if it is blockaded, it is destroyed.",
        expansion: "DISCORDANT STARS",
        name: "Nexus",
        stats: {
          move: 1,
        },
        type: "PDS",
      },
    ],
  },
  "Myko-Mentori": {
    abilities: [
      {
        name: "Prescient Memories",
        description:
          'You have 4 "Omen" Dice. At the start of the strategy phase, roll all 4 Omen dice and place them near your faction sheet.',
      },
      {
        name: "Divination",
        description:
          "Before you would roll a die, you may instead return 1 Omen die near your faction sheet to your reinforcements to resolve that roll as if it had the result of that die.",
      },
      {
        name: "Necrophage",
        description:
          "Apply +1 to your commodity value for each space dock you control. After the first round of combat, gain 1 commodity or convert 1 of your commodities to a trade good.",
      },
    ],
    colors: {},
    commodities: 1,
    expansion: "DISCORDANT STARS",
    id: "Myko-Mentori",
    name: "Myko-Mentori",
    promissories: [
      {
        name: "Gift of Insight",
        description:
          "ACTION: Place this card face up in your play area.\n\nWhile this card is in your play area, once per turn, after you roll a die, you may reroll that die.\n\nIf you activate a system that contains 1 or more of the Myko-Mentori player's units, return this card to the Myko-Mentori player.",
      },
    ],
    shortname: "Myko-Mentori",
    startswith: {
      planets: ["Shi-Halaum"],
      techs: ["Predictive Intelligence"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 1,
        Infantry: 6,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Once per round of space combat, when a non-fighter ship in this system is destroyed, you may gain 1 commodity.",
        expansion: "DISCORDANT STARS",
        name: "Psyclobea Qarnyx",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After this unit is destroyed, roll a die. If the result is 6 or greater, place the unit on this card. At the start of your turn, you may replace 1 infantry you control with a unit that is on this card.",
        expansion: "DISCORDANT STARS",
        name: "Amandia Pholdis",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["PLANETARY SHIELD", "PRODUCTION X"],
        description:
          "This unit's PRODUCTION value is equal to 2 more than the resource value of this planet.\n\nDEPLOY: When you gain control of a planet, you may replace 4 infantry on that planet with 1 space dock.",
        expansion: "DISCORDANT STARS",
        name: "Mycelium Ring I",
        stats: {},
        type: "Space Dock",
      },
    ],
  },
  "Nivyn Star Kings": {
    abilities: [
      {
        name: "Celestial Guides",
        description:
          "Your units do not roll for gravity rifts. You may ignore the movement effects of anomalies in systems that contain or are adjacent to 1 or more of your structures.",
      },
      {
        name: "Singularity Point",
        description:
          'The system that contains the "Wound" token is a nebula and a gravity rift.',
      },
      {
        name: "Voidsailors",
        description:
          "When you explore a frontier token, you may draw 1 additional card; choose 1 to resolve and return the rest to the frontier exploration deck. Then, shuffle that deck.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Nivyn Star Kings",
    name: "Nivyn Star Kings",
    promissories: [
      {
        name: "Nivyn Guidance",
        description:
          "After you activate a system:\n\nDuring this activation, you may ignore the effects of each anomaly.\n\nReturn this card to the Nivyn player at the end of this activation.",
      },
    ],
    shortname: "Nivyn",
    startswith: {
      planets: ["Ellas"],
      techs: ["Dark Energy Tap", "Plasma Scoring"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Dreadnought: 1,
        Fighter: 3,
        Infantry: 3,
        Mech: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When a unit in this system would be destroyed, you may remove it from the game board instead.",
        expansion: "DISCORDANT STARS",
        name: "Eradica",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After this system is activated, you may have this unit become damaged to place or move the Wound token into this system.",
        expansion: "DISCORDANT STARS",
        name: "Voidflare Warden I",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Olradin League": {
    abilities: [
      {
        name: "Policies",
        description:
          "When you gather your starting components, place the 3 “Policy” cards near your faction sheet, choose which side of each card to place face up.\n\nThis faction has the abilities and effects listed on the face up side of each Policy card.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Olradin League",
    name: "Olradin League",
    promissories: [
      {
        name: "Incite Revolution",
        description:
          "ACTION: Place this card face up in your play area to choose and exhaust 1 planet you control. Then, ready 1 non-home planet you control other than Mecatol Rex.\n\nAt the start of the status phase, return this card to the Olradin player.",
      },
    ],
    shortname: "Olradin",
    startswith: {
      planets: ["Sanctuary"],
      techs: ["Psychoarchaeology", "Scanlink Drone Network"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 3,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When you move this ship, apply +1 to the move value of each of your other ships during this tactical action.",
        expansion: "DISCORDANT STARS",
        name: "Rallypoint",
        stats: {
          cost: 8,
          combat: "9(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          'If you have at least 2 "-" policies, flip this card.\n\nIf this planet contains no more than 1 of your mechs, apply +1 to its resource value.',
        expansion: "DISCORDANT STARS",
        name: "Exemplar +",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          'If you have at least 2 "+" policies, flip this card.\n\nIf this planet contains no more than 1 of your mechs, apply +1 to its influence value.',
        expansion: "DISCORDANT STARS",
        name: "Exemplar -",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Roh'Dhna Mechatronics": {
    abilities: [
      {
        name: "Industrious",
        description:
          "After you place a space dock in a system that contains no other players' ships, you may spend 6 resources and remove that space dock to place 1 war sun in that system's space area.",
      },
      {
        name: "Recycled Materials",
        description:
          "After you activate a system, you may return 1 cruiser, carrier, or dreadnought you control in that system to your reinforcements to gain a number of trade goods equal to 1 less than that unit's cost value.",
      },
      {
        name: "Orbital Foundries",
        description:
          "For the purpose of scoring objectives, you may treat each of your war sun units as though it is a structure on any planet you control.",
      },
    ],
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    id: "Roh'Dhna Mechatronics",
    name: "Roh'Dhna Mechatronics",
    promissories: [
      {
        name: "Automatons",
        description:
          "At the end of your turn, you may attach this card to a non-home planet you control other than Mecatol Rex. This planet has PRODUCTION 3 as if it were a unit.",
      },
    ],
    shortname: "Roh'Dhna",
    startswith: {
      planets: ["Prind"],
      techs: ["Psychoarchaeology", "Sarween Tools"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After you activate a system, you may spend 4 resources to replace 1 of your non-fighter ships in that system with your flagship.",
        expansion: "DISCORDANT STARS",
        name: "Ky'vir",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After you use your RECYCLED MATERIALS faction ability in a system, you may place 1 mech in that system's space area or on a planet you control in that system.",
        expansion: "DISCORDANT STARS",
        name: "Autofabricator",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["PRODUCTION 5"],
        description:
          "This unit produces only 1 fighter or infantry for their cost instead of 2.\n\nThis unit cannot move or be produced.",
        expansion: "DISCORDANT STARS",
        name: "Terrafactory I",
        stats: {
          combat: "5(x2)",
          capacity: 3,
        },
        type: "War Sun",
      },
    ],
  },
  "Savages of Cymiae": {
    abilities: [
      {
        name: "Autonetic Memory",
        description:
          "When you would draw 1 or more action cards, you may draw 1 less card to either choose 1 card from the action card discard pile and add it to your hand, or place 1 infantry from your reinforcements on a planet you control.",
      },
      {
        name: "Cybernetic Madness",
        description:
          "After you add an action card from the discard pile to your hand using your AUTONETIC MEMORY faction ability, you must discard 1 action card. After you fully resolve an action card’s ability text, purge that card instead of discarding it.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Savages of Cymiae",
    name: "Savages of Cymiae",
    promissories: [
      {
        name: "Algorithmic Replication",
        description:
          "ACTION: Choose 1 action card from the action card discard pile and add it to your hand.\n\nThen, purge this card.",
      },
    ],
    shortname: "Cymiae",
    startswith: {
      planets: ["Cymiae"],
      techs: ["Neural Motivator", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After you win a combat in this system, you may take 1 of your opponent's action cards, at random.",
        expansion: "DISCORDANT STARS",
        name: "Reprocessor Alpha",
        stats: {
          cost: 8,
          combat: "9(x2)",
          move: 1,
          capacity: 6,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of each ground combat round, if this planet contains no more than 1 of your mechs, repair this unit.",
        expansion: "DISCORDANT STARS",
        name: "Revenant",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: [],
        expansion: "DISCORDANT STARS",
        name: "Unholy Abomination I",
        stats: {
          cost: 1,
          combat: 5,
        },
        type: "Infantry",
      },
    ],
  },
  "Shipwrights of Axis": {
    abilities: [
      {
        name: "Military Industrial Complex",
        description:
          'After you gain or replenish commodities, you may spend a number of commodities equal to the combined cost listed on any number of "Axis Order" cards in your reinforcements to place those cards in your play area. You cannot give your commodities to other players as part of a transaction.',
      },
      {
        name: "Arms Dealers",
        description:
          "When a player negotiates a transaction, they may exchange Axis Order cards in their play area as part of that transaction.\n\nYou cannot resolve the effects of Axis Order cards.",
      },
    ],
    colors: {},
    commodities: 5,
    expansion: "DISCORDANT STARS",
    id: "Shipwrights of Axis",
    name: "Shipwrights of Axis",
    promissories: [
      {
        name: "Industry Secrets",
        description:
          "When 1 or more of your units use PRODUCTION:\n\nPlace this card face up in your play area to apply +4 to the PRODUCTION value of those units and reduce the combined cost of the produced units by 1 for this use of PRODUCTION.\n\nAt the beginning of the status phase, return this card to the Axis player.",
      },
    ],
    shortname: "Axis",
    startswith: {
      planets: ["Axis"],
      techs: ["Sarween Tools", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After this ship produces 1 or more hits during a round of space combat, you may repair 1 ship you control in this system.",
        expansion: "DISCORDANT STARS",
        name: "Bearer of Heavens",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "You may treat a space dock on this planet as if it has PRODUCTION 5.",
        expansion: "DISCORDANT STARS",
        name: "Forgetender",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Tnelis Syndicate": {
    abilities: [
      {
        name: "Plausible Deniability",
        description:
          "When you draw 1 or more secret objective cards, draw 1 additional secret objective card. Then, return 1 secret objective card to the secret objective deck; shuffle that deck.",
      },
      {
        name: "Information Brokers",
        description: "You may have 1 additional unscored secret objective.",
      },
      {
        name: "Stealth Insertion",
        description:
          'If you place units onto the same planet as another player\'s units, your units must combat during the "Ground Combat" step.',
      },
    ],
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    id: "Tnelis Syndicate",
    name: "Tnelis Syndicate",
    promissories: [
      {
        name: "Plots Within Plots",
        description:
          "When you draw 1 or more secret objective cards:\n\nDraw 1 additional secret objective card. Then, return 1 secret objective card to the secret objective deck; shuffle that deck.\n\nThen, return this card to the Tnelis player.",
      },
    ],
    shortname: "Tnelis",
    startswith: {
      planets: ["Discordia"],
      choice: {
        options: ["Neural Motivator", "Antimass Deflectors", "Plasma Scoring"],
        select: 2,
      },
      units: {
        Carrier: 1,
        Destroyer: 2,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of a round of combat, choose 1 ship in this system, during this combat round, that ship rolls 1 less combat die.",
        expansion: "DISCORDANT STARS",
        name: "Principia Aneris",
        stats: {
          cost: 8,
          combat: "9(x4)",
          move: 2,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After you move a destroyer into a non-home system other than Mecatol Rex, you may spend 3 resources to place 1 mech on a planet in that system.",
        expansion: "DISCORDANT STARS",
        name: "Daedalon",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["ANTI-FIGHTER BARRAGE 9 (x3)"],
        expansion: "DISCORDANT STARS",
        name: "Blockade Runner I",
        stats: {
          cost: 1,
          combat: 9,
          move: 2,
        },
        type: "Destroyer",
      },
    ],
  },
  "Vaden Banking Clans": {
    abilities: [
      {
        name: "Fine Print",
        description:
          "After a player resolves the secondary ability of 1 of your strategy cards, place up to 1 of their control tokens on your faction sheet.",
      },
      {
        name: "Collateralized Loans",
        description:
          "After 1 of your opponent's ships is destroyed during a round of space combat, you may remove 1 of that player's control tokens from your faction sheet to place 1 ship of that type from your reinforcements in the active system.",
      },
      {
        name: "Binding Debts",
        description:
          "Other players may place their control tokens on your faction sheet at any time. At the start of the status phase, each of your neighbors may give you 1 trade good to remove up to 2 of their control tokens from your faction sheet.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Vaden Banking Clans",
    name: "Vaden Banking Clans",
    promissories: [
      {
        name: "Vaden Handshake",
        description:
          "After you activate a system:\n\nYou may spend any number of trade goods; for each trade good spent, apply +1 to the move value of 1 non-fighter ship you control during this activation.\n\nReturn this card to the Vaden player at the end of this activation.",
      },
    ],
    shortname: "Vaden",
    startswith: {
      planets: ["Vadarian", "Norvus"],
      choice: {
        options: ["Neural Motivator", "Antimass Deflectors", "Sarween Tools"],
        select: 2,
      },
      units: {
        Carrier: 1,
        Cruiser: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 5 (x2)"],
        description:
          "After this unit produces 1 or more hits during a BOMBARDMENT roll, gain 1 trade good.",
        expansion: "DISCORDANT STARS",
        name: "Aurum Vadra",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the end of a round of ground combat, you may remove 1 of your opponent's control tokens from your faction sheet to place 1 infantry unit from your reinforcements on this planet.",
        expansion: "DISCORDANT STARS",
        name: "Collector",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Vaylerian Scourge": {
    abilities: [
      {
        name: "Cargo Raiders",
        description:
          "During the first round of a space combat, you may prevent your opponent from declaring a retreat unless they spend 1 trade good.",
      },
      {
        name: "Scour",
        description:
          "Once per tactical action, after you gain control of a planet, you may discard 1 action card to ready that planet.",
      },
      {
        name: "Raze",
        description:
          "After 1 or more of another player's structures are destroyed on a planet that contains your units, you may replenish your commodities.",
      },
    ],
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    id: "Vaylerian Scourge",
    name: "Vaylerian Scourge",
    promissories: [
      {
        name: "Clan's Favor",
        description:
          "At the start of a round of space combat:\n\nThe Vaylerian player discards 1 action card. Then, move all of your ships from the active system to an adjacent system that does not contain another player's ships; the space combat ends in a draw.\n\nThen, place a command token from your reinforcements in that system and return this card to the Vaylerian player.",
      },
    ],
    shortname: "Vaylerian",
    startswith: {
      planets: ["Vaylar"],
      techs: ["Neural Motivator", "Dark Energy Tap"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 3,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of a space combat in this system, you may choose 1 adjacent system. Your opponent cannot retreat to that system.",
        expansion: "DISCORDANT STARS",
        name: "Lost Cause",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 2,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "During your tactical actions, hits produced by SPACE CANNON cannot be assigned to 1 of your ships in this system.",
        expansion: "DISCORDANT STARS",
        name: "Eclipse",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: [],
        description:
          "During a round of space combat, if your opponent cannot declare a retreat, hits produced by this ship must be assigned to non-fighter ships, if able.\n\nThis unit may only transport ground forces.",
        expansion: "DISCORDANT STARS",
        name: "Raider I",
        stats: {
          cost: 2,
          combat: 7,
          move: 2,
          capacity: 1,
        },
        type: "Cruiser",
      },
    ],
  },
  "Veldyr Sovereignty": {
    abilities: [
      {
        name: "Corporate Entity",
        description:
          'During setup, take the additional Veldyr faction promissory notes; you have 4 faction promissory notes. "Branch Office" attachments do not count toward scoring objectives.',
      },
      {
        name: "Holding Company",
        description:
          "At the start of the status phase, for each planet that has a Branch Office attachment, you may gain 1 commodity or convert 1 of your commodities to a trade good.",
      },
      {
        name: "Targeted Acquisition",
        description:
          "At the start of the status phase, you may give 1 of your faction promissory notes in your hand to 1 of your neighbors.",
      },
    ],
    colors: {},
    commodities: 4,
    expansion: "DISCORDANT STARS",
    id: "Veldyr Sovereignty",
    name: "Veldyr Sovereignty",
    promissories: [
      {
        name: "Branch Office - Tax Haven",
        description:
          "When you receive this card, you must attach it to a non-home planet you control other than Mecatol Rex that does not have a Branch Office attachment. Its influence value is increased by 1.",
      },
      {
        name: "Branch Office - Broadcast Hub",
        description:
          "When you receive this card, you must attach it to a non-home planet you control other than Mecatol Rex that does not have a Branch Office attachment. Its influence value is increased by 1.",
      },
      {
        name: "Branch Office - Reserve Bank",
        description:
          "When you receive this card, you must attach it to a non-home planet you control other than Mecatol Rex that does not have a Branch Office attachment. Its resource value is increased by 1.",
      },
      {
        name: "Branch Office - Orbital Shipyard",
        description:
          "When you receive this card, you must attach it to a non-home planet you control other than Mecatol Rex that does not have a Branch Office attachment. Its resource value is increased by 1.",
      },
    ],
    shortname: "Veldyr",
    startswith: {
      planets: ["Rhune"],
      techs: ["Dark Energy Tap", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When this ship makes a combat roll, it rolls 1 additional die for each round of combat that has been resolved this combat.",
        expansion: "DISCORDANT STARS",
        name: "Richtyrian",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After a player activates this system, you may remove this unit from the game board to place 1 PDS from your reinforcements on this planet.",
        expansion: "DISCORDANT STARS",
        name: "Aurora Stormcaller",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 5", "SPACE CANNON 8"],
        expansion: "DISCORDANT STARS",
        name: "Lancer Dreadnought I",
        stats: {
          cost: 4,
          combat: 5,
          move: 1,
          capacity: 1,
        },
        type: "Dreadnought",
      },
    ],
  },
  "Zealots of Rhodun": {
    abilities: [
      {
        name: "Conspirators",
        description:
          "Once per agenda phase, after an agenda is revealed, if you are not the speaker, you may choose to vote after the speaker on that agenda.",
      },
      {
        name: "Ancient Knowledge",
        description:
          "When you use a technology specialty to ignore a prerequisite on a technology card you are researching, you may ignore 1 additional prerequisite of the same color. After you exhaust a planet to use its technology specialty, you may gain 1 commodity.",
      },
    ],
    colors: {},
    commodities: 3,
    expansion: "DISCORDANT STARS",
    id: "Zealots of Rhodun",
    name: "Zealots of Rhodun",
    promissories: [
      {
        name: "Favor of Rhodun",
        description:
          "When you ignore a prerequisite on a technology card you are researching:\n\nYou may ignore 1 additional prerequisite of the same color.\n\nThen, return this card to the Rhodun player.",
      },
    ],
    shortname: "Rhodun",
    startswith: {
      planets: ["Poh", "Orad"],
      techs: ["Bio-Stims"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "For each unit upgrade technology your opponent owns, apply +1 to the results of this unit's combat rolls.",
        expansion: "DISCORDANT STARS",
        name: "Reckoning",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Apply +1 to this unit's combat rolls for each faction technology your opponent owns.",
        expansion: "DISCORDANT STARS",
        name: "Templar",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Zelian Purifier": {
    abilities: [
      {
        name: "Obsessive Designs",
        description:
          "During the action phase, after you research a unit upgrade technology, you may use the PRODUCTION ability of 1 of your space docks in your home system to produce units of that type, reducing the combined cost of the produced units by 2.",
      },
      {
        name: "Biophobic",
        description:
          "During the agenda phase, the number of votes you cast is instead equal to the number of planets you exhaust to cast votes.",
      },
      {
        name: "Paranoia",
        description:
          "Game effects other than your command tokens cannot prevent you from activating, or moving ships into, your home system.",
      },
    ],
    colors: {},
    commodities: 2,
    expansion: "DISCORDANT STARS",
    id: "Zelian Purifier",
    name: "Zelian Purifier",
    promissories: [
      {
        name: "Hyperkinetic Ordinance",
        description:
          "When 1 or more of your units would make a BOMBARDMENT roll:\n\nIf you produce 1 or more hits during this BOMBARDMENT roll, produce 1 additional hit for that roll.\n\nThen, return this card to the Zelian player.",
      },
    ],
    shortname: "Zelian",
    startswith: {
      planets: ["Zelian", "Gen"],
      techs: ["Antimass Deflectors", "AI Development Algorithm"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 1,
        Infantry: 5,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: [
          "SUSTAIN DAMAGE",
          "BOMBARDMENT 5",
          "ANTI-FIGHTER BARRAGE 5",
        ],
        description:
          "When this unit makes a combat or unit ability roll, it rolls 1 additional die for each asteroid field adjacent to this unit.",
        expansion: "DISCORDANT STARS",
        name: "World-Cracker",
        stats: {
          cost: 8,
          combat: 5,
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of invasion, if this unit is in the space area of the active system, you may remove this unit from the game board to destroy 1 unit on a planet in that system.",
        expansion: "DISCORDANT STARS",
        name: "Collider",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["BOMBARDMENT 9"],
        description:
          "During invasion, this unit must commit to a planet it bombards.",
        expansion: "DISCORDANT STARS",
        name: "Impactor I",
        stats: {
          cost: "1(x2)",
          combat: 8,
        },
        type: "Infantry",
      },
    ],
  },
};
