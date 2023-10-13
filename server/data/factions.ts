import { DISCORDANT_STARS_FACTIONS } from "./discordantstars/factions";

export const BASE_FACTIONS: Record<FactionId, BaseFaction> = {
  Arborec: {
    abilities: [
      {
        name: "Mitosis",
        description:
          "Your space docks cannot produce infantry. At the start of the status phase, place 1 infantry from your reinforcements on any planet you control.",
      },
    ],
    colors: {
      Black: 0.1,
      Blue: 0.1,
      Green: 1.6,
      Yellow: 0.1,
    },
    commodities: 3,
    expansion: "BASE",
    id: "Arborec",
    name: "Arborec",
    promissories: [
      {
        name: "Stymie",
        description:
          "ACTION: Place this card face up in your play area.\n\nWhile this card is in your play area, the Arborec player cannot produce units in or adjacent to non-home systems that contain 1 or more of your units.\n\nIf you activate a system that contains 1 or more of the Arborec player's units, return this card to the Arborec player.",
        omega: {
          name: "Stymie Ω",
          description:
            "After another player moves ships into a system that contains 1 or more of your units:\n\nYou may place 1 command token from that player's reinforcements in any non-home system.\n\nThen, return this card to the Arborec player.",
          expansion: "CODEX ONE",
        },
      },
    ],
    shortname: "Arborec",
    startswith: {
      planets: ["Nestphar"],
      techs: ["Magen Defense Grid"],
      units: {
        Carrier: 1,
        Cruiser: 1,
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
          "After you activate this system, you may produce up to 5 units in this system.",
        expansion: "BASE",
        name: "Duha Menaimon",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 5,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "PRODUCTION 2", "PLANETARY SHIELD"],
        description:
          "DEPLOY: When you would use your MITOSIS faction ability you may replace 1 of your infantry with 1 mech from your reinforcements instead.",
        expansion: "POK",
        name: "Letani Behemoth",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["PRODUCTION 1"],
        expansion: "BASE",
        name: "Letani Warrior I",
        stats: {
          cost: "1(x2)",
          combat: 8,
        },
        type: "Infantry",
        upgrade: "Letani Warrior II",
      },
    ],
  },
  "Argent Flight": {
    abilities: [
      {
        name: "Zeal",
        description:
          "You always vote first during the agenda phase. When you cast at least 1 vote, cast 1 additional vote for each player in the game including you.",
      },
      {
        name: "Raid Formation",
        description:
          "When 1 or more of your units uses ANTI-FIGHTER BARRAGE, for each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has SUSTAIN DAMAGE to become damaged.",
      },
    ],
    colors: {
      Blue: 0.15,
      Green: 0.15,
      Orange: 1.6,
    },
    commodities: 3,
    expansion: "POK",
    id: "Argent Flight",
    name: "Argent Flight",
    promissories: [
      {
        name: "Strike Wing Ambuscade",
        description:
          "When 1 or more of your units make a roll for a unit ability:\n\nChoose 1 of those units to roll 1 additional die\n\nThen, return this card to the Argent player",
      },
    ],
    shortname: "Argent",
    startswith: {
      choice: {
        options: ["Neural Motivator", "Plasma Scoring", "Sarween Tools"],
        select: 2,
      },
      planets: ["Avar", "Valk", "Ylir"],
      units: {
        Carrier: 1,
        Destroyer: 2,
        Fighter: 2,
        Infantry: 5,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Other players cannot use SPACE CANNON against your ships in this system.",
        expansion: "POK",
        name: "Quetzecoatl",
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
          "This unit does not count against capacity if it is being transported or if it is in a space area with 1 or more of your ships that have capacity values.",
        expansion: "POK",
        name: "Aerie Sentinel",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["ANTI-FIGHTER BARRAGE 9 (x2)"],
        expansion: "POK",
        name: "Strike Wing Alpha I",
        stats: {
          cost: 1,
          combat: 8,
          move: 2,
          capacity: 1,
        },
        type: "Destroyer",
        upgrade: "Strike Wing Alpha II",
      },
    ],
  },
  "Barony of Letnev": {
    abilities: [
      {
        name: "Munitions Reserve",
        description:
          "At the start of each round of space combat, you may spend 2 trade goods;  you may re-roll any number of your dice during that combat round.",
      },
      {
        name: "Armada",
        description:
          "The maximum number of non-fighter ships you can have in each system is equal to 2 more than the number of tokens in your fleet pool.",
      },
    ],
    colors: {
      Black: 0.8,
      Blue: 0.1,
      Red: 0.95,
    },
    commodities: 2,
    expansion: "BASE",
    id: "Barony of Letnev",
    name: "Barony of Letnev",
    promissories: [
      {
        name: "War Funding",

        description:
          "At the start of a round of space combat:\n\nThe Letnev player loses 2 trade goods.\n\nDuring this combat round, re-roll any number of your dice.\n\nThen, return this card to the Letnev player.",
        omega: {
          name: "War Funding Ω",
          description:
            "After you and your opponent roll dice during space combat:\n\nYou may reroll all of your opponent's dice. You may reroll any number of your dice.\n\nThen, return this card to the Letnev player.",
          expansion: "CODEX ONE",
        },
      },
    ],
    shortname: "Letnev",
    startswith: {
      planets: ["Arc Prime", "Wren Terra"],
      techs: ["Antimass Deflectors", "Plasma Scoring"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Dreadnought: 1,
        Fighter: 1,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 5 (x3)"],
        description:
          "Other players' units in this system lose PLANETARY SHIELD.  At the start of each space combat round, repair this ship.",
        expansion: "BASE",
        name: "Arc Secundus",
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
          "DEPLOY: At the start of a round of ground combat, you may spend 2 resources to replace 1 of your infantry in that combat with 1 mech.",
        expansion: "POK",
        name: "Dunlain Reaper",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Clan of Saar": {
    abilities: [
      {
        name: "Scavenge",
        description: "After you gain control of a planet, gain 1 trade good.",
      },
      {
        name: "Nomadic",
        description:
          "You can score objectives even if you do not control the planets in your home system.",
      },
    ],
    colors: {
      Green: 0.5,
      Orange: 0.85,
      Yellow: 0.4,
    },
    commodities: 3,
    expansion: "BASE",
    id: "Clan of Saar",
    name: "Clan of Saar",
    promissories: [
      {
        name: "Ragh's Call",
        description:
          "After you commit 1 or more units to land on a planet:\n\nRemove all of the Saar player's ground forces from that planet and place them on a planet controlled by the Saar player.\n\nThen return this card to the Saar player.",
      },
    ],
    shortname: "Saar",
    startswith: {
      planets: ["Lisis II", "Ragh"],
      techs: ["Antimass Deflectors"],
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
        abilities: ["SUSTAIN DAMAGE", "ANTI-FIGHTER BARRAGE 6 (x4)"],
        expansion: "BASE",
        name: "Son of Ragh",
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
          "DEPLOY: After you gain control of a planet, you may spend 1 trade good to place 1 mech on that planet.",
        expansion: "POK",
        name: "Scavenger Zeta",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["PRODUCTION 5"],
        description:
          "This unit is placed in a space area instead of on a planet.  This unit can move and retreat as if it were a ship.  If this unit is blockaded, it is destroyed.",
        expansion: "BASE",
        name: "Floating Factory I",
        stats: {
          move: 1,
          capacity: 4,
        },
        type: "Space Dock",
        upgrade: "Floating Factory II",
      },
    ],
  },
  "Council Keleres": {
    abilities: [
      {
        name: "The Tribunii",
        description:
          "During setup, choose an unplayed faction from among the Mentak, the Xxcha and the Argent Flight; take that faction's home system, command tokens and control markers. Additionally, take the Keleres Hero that corresponds to that faction.",
      },
      {
        name: "Council Patronage",
        description:
          "Replenish your commodities at the start of the strategy phase, then gain 1 trade good.",
      },
      {
        name: "Law's Order",
        description:
          "You may spend 1 influence at the start of your turn to treat all laws as blank until the end of your turn.",
      },
    ],
    colors: {
      Blue: 0.5,
      Orange: 0.35,
      Purple: 0.7,
      Yellow: 0.35,
    },
    commodities: 2,
    expansion: "CODEX THREE",
    id: "Council Keleres",
    name: "Council Keleres",
    promissories: [
      {
        name: "Keleres Rider",
        description:
          "After an agenda is revealed:\n\nYou cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, draw 1 action card and gain 2 trade goods.\n\nThen, return this card to the Keleres player.",
      },
    ],
    shortname: "Keleres",
    startswith: {
      choice: {
        options: [],
        select: 2,
      },
      planetchoice: {
        options: ["Argent Flight", "Mentak Coalition", "Xxcha Kingdom"],
      },
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 2,
        Infantry: 2,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Other players must spend 2 influence to activate the system that contains this ship.",
        expansion: "CODEX THREE",
        name: "Artemiris",
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
          "Other players must spend 1 influence to commit ground forces to the planet that contains this unit.",
        expansion: "CODEX THREE",
        name: "Omniopiares",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Embers of Muaat": {
    abilities: [
      {
        name: "Star Forge",
        description:
          "ACTION: Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns.",
      },
      {
        name: "Gashlai Physiology",
        description: "Your ships can move through supernovas.",
      },
    ],
    colors: {
      Orange: 0.65,
      Red: 1.25,
    },
    commodities: 4,
    expansion: "BASE",
    id: "Embers of Muaat",
    name: "Embers of Muaat",
    promissories: [
      {
        name: "Fires of the Gashlai",
        description:
          "ACTION: Remove 1 token from the Muaat player's fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card.\n\nThen, return this card to the Muaat player.",
      },
    ],
    shortname: "Muaat",
    startswith: {
      planets: ["Muaat"],
      techs: ["Plasma Scoring"],
      units: {
        Fighter: 2,
        Infantry: 4,
        "Space Dock": 1,
        "War Sun": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "ACTION: Spend 1 token from your strategy pool to place 1 cruiser in this unit's system.",
        expansion: "BASE",
        name: "The Inferno",
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
          "When you use your STAR FORGE faction ability in this system or an adjacent system, you may place 1 infantry from your reinforcements with this unit.",
        expansion: "POK",
        name: "Ember Colossus",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 3 (x3)"],
        description:
          "Other players' units in this system lose PLANETARY SHIELD.",
        expansion: "BASE",
        name: "Prototype War Sun I",
        stats: {
          cost: 12,
          combat: "3(x3)",
          move: 1,
          capacity: 6,
        },
        type: "War Sun",
        upgrade: "Prototype War Sun II",
      },
    ],
  },
  "Emirates of Hacan": {
    abilities: [
      {
        name: "Masters of Trade",
        description:
          'You do not have to spend a command token to resolve the secondary ability of the "Trade" strategy card.',
      },
      {
        name: "Guild Ships",
        description:
          "You can negotiate transactions with players who are not your neighbor.",
      },
      {
        name: "Arbiters",
        description:
          "When you are negotiating a transaction, action cards can be exchanged as part of that transaction.",
      },
    ],
    colors: {
      Orange: 0.7,
      Yellow: 1.2,
    },
    commodities: 6,
    expansion: "BASE",
    id: "Emirates of Hacan",
    name: "Emirates of Hacan",
    promissories: [
      {
        name: "Trade Convoys",
        description:
          "ACTION: Place this card face-up in your play area.\n\nWhile this card is in your play area, you may negotiate transactions with players who are not your neighbor.\n\nIf you activate a system that contains 1 or more of the Hacan player's units, return this card to the Hacan player.",
      },
    ],
    shortname: "Hacan",
    startswith: {
      planets: ["Arretze", "Hercant", "Kamdorn"],
      techs: ["Antimass Deflectors", "Sarween Tools"],
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
          "After you roll a die during a space combat in this system, you may spend 1 trade good to apply +1 to the result.",
        expansion: "BASE",
        name: "Wrath of Kenara",
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
          "This planet's card may be traded as part of a transaction; if you do, move all of your units from this planet to another planet you control.",
        expansion: "POK",
        name: "Pride of Kenara",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  Empyrean: {
    abilities: [
      {
        name: "Voidborn",
        description: "Nebulae do not affect your ships' movement.",
      },
      {
        name: "Aetherpassage",
        description:
          "After a player activates a system, you may allow that player to move their ships through systems that contain your ships.",
      },
      {
        name: "Dark Whispers",
        description:
          "During setup, take the additional Empyrean faction promissory note; you have 2 faction promissory notes.",
      },
    ],
    colors: {
      Magenta: 0.15,
      Purple: 1.6,
      Red: 0.15,
    },
    commodities: 4,
    expansion: "POK",
    id: "Empyrean",
    name: "Empyrean",
    promissories: [
      {
        name: "Blood Pact",
        description:
          "ACTION: Place this card face up in your play area.\n\nWhen you and the Empyrean player cast votes for the same outcome, cast 4 additional votes for that outcome.\n\nIf you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
      },
      {
        name: "Dark Pact",
        description:
          "ACTION: Place this card face up in your play area.\n\nWhen you give a number of commodities to the Empyrean player equal to your maximum commodity value, you each gain 1 trade good.\n\nIf you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
      },
    ],
    shortname: "Empyrean",
    startswith: {
      planets: ["The Dark"],
      techs: ["Dark Energy Tap"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 2,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After any player's unit in this system or an adjacent system uses SUSTAIN DAMAGE, you may spend 2 influence to repair that unit.",
        expansion: "POK",
        name: "Dynamo",
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
          "You may remove this unit from a system that contains or is adjacent to another player's units to cancel an action card played by that player.",
        expansion: "POK",
        name: "Watcher",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Federation of Sol": {
    abilities: [
      {
        name: "Orbital Drop",
        description:
          "ACTION: Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control.",
      },
      {
        name: "Versatile",
        description:
          "When you gain command tokens during the status phase, gain 1 additional command token.",
      },
    ],
    colors: {
      Blue: 1.15,
      Yellow: 0.75,
    },
    commodities: 4,
    expansion: "BASE",
    id: "Federation of Sol",
    name: "Federation of Sol",
    promissories: [
      {
        name: "Military Support",
        description:
          "At the start of the Sol player's turn:\n\nRemove 1 token from the Sol player's strategy pool, if able, and return it to their reinforcements.  Then, you may place 2 infantry from your reinforcements on any planet you control.\n\nThen return this card to the Sol player.",
      },
    ],
    shortname: "Sol",
    startswith: {
      planets: ["Jord"],
      techs: ["Antimass Deflectors", "Neural Motivator"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 3,
        Infantry: 5,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the end of the status phase, place 1 infantry from your reinforcements in this system's space area.",
        expansion: "BASE",
        name: "Genesis",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 12,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After you use your ORBITAL DROP faction ability, you may spend 3 resources to place 1 mech on that planet.",
        expansion: "POK",
        name: "ZS Thunderbolt M2",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: [],
        name: "Spec Ops I",
        expansion: "BASE",
        stats: {
          cost: "1(x2)",
          combat: 7,
        },
        type: "Infantry",
        upgrade: "Spec Ops II",
      },
      {
        abilities: [],
        name: "Advanced Carrier I",
        expansion: "BASE",
        stats: {
          cost: 3,
          combat: 9,
          move: 1,
          capacity: 6,
        },
        type: "Carrier",
        upgrade: "Advanced Carrier II",
      },
    ],
  },
  "Ghosts of Creuss": {
    abilities: [
      {
        name: "Quantum Entanglement",
        description:
          "You treat all systems that contain either an alpha or beta wormhole as adjacent to each other. Game effects cannot prevent you from using this ability.",
      },
      {
        name: "Slipstream",
        description:
          "During your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system  or in a system that contains either an alpha or beta wormhole.",
      },
      {
        name: "Creuss Gate",
        description:
          "When you create the game board, place the Creuss Gate (tile 17) where your home system would normally be placed. The Creuss Gate system is not a home system. Then, place your home system (tile 51) in your play area.",
      },
    ],
    colors: {
      Black: 0.1,
      Blue: 1.7,
      Purple: 0.1,
    },
    commodities: 4,
    expansion: "BASE",
    id: "Ghosts of Creuss",
    name: "Ghosts of Creuss",
    promissories: [
      {
        name: "Creuss Iff",
        description:
          "At the start of your turn during the action phase:\n\nPlace or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships.\n\nThen, return this card to the Creuss player.",
      },
    ],
    shortname: "Creuss",
    startswith: {
      planets: ["Creuss"],
      techs: ["Gravity Drive"],
      units: {
        Carrier: 1,
        Destroyer: 2,
        Fighter: 2,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "This ship's system contains a delta wormhole. During movement, this ship may move before or after your other ships.",
        expansion: "BASE",
        name: "Hil Colish",
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
          "After any player activates a system, you may remove this unit from the game board to place or move a Creuss wormhole token into this system.",
        expansion: "POK",
        name: "Icarus Drive",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "L1Z1X Mindnet": {
    abilities: [
      {
        name: "Assimilate",
        description:
          "When you gain control of a planet, replace each PDS and space dock that is on that planet with a matching unit from your reinforcements.",
      },
      {
        name: "Harrow",
        description:
          "At the end of each round of ground combat, your ships in the active system may use their BOMBARDMENT abilities against your opponent's ground forces on the planet.",
      },
    ],
    colors: {
      Black: 0.7,
      Blue: 0.6,
      Red: 0.6,
    },
    commodities: 2,
    expansion: "BASE",
    id: "L1Z1X Mindnet",
    name: "L1Z1X Mindnet",
    promissories: [
      {
        name: "Cybernetic Enhancements",
        description:
          "At the start of your turn:\n\nRemove 1 token from the L1Z1X player's strategy pool and return it to their reinforcements. Then, place 1 command token from your reinforcements in your strategy pool.\n\nThen, return this card to the L1Z1X player.",
        omega: {
          name: "Cybernetic Enhancements Ω",
          description:
            "When you gain command tokens during the status phase:\n\nGain 1 additional command token.\n\nThen, return this card to the L1Z1X player.",
          expansion: "CODEX ONE",
        },
      },
    ],
    shortname: "L1Z1X",
    startswith: {
      planets: ["000"],
      techs: ["Neural Motivator", "Plasma Scoring"],
      units: {
        Carrier: 1,
        Dreadnought: 1,
        Fighter: 3,
        Infantry: 5,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "During a space combat, hits produced by this ship and by your dreadnoughts in this system must be assigned to non-fighter ships if able.",
        expansion: "BASE",
        name: "[0.0.1]",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 1,
          capacity: 5,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 8"],
        description:
          "While not participating in ground combat, this unit can use its BOMBARDMENT ability on planets in its system as if it were a ship.",
        expansion: "POK",
        name: "Annihilator",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 5"],
        expansion: "BASE",
        name: "Super-Dreadnought I",
        stats: {
          cost: 4,
          combat: 5,
          move: 1,
          capacity: 2,
        },
        type: "Dreadnought",
        upgrade: "Super-Dreadnought II",
      },
    ],
  },
  "Mahact Gene-Sorcerers": {
    abilities: [
      {
        name: "Edict",
        description:
          "When you win a combat, place 1 command token from your opponent's reinforcements in your fleet pool if it does not already contain 1 of that player's tokens; other player's tokens in your fleet pool increase your fleet limit but cannot be redistributed.",
      },
      {
        name: "Imperia",
        description:
          "While another player's command token is in your fleet pool, you can use the ability of that player's commander, if it is unlocked.",
      },
      {
        name: "Hubris",
        description:
          'During setup, purge your "Alliance" promissory note. Other players cannot give you their "Alliance" promissory note.',
      },
    ],
    colors: {
      Purple: 0.3,
      Yellow: 1.6,
    },
    commodities: 3,
    expansion: "POK",
    id: "Mahact Gene-Sorcerers",
    name: "Mahact Gene-Sorcerers",
    promissories: [
      {
        name: "Scepter of Dominion",
        description:
          "At the start of the strategy phase:\n\nChoose 1 non-home system that contains your units; each other player who has a token on the Mahact player's command sheet places a token from their reinforcements in that system\n\nThen, return this card to the Mahact player.",
      },
    ],
    shortname: "Mahact",
    startswith: {
      planets: ["Ixth"],
      techs: ["Bio-Stims", "Predictive Intelligence"],
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
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "During combat against an opponent whose command token is not in your fleet pool, apply +2 to the results of this unit's combat rolls.",
        expansion: "POK",
        name: "Arvicon Rex",
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
          "After a player whose command token is in your fleet pool activates this system, you may spend their token from your fleet pool to end their turn; they gain that token.",
        expansion: "POK",
        name: "Starlancer",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        description:
          "After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good.",
        name: "Crimson Legionnaire I",
        expansion: "POK",
        stats: {
          cost: "1(x2)",
          combat: 8,
        },
        type: "Infantry",
        upgrade: "Crimson Legionnaire I",
      },
    ],
  },
  "Mentak Coalition": {
    abilities: [
      {
        name: "Ambush",
        description:
          "At the start of a space combat, you may roll 1 die for each of up to 2 of your cruisers or destroyers in the system.  For each result equal to or greater than that ship's combat value, produce 1 hit; your opponent must assign it to 1 of their ships.",
      },
      {
        name: "Pillage",
        description:
          "After 1 of your neighbors gains trade goods or resolves a transaction, if they have 3 or more trade goods, you may take 1 of their trade goods or commodities.",
      },
    ],
    colors: {
      Black: 0.5,
      Orange: 0.95,
      Yellow: 0.45,
    },
    commodities: 2,
    expansion: "BASE",
    id: "Mentak Coalition",
    name: "Mentak Coalition",
    promissories: [
      {
        name: "Promise of Protection",
        description:
          "ACTION: Place this card face-up in your play area.\n\nWhile this card is in your play area, the Mentak player cannot use their PILLAGE faction ability against you.\n\nIf you activate a system that contains 1 or more of the Mentak player's units, return this card to the Mentak player.",
      },
    ],
    shortname: "Mentak",
    startswith: {
      planets: ["Moll Primus"],
      techs: ["Plasma Scoring", "Sarween Tools"],
      units: {
        Carrier: 1,
        Cruiser: 2,
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
          "Other players' ships in this system cannot use SUSTAIN DAMAGE.",
        expansion: "BASE",
        name: "Fourth Moon",
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
          "Other players' ground forces on this planet cannot use SUSTAIN DAMAGE.",
        expansion: "POK",
        name: "Moll Terminus",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Naalu Collective": {
    abilities: [
      {
        name: "Telepathic",
        description:
          'At the end of the strategy phase, place the Naalu "0" token on your strategy card; you are first in initiative order.',
      },
      {
        name: "Foresight",
        description:
          "After another player moves ships into a system that contains 1 or more of your ships, you may place 1 token from your strategy pool in an adjacent system that does not contain another player's ships;  move your ships from the active system into that system.",
      },
    ],
    colors: {
      Green: 1.15,
      Orange: 0.3,
      Yellow: 0.45,
    },
    commodities: 3,
    expansion: "BASE",
    id: "Naalu Collective",
    name: "Naalu Collective",
    promissories: [
      {
        name: "Gift of Prescience",
        description:
          'At the end of the strategy phase:\n\nPlace this card face-up in your play area and place the Naalu "0" token on your strategy card;  you are first in the initiative order.  The Naalu player cannot use their TELEPATHIC faction ability during this game round.\n\nReturn this card to the Naalu player at the end of the status phase.',
      },
    ],
    shortname: "Naalu",
    startswith: {
      planets: ["Druaa", "Maaluuk"],
      techs: ["Neural Motivator", "Sarween Tools"],
      units: {
        Carrier: 1,
        Cruiser: 1,
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
          "During an invasion in this system, you may commit fighters to planets as if they were ground forces. When combat ends, return those units to the space area.",
        expansion: "BASE",
        name: "Matriarch",
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
          "During combat against an opponent who has at least 1 relic fragment, apply +2 to the results of this unit's combat rolls.",
        expansion: "POK",
        name: "Iconoclast",
        omega: {
          name: "Iconoclast Ω",
          description:
            "Other players cannot use ANTI-FIGHTER BARRAGE against your units in this system.",
          expansion: "CODEX THREE",
        },
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        name: "Hybrid Crystal Fighter I",
        expansion: "BASE",
        stats: {
          cost: "1(x2)",
          combat: 8,
        },
        type: "Fighter",
        upgrade: "Hybrid Crystal Fighter II",
      },
    ],
  },
  "Naaz-Rokha Alliance": {
    abilities: [
      {
        name: "Distant Suns",
        description:
          "When you explore a planet that contains 1 of your mechs, you may draw 1 additional card; choose 1 to resolve and discard the rest.",
      },
      {
        name: "Fabrication",
        description:
          "ACTION: Either purge 2 of your relic fragments of the same type to gain 1 relic; or purge 1 of your relic fragments to gain 1 command token.",
      },
    ],
    colors: {
      Green: 1.6,
      Yellow: 0.3,
    },
    commodities: 3,
    expansion: "POK",
    id: "Naaz-Rokha Alliance",
    name: "Naaz-Rokha Alliance",
    promissories: [
      {
        name: "Black Market Forgery",
        description:
          "ACTION: Purge 2 of your relic fragments of the same type to gain 1 relic.\n\nThen return this card to the Naaz-Rokha player.",
      },
    ],
    shortname: "Naaz-Rokha",
    startswith: {
      planets: ["Naazir", "Rokha"],
      techs: ["AI Development Algorithm", "Psychoarchaeology"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 2,
        Infantry: 3,
        Mech: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Your mechs in this system roll 1 additional die during combat.",
        expansion: "POK",
        name: "Visz el Vir",
        stats: {
          cost: 8,
          combat: "9(x2)",
          move: 1,
          capacity: 4,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "If this unit is in the space area of the active system at the start of a space combat, flip this card.\n\n(This card begins the game with this side face up)",
        expansion: "POK",
        name: "Eidolon",
        stats: {
          cost: 2,
          combat: "6(x2)",
        },
        type: "Mech",
      },
      {
        description:
          "If this unit is in the space area of the active system, it is also a ship. At the end of a space battle in the active system, flip this card.\n\n(This card begins the game with this side face down)",
        expansion: "POK",
        name: "Z-Grav Eidolon",
        stats: {
          cost: 2,
          combat: "8(x2)",
        },
        type: "Mech",
      },
    ],
  },
  "Nekro Virus": {
    abilities: [
      {
        name: "Galactic Threat",
        description:
          "You cannot vote on agendas.  Once per agenda phase, after an agenda is revealed, you may predict aloud the outcome of that agenda.  If your prediction is correct, gain 1 technology that is owned by a player who voted how you predicted.",
      },
      {
        name: "Technological Singularity",
        description:
          "Once per combat, after 1 of your opponent's units is destroyed, you may gain 1 technology that is owned by that player.",
      },
      {
        name: "Propagation",
        description:
          "You cannot research technology.  When you would research a technology, gain 3 command tokens instead.",
      },
    ],
    colors: {
      Black: 0.15,
      Red: 1.75,
    },
    commodities: 3,
    expansion: "BASE",
    id: "Nekro Virus",
    name: "Nekro Virus",
    promissories: [
      {
        name: "Antivirus",
        description:
          "At the start of a combat:\n\nPlace this card face-up in your play area.\n\nWhile this card is in your play area, the Nekro player cannot use their TECHNOLOGICAL SINGULARITY faction ability against you.\n\nIf you activate a system that contains 1 or more of the Nekro player's units, return this card to the Nekro player.",
      },
    ],
    shortname: "Nekro",
    startswith: {
      planets: ["Mordai II"],
      techs: ["Dacxive Animators"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Dreadnought: 1,
        Fighter: 2,
        Infantry: 2,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "At the start of a space combat, choose any number of your ground forces in this system to participate in that combat as if they were ships.",
        expansion: "BASE",
        name: "The Alastor",
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
          'During combat against an opponent who has an "X" or "Y" token on 1 or more of their technologies, apply +2 to the result of each of this unit\'s combat rolls.',
        expansion: "POK",
        name: "Mordred",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  Nomad: {
    abilities: [
      {
        name: "The Company",
        description:
          "During setup, take the 2 additional Nomad faction agents and place them next to your faction sheet; you have 3 agents.",
      },
      {
        name: "Future Sight",
        description:
          "During the Agenda phase, after an outcome that you voted for or predicted is resolved, gain 1 trade good.",
      },
    ],
    colors: {
      Blue: 1.25,
      Purple: 0.65,
    },
    commodities: 4,
    expansion: "POK",
    id: "Nomad",
    name: "Nomad",
    promissories: [
      {
        name: "The Cavalry",
        description:
          "At the start of a space combat against a player other than the Nomad:\n\nDuring this combat, treat 1 of your non-fighter ships as if it has the SUSTAIN DAMAGE ability, combat value, and ANTI-FIGHTER BARRAGE value of the Nomad's flagship.\n\nReturn this card to the Nomad player at the end of this combat.",
      },
    ],
    shortname: "Nomad",
    startswith: {
      planets: ["Arcturus"],
      techs: ["Sling Relay"],
      units: {
        Carrier: 1,
        Destroyer: 1,
        Fighter: 3,
        Flagship: 1,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "You may treat this unit as if it were adjacent to systems that contain one or more of your mechs.",
        expansion: "POK",
        name: "Memoria",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
        upgrade: "Memoria II",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "While this unit is in a space area during combat, you may use its SUSTAIN DAMAGE ability to cancel a hit that is produced against your ships in this system.",
        expansion: "POK",
        name: "Quantum Manipulator",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Sardakk N'orr": {
    abilities: [
      {
        name: "Unrelenting",
        description:
          "Apply +1 to the result of each of your unit's combat rolls.",
      },
    ],
    colors: {
      Black: 1,
      Red: 0.9,
    },
    commodities: 3,
    expansion: "BASE",
    id: "Sardakk N'orr",
    name: "Sardakk N'orr",
    promissories: [
      {
        name: "Tekklar Legion",
        description:
          "At the start of an invasion combat:\n\nApply +1 to the result of each of your unit's combat rolls during this combat.  If your opponent is the N'orr player, apply -1 to the result of each of his unit's combat rolls during this combat.\n\nThen, return this card to the N'orr player.",
      },
    ],
    shortname: "N'orr",
    startswith: {
      planets: ["Quinarra", "Tren'lak"],
      techs: [],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Infantry: 5,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Apply +1 to the result of each of your other ship's combat rolls in this system.",
        expansion: "BASE",
        name: "C'Morran N'orr",
        stats: {
          cost: 8,
          combat: "6(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After this unit uses its SUSTAIN DAMAGE ability during ground combat, it produces 1 hit against your opponent's ground forces on this planet.",
        expansion: "POK",
        name: "Valkyrie Exoskeleton",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 4 (x2)"],
        expansion: "BASE",
        name: "Exotrireme I",
        stats: {
          cost: 4,
          combat: 5,
          move: 1,
          capacity: 1,
        },
        type: "Dreadnought",
        upgrade: "Exotrireme II",
      },
    ],
  },
  "Titans of Ul": {
    abilities: [
      {
        name: "Terragenesis",
        description:
          "After you explore a planet that does not have a sleeper token, you may place or move 1 sleeper token onto that planet.",
      },
      {
        name: "Awaken",
        description:
          "After you activate a system that contains 1 or more of your sleeper tokens, you may replace each of those tokens with 1 PDS from your reinforcements.",
      },
      {
        name: "Coalescence",
        description:
          'If your flagship or your AWAKEN faction ability places your units into the same space area or onto the same planet as another player\'s units, your units must participate in combat during "Space Combat" or "Ground Combat" steps.',
      },
    ],
    colors: {
      Magenta: 1.9,
    },
    commodities: 2,
    expansion: "POK",
    id: "Titans of Ul",
    name: "Titans of Ul",
    promissories: [
      {
        name: "Terraform",
        description:
          "ACTION: Attach this card to a non-home planet you control other than Mecatol Rex.\n\nIts resource and influence values are each increased by 1 and it is treated as having all 3 planet traits (Cultural, Hazardous, and Industrial).",
      },
    ],
    shortname: "Titans",
    startswith: {
      planets: ["Elysium"],
      techs: ["Antimass Deflectors", "Scanlink Drone Network"],
      units: {
        Cruiser: 2,
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
          "DEPLOY: After you activate a system that contains 1 or more of your PDS, you may replace 1 of those PDS with this unit.",
        expansion: "POK",
        name: "Ouranos",
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
          "DEPLOY: When you would place a PDS on a planet, you may place 1 mech and 1 infantry on that planet instead.",
        expansion: "POK",
        name: "Hecatoncheires",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        expansion: "POK",
        name: "Saturn Engine I",
        stats: {
          cost: 2,
          combat: 7,
          move: 2,
          capacity: 1,
        },
        type: "Cruiser",
        upgrade: "Saturn Engine II",
      },
      {
        abilities: [
          "PLANETARY SHIELD",
          "SUSTAIN DAMAGE",
          "SPACE CANNON 6",
          "PRODUCTION 1",
        ],
        description:
          "This unit is treated as both a structure and a ground force. It cannot be transported.",
        expansion: "POK",
        name: "Hel Titan I",
        stats: {
          combat: 7,
        },
        type: "PDS",
        upgrade: "Hel Titan II",
      },
    ],
  },
  "Universities of Jol-Nar": {
    abilities: [
      {
        name: "Fragile",
        description:
          "Apply -1 to the result of each of your unit's combat rolls.",
      },
      {
        name: "Brilliant",
        description:
          'When you spend a command token to resolve the secondary ability of the "Technology" strategy card, you may resolve the primary ability instead.',
      },
      {
        name: "Analytical",
        description:
          "When you research a technology that is not a unit upgrade technology, you may ignore 1 prerequisite.",
      },
    ],
    colors: {
      Blue: 1.6,
      Purple: 0.3,
    },
    commodities: 4,
    expansion: "BASE",
    id: "Universities of Jol-Nar",
    name: "Universities of Jol-Nar",
    promissories: [
      {
        name: "Research Agreement",
        description:
          "After the Jol-Nar player researches a technology that is not a faction technology:\n\nGain that technology.\n\nThen, return this card to the Jol-Nar player.",
      },
    ],
    shortname: "Jol-Nar",
    startswith: {
      planets: ["Jol", "Nar"],
      techs: [
        "Antimass Deflectors",
        "Neural Motivator",
        "Plasma Scoring",
        "Sarween Tools",
      ],
      units: {
        Carrier: 2,
        Dreadnought: 1,
        Fighter: 1,
        Infantry: 2,
        PDS: 2,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When making a combat roll for this ship, each result of 9 or 10, before applying modifiers, produces 2 additional hits.",
        expansion: "BASE",
        name: "J.N.S. Hylarim",
        stats: {
          cost: 8,
          combat: "6(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "Your infantry on this planet are not affected by your FRAGILE faction ability.",
        expansion: "POK",
        name: "Shield Paling",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Vuil'raith Cabal": {
    abilities: [
      {
        name: "Devour",
        description:
          "Capture your opponent's non-structure units that are destroyed during combat.",
      },
      {
        name: "Amalgamation",
        description:
          "When you produce a unit, you may return 1 captured unit of that type to produce that unit without spending resources.",
      },
      {
        name: "Riftmeld",
        description:
          "When you research a unit upgrade technology, you may return 1 captured unit of that type to ignore all of the technology's prerequisites.",
      },
    ],
    colors: {
      Black: 0.4,
      Magenta: 0.1,
      Red: 1.35,
    },
    commodities: 2,
    expansion: "POK",
    id: "Vuil'raith Cabal",
    name: "Vuil'raith Cabal",
    promissories: [
      {
        name: "Crucible",
        description:
          "After you activate a system:\n\nYour ships do not roll for gravity rifts during this movement; apply an additional +1 to the move values of your ships that would move out of or through a gravity rift instead.\n\nThen, return this card to the Vuil'raith player.",
      },
    ],
    shortname: "Vuil'raith",
    startswith: {
      planets: ["Acheron"],
      techs: ["Self Assembly Routines"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Dreadnought: 1,
        Fighter: 3,
        Infantry: 3,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE", "BOMBARDMENT 5"],
        description:
          "Capture all other non-structure units that are destroyed in this system, including your own.",
        expansion: "POK",
        name: "The Terror Between",
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
          "When your infantry on this planet are destroyed, place them on your faction sheet; those units are captured.",
        expansion: "POK",
        name: "Reanimator",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
      {
        abilities: ["PRODUCTION 5"],
        description:
          "This system is a gravity rift; your ships do not roll for this gravity rift.\n\nPlace a dimensional tear token beneath this unit as a reminder.\n\nUp to 6 fighters in this system do not count against your ships' capacity.",
        expansion: "POK",
        name: "Dimensional Tear I",
        stats: {},
        type: "Space Dock",
        upgrade: "Dimensional Tear II",
      },
    ],
  },
  Winnu: {
    abilities: [
      {
        name: "Blood Ties",
        description:
          "You do not have to spend influence to remove the custodians token from Mecatol Rex.",
      },
      {
        name: "Reclamation",
        description:
          "After you resolve a tactical action during which you gained control of Mecatol Rex, you may place 1 PDS and 1 space dock from your reinforcements on Mecatol Rex.",
      },
    ],
    colors: {
      Orange: 0.75,
      Purple: 0.6,
      Yellow: 0.55,
    },
    commodities: 3,
    expansion: "BASE",
    id: "Winnu",
    name: "Winnu",
    promissories: [
      {
        name: "Acquiescence",
        description:
          "At the end of the strategy phase:\n\nExchange 1 of your strategy cards with a strategy card that was chosen by the Winnu player.\n\nThen, return this card to the Winnu player.",
        omega: {
          name: "Acquiescence Ω",
          description:
            "When the Winnu player resolves a strategic action:\n\nYou do not have to spend or place a command token to resolve the secondary ability of that strategy card.\n\nThen, return this card to the Winnu player.",
          expansion: "CODEX ONE",
        },
      },
    ],
    shortname: "Winnu",
    startswith: {
      choice: {
        options: [
          "AI Development Algorithm",
          "Antimass Deflectors",
          "Dark Energy Tap",
          "Neural Motivator",
          "Plasma Scoring",
          "Psychoarchaeology",
          "Sarween Tools",
          "Scanlink Drone Network",
        ],
        select: 1,
      },
      planets: ["Winnu"],
      units: {
        Carrier: 1,
        Cruiser: 1,
        Fighter: 2,
        Infantry: 2,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When this unit makes a combat roll, it rolls a number of dice equal to the number of your opponent's non-fighter ships in this system.",
        expansion: "BASE",
        name: "Salai Sai Corian",
        stats: {
          cost: 8,
          combat: 7,
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "After you resolve a tactical action where you gained control of this planet, you may place 1 PDS or 1 Space Dock from your reinforcements on this planet.",
        expansion: "POK",
        name: "Reclaimer",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Xxcha Kingdom": {
    abilities: [
      {
        name: "Peace Accords",
        description:
          'After you resolve the primary or secondary ability of the "Diplomacy" strategy card, you may gain control of 1 planet other than Mecatol Rex that does not contain any units and is in a system that is adjacent to a planet you control.',
      },
      {
        name: "Quash",
        description:
          "When an agenda is revealed, you may spend 1 token from your strategy pool to discard that agenda and reveal 1 agenda from the top of the deck.  Players vote on this agenda instead.",
      },
    ],
    colors: {
      Blue: 0.8,
      Green: 1.1,
    },
    commodities: 4,
    expansion: "BASE",
    id: "Xxcha Kingdom",
    name: "Xxcha Kingdom",
    promissories: [
      {
        name: "Political Favor",
        description:
          "When an agenda is revealed:\n\nRemove 1 token from the Xxcha player's strategy pool and return it to their reinforcements.  Then, discard the revealed agenda and reveal 1 agenda from the top of the deck.  Players vote on this agenda instead.\n\nThen, return this card to the Xxcha player.",
      },
    ],
    shortname: "Xxcha",
    startswith: {
      planets: ["Archon Ren", "Archon Tau"],
      techs: ["Graviton Laser System"],
      units: {
        Carrier: 1,
        Cruiser: 2,
        Fighter: 3,
        Infantry: 4,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE", "SPACE CANNON 5 (x3)"],
        description:
          "You may use this unit's SPACE CANNON against ships that are in adjacent systems.",
        expansion: "BASE",
        name: "Loncara Ssodu",
        stats: {
          cost: 8,
          combat: "7(x2)",
          move: 1,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE", "SPACE CANNON 8"],
        description:
          "You may use this unit's SPACE CANNON ability against ships that are in adjacent systems.",
        expansion: "POK",
        name: "Indomitus",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Yin Brotherhood": {
    abilities: [
      {
        name: "Indoctrination",
        description:
          "At the start of a ground combat, you may spend 2 influence to replace 1 of your opponent's participating infantry with 1 infantry from your reinforcements.",
      },
      {
        name: "Devotion",
        description:
          "After each space battle round, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent's ships in that system.",
      },
    ],
    colors: {
      Black: 0.6,
      Purple: 1.05,
      Yellow: 0.25,
    },
    commodities: 2,
    expansion: "BASE",
    id: "Yin Brotherhood",
    name: "Yin Brotherhood",
    promissories: [
      {
        name: "Greyfire Mutagen",
        description:
          "After a system is activated:\n\nThe Yin player cannot use faction abilities or faction technology during this tactical action.\n\nThen, return this card to the Yin player.",
        omega: {
          name: "Greyfire Mutagen Ω",
          description:
            "At the start of a ground combat against 2 or more ground forces that are not controlled by the Yin player:\n\nReplace 1 of your opponent's infantry with 1 infantry from your reinforcements.\n\nThen, return this card to the Yin player.",
          expansion: "CODEX ONE",
        },
      },
    ],
    shortname: "Yin",
    startswith: {
      planets: ["Darien"],
      techs: ["Sarween Tools"],
      units: {
        Carrier: 2,
        Destroyer: 1,
        Fighter: 4,
        Infantry: 4,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "When this ship is destroyed, destroy all ships in this system.",
        expansion: "BASE",
        name: "Van Hauge",
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
          "DEPLOY: When you use your INDOCTRINATION faction ability, you may spend 1 additional influence to replace your opponent's unit with 1 mech instead of 1 infantry.",
        expansion: "POK",
        name: "Moyin's Ashes",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  "Yssaril Tribes": {
    abilities: [
      {
        name: "Stall Tactics",
        description: "ACTION: Discard 1 action card from your hand.",
      },
      {
        name: "Scheming",
        description:
          "When you draw 1 or more action cards, draw 1 additional action card.  Then, choose and discard 1 action card from your hand.",
      },
      {
        name: "Crafty",
        description:
          "You can have any number of action cards in your hand.  Game effects cannot prevent you from using this ability.",
      },
    ],
    colors: {
      Black: 0.1,
      Green: 0.93,
      Red: 0.25,
      Yellow: 0.63,
    },
    commodities: 3,
    expansion: "BASE",
    id: "Yssaril Tribes",
    name: "Yssaril Tribes",
    promissories: [
      {
        name: "Spy Net",
        description:
          "At the start of your turn:\n\nLook at the Yssaril player's hand of action cards.  Choose 1 of those cards and add it to your hand.\n\nThen, return this card to the Yssaril player.",
      },
    ],
    shortname: "Yssaril",
    startswith: {
      planets: ["Retillion", "Shalloq"],
      techs: ["Neural Motivator"],
      units: {
        Carrier: 2,
        Cruiser: 1,
        Fighter: 2,
        Infantry: 5,
        PDS: 1,
        "Space Dock": 1,
      },
    },
    units: [
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "This ship can move through systems that contain other player's ships.",
        expansion: "BASE",
        name: "Y'sia Y'ssrila",
        stats: {
          cost: 8,
          combat: "5(x2)",
          move: 2,
          capacity: 3,
        },
        type: "Flagship",
      },
      {
        abilities: ["SUSTAIN DAMAGE"],
        description:
          "DEPLOY: After you use your STALL TACTICS faction ability, you may place 1 mech on a planet you control.",
        expansion: "POK",
        name: "Blackshade Infiltrator",
        stats: {
          cost: 2,
          combat: 6,
        },
        type: "Mech",
      },
    ],
  },
  ...DISCORDANT_STARS_FACTIONS,
};
