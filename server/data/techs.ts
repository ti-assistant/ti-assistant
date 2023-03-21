import { BaseTech } from "../../src/util/api/techs";

export type TechId =
  | "AI Development Algorithm"
  | "Advanced Carrier II"
  | "Aerie Hololattice"
  | "Aetherstream"
  | "Agency Supply Network"
  | "Antimass Deflectors"
  | "Assault Cannon"
  | "Bio-Stims"
  | "Bioplasmosis"
  | "Carrier II"
  | "Chaos Mapping"
  | "Crimson Legionnaire II"
  | "Cruiser II"
  | "Dacxive Animators"
  | "Dark Energy Tap"
  | "Destroyer II"
  | "Dimensional Splicer"
  | "Dimensional Tear II"
  | "Dreadnought II"
  | "Duranium Armor"
  | "E-Res Siphons"
  | "Exotrireme II"
  | "Fighter II"
  | "Fleet Logistics"
  | "Floating Factory II"
  | "Genetic Recombination"
  | "Graviton Laser System"
  | "Gravity Drive"
  | "Hegemonic Trade Policy"
  | "Hel Titan II"
  | "Hybrid Crystal Fighter II"
  | "Hyper Metabolism"
  | "IIHQ Modernization"
  | "Impulse Core"
  | "Infantry II"
  | "Inheritance Systems"
  | "Instinct Training"
  | "Integrated Economy"
  | "L4 Disruptors"
  | "Lazax Gate Folding"
  | "Letani Warrior II"
  | "LightWave Deflector"
  | "Magen Defense Grid"
  | "Mageon Implants"
  | "Magmus Reactor"
  | "Memoria II"
  | "Mirror Computing"
  | "Neural Motivator"
  | "Neuroglaive"
  | "Non-Euclidean Shielding"
  | "Nullification Field"
  | "PDS II"
  | "Plasma Scoring"
  | "Pre-Fab Arcologies"
  | "Predictive Intelligence"
  | "Production Biomes"
  | "Prototype War Sun II"
  | "Psychoarchaeology"
  | "Quantum Datahub Node"
  | "Salvage Operations"
  | "Sarween Tools"
  | "Saturn Engine II"
  | "Scanlink Drone Network"
  | "Self Assembly Routines"
  | "Sling Relay"
  | "Space Dock II"
  | "Spacial Conduit Cylinder"
  | "Spec Ops II"
  | "Strike Wing Alpha II"
  | "Super-Dreadnought II"
  | "Supercharge"
  | "Temporal Command Suite"
  | "Transit Diodes"
  | "Transparasteel Plating"
  | "Valkyrie Particle Weave"
  | "Voidwatch"
  | "Vortex"
  | "War Sun"
  | "Wormhole Generator"
  | "X-89 Bacterial Weapon"
  | "Yin Spinner";

export const BASE_TECHS: Record<TechId, BaseTech> = {
  "AI Development Algorithm": {
    description:
      "When you research a unit upgrade technology, you may exhaust this card to ignore any 1 prerequisite\n\nWhen 1 or more of your units use PRODUCTION, you may exhaust this card to reduce the combined cost of the produced units by the number of unit upgrade technologies that you own",
    expansion: "POK",
    name: "AI Development Algorithm",
    prereqs: [],
    type: "RED",
  },
  "Advanced Carrier II": {
    description: "",
    expansion: "BASE",
    faction: "Federation of Sol",
    name: "Advanced Carrier II",
    prereqs: ["BLUE", "BLUE"],
    replaces: "Carrier II",
    stats: {
      capacity: 8,
      combat: 9,
      cost: 3,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Aerie Hololattice": {
    description:
      "Other players cannot move ships through systems that contain your structures\n\nEach planet that contains 1 or more of your structures gains the PRODUCTION 1 ability as if it were a unit",
    expansion: "POK",
    faction: "Argent Flight",
    name: "Aerie Hololattice",
    prereqs: ["YELLOW"],
    type: "YELLOW",
  },
  Aetherstream: {
    description:
      "After you or one of your neighbors activates a system that is adjacent to an anomaly, you may apply +1 to the move value of all of that player's ships during this tactical action",
    expansion: "POK",
    faction: "Empyrean",
    name: "Aetherstream",
    prereqs: ["BLUE", "BLUE"],
    type: "BLUE",
  },
  "Agency Supply Network": {
    description:
      "Whenever you resolve one of your PRODUCTION abilities, you may resolve an additional one of your PRODUCTION abilities in any system; the additional use does not trigger this ability",
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    name: "Agency Supply Network",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Antimass Deflectors": {
    description:
      "Your ships can move into and through asteroid fields\n\nWhen other players' units use SPACE CANNON against your units, apply -1 to the result of each die roll",
    expansion: "BASE",
    name: "Antimass Deflectors",
    prereqs: [],
    type: "BLUE",
  },
  "Assault Cannon": {
    description:
      "At the start of a space combat in a system that contains 3 or more of your non-fighter ships, your opponent must destroy 1 of their non-fighter ships",
    expansion: "BASE",
    name: "Assault Cannon",
    prereqs: ["RED", "RED", "RED"],
    type: "RED",
  },
  "Bio-Stims": {
    description:
      "You may exhaust this card at the end of your turn to ready 1 of your planets that has a technology specialty or 1 of your other technologies",
    expansion: "POK",
    name: "Bio-Stims",
    prereqs: ["GREEN"],
    type: "GREEN",
  },
  Bioplasmosis: {
    description:
      "At the end of the status phase, you may remove any number of your infantry from planets you control and place them on 1 or more planets you control in the same or adjacent systems",
    expansion: "BASE",
    faction: "Arborec",
    name: "Bioplasmosis",
    prereqs: ["GREEN", "GREEN"],
    type: "GREEN",
  },
  "Carrier II": {
    description: "",
    expansion: "BASE",
    name: "Carrier II",
    prereqs: ["BLUE", "BLUE"],
    stats: {
      capacity: 6,
      combat: 9,
      cost: 3,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Chaos Mapping": {
    description:
      "Other players cannot activate asteroid fields that contain 1 or more of your ships\n\nAt the start of your turn during the action phase, you may produce 1 unit in a system that contains at least 1 of your units that has PRODUCTION",
    expansion: "BASE",
    faction: "Clan of Saar",
    name: "Chaos Mapping",
    prereqs: ["BLUE"],
    type: "BLUE",
  },
  "Crimson Legionnaire II": {
    description:
      "After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good. Then, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system",
    expansion: "POK",
    faction: "Mahact Gene-Sorcerers",
    name: "Crimson Legionnaire II",
    prereqs: ["GREEN", "GREEN"],
    replaces: "Infantry II",
    stats: {
      combat: 7,
      cost: "1 (x2)",
    },
    type: "UPGRADE",
  },
  "Cruiser II": {
    description: "",
    expansion: "BASE",
    name: "Cruiser II",
    prereqs: ["GREEN", "YELLOW", "RED"],
    stats: {
      capacity: 1,
      combat: 6,
      cost: 2,
      move: 3,
    },
    type: "UPGRADE",
  },
  "Dacxive Animators": {
    description:
      "After you win a ground combat, you may place 1 infantry from your reinforcements on that planet",
    expansion: "BASE",
    name: "Dacxive Animators",
    prereqs: ["GREEN"],
    type: "GREEN",
  },
  "Dark Energy Tap": {
    description:
      "After you perform a tactical action in a system that contains a frontier token, if you have 1 or more ships in that system, explore that token\n\nYour ships can retreat into adjacent systems that do not contain other players' units, even if you do not have units or control planets in that system",
    expansion: "POK",
    name: "Dark Energy Tap",
    prereqs: [],
    type: "BLUE",
  },
  "Destroyer II": {
    description: "ANTI-FIGHTER BARRAGE 6 (x3)",
    expansion: "BASE",
    name: "Destroyer II",
    prereqs: ["RED", "RED"],
    stats: {
      combat: 8,
      cost: 1,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Dimensional Splicer": {
    description:
      "At the start of space combat in a system that contains a wormhole and 1 or more of your ships, you may produce 1 hit and assign it to 1 of your opponent's ships",
    expansion: "BASE",
    faction: "Ghosts of Creuss",
    name: "Dimensional Splicer",
    prereqs: ["RED"],
    type: "RED",
  },
  "Dimensional Tear II": {
    description:
      "This system is a gravity rift; your ships do not roll for this gravity rift. Place a dimensional tear token beneath this unit as a reminder\n\nUp to 12 fighters in this system do not count against your ships' capacity\n\nPRODUCTION 7",
    expansion: "POK",
    faction: "Vuil'raith Cabal",
    name: "Dimensional Tear II",
    prereqs: ["YELLOW", "YELLOW"],
    replaces: "Space Dock II",
    type: "UPGRADE",
  },
  "Dreadnought II": {
    description:
      '"Direct Hit" cards are no longer effective against this type of ship\n\nSUSTAIN DAMAGE\nBOMBARDMENT 5',
    expansion: "BASE",
    name: "Dreadnought II",
    prereqs: ["BLUE", "BLUE", "YELLOW"],
    stats: {
      capacity: 1,
      combat: 5,
      cost: 4,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Duranium Armor": {
    description:
      "During each combat round, after you assign hits to your units, repair 1 of your damaged units that did not use SUSTAIN DAMAGE during this combat round",
    expansion: "BASE",
    name: "Duranium Armor",
    prereqs: ["RED", "RED"],
    type: "RED",
  },
  "E-Res Siphons": {
    description:
      "After another player activates a system that contains 1 or more of your ships, gain 4 trade goods",
    expansion: "BASE",
    faction: "Universities of Jol-Nar",
    name: "E-Res Siphons",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Exotrireme II": {
    description:
      'After a round of space combat, you may destroy this unit to destroy up to 2 ships in this system\n\n"Direct Hit" cards are no longer effective against this type of ship\n\nSUSTAIN DAMAGE\nBOMBARDMENT 4 (x2)',
    expansion: "BASE",
    faction: "Sardakk N'orr",
    name: "Exotrireme II",
    prereqs: ["BLUE", "BLUE", "YELLOW"],
    replaces: "Dreadnought II",
    stats: {
      capacity: 1,
      combat: 5,
      cost: 4,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Fighter II": {
    description:
      "This unit may move without being transported. Fighters in excess of your ships' capacity count against your fleet pool",
    expansion: "BASE",
    name: "Fighter II",
    prereqs: ["GREEN", "BLUE"],
    stats: {
      combat: 8,
      cost: "1 (x2)",
      move: 2,
    },
    type: "UPGRADE",
  },
  "Fleet Logistics": {
    description:
      "During each of your turns of the action phase, you may perform 2 actions instead of 1",
    expansion: "BASE",
    name: "Fleet Logistics",
    prereqs: ["BLUE", "BLUE"],
    type: "BLUE",
  },
  "Floating Factory II": {
    description:
      "This unit is placed in the space area instead of on a planet. This unit can move and retreat as if it were a ship. If this unit is blockaded, it is destroyed\n\nPRODUCTION 7",
    expansion: "BASE",
    faction: "Clan of Saar",
    name: "Floating Factory II",
    prereqs: ["YELLOW", "YELLOW"],
    replaces: "Space Dock II",
    stats: {
      capacity: 5,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Genetic Recombination": {
    description:
      "You may exhaust this card before a player casts votes; that player must cast at least 1 vote for an outcome of your choice or remove 1 token from their fleet pool and return it to their reinforcements",
    expansion: "POK",
    faction: "Mahact Gene-Sorcerers",
    name: "Genetic Recombination",
    prereqs: ["GREEN"],
    type: "GREEN",
  },
  "Graviton Laser System": {
    description:
      "You may exhaust this card before 1 or more of your units uses SPACE CANNON; hits produced by those units must be assigned to non-fighter ships if able",
    expansion: "BASE",
    name: "Graviton Laser System",
    prereqs: ["YELLOW"],
    type: "YELLOW",
  },
  "Gravity Drive": {
    description:
      "After you activate a system, apply +1 to the move value of 1 of your ships during this tactical action",
    expansion: "BASE",
    name: "Gravity Drive",
    prereqs: ["BLUE"],
    type: "BLUE",
  },
  "Hegemonic Trade Policy": {
    description:
      "Exhaust this card when 1 or more of your units use PRODUCTION; swap the resource and influence values of 1 planet you control until the end of your turn",
    expansion: "BASE",
    faction: "Winnu",
    name: "Hegemonic Trade Policy",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Hel Titan II": {
    description:
      "This unit is treated as both a structure and a ground force. It cannot be transported. You may use this unit's SPACE CANNON against ships that are adjacent to this unit's system\n\nPLANETARY SHIELD\nSPACE CANNON 5\nSUSTAIN DAMAGE\nPRODUCTION 1",
    expansion: "POK",
    faction: "Titans of Ul",
    name: "Hel Titan II",
    prereqs: ["RED", "YELLOW"],
    replaces: "PDS II",
    stats: {
      combat: 6,
    },
    type: "UPGRADE",
  },
  "Hybrid Crystal Fighter II": {
    description:
      "This unit may move without being transported. Each fighter in excess of your ships' capacity counts as 1/2 of a ship against your fleet pool",
    expansion: "BASE",
    faction: "Naalu Collective",
    name: "Hybrid Crystal Fighter II",
    prereqs: ["GREEN", "BLUE"],
    replaces: "Fighter II",
    stats: {
      combat: 7,
      cost: "1 (x2)",
      move: 2,
    },
    type: "UPGRADE",
  },
  "Hyper Metabolism": {
    description: "During the status phase, gain 3 command tokens instead of 2",
    expansion: "BASE",
    name: "Hyper Metabolism",
    prereqs: ["GREEN", "GREEN"],
    type: "GREEN",
  },
  "IIHQ Modernization": {
    description:
      "You are neighbors with all players that have units or control planets in or adjacent to the Mecatol Rex system\n\nGain the Custodia Vigilia planet card and its legendary planet ability card. You cannot lose these cards, and this card cannot have an X or Y assimilator placed on it",
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    name: "I.I.H.Q. Modernization",
    prereqs: ["YELLOW"],
    type: "YELLOW",
  },
  "Impulse Core": {
    description:
      "At the start of a space combat, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit against your opponent's ships; that hit must be assigned by your opponent to 1 of their non-fighter ships if able",
    expansion: "BASE",
    faction: "Yin Brotherhood",
    name: "Impulse Core",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Infantry II": {
    description:
      "After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system",
    expansion: "BASE",
    name: "Infantry II",
    prereqs: ["GREEN", "GREEN"],
    stats: {
      combat: 7,
      cost: "1 (x2)",
    },
    type: "UPGRADE",
  },
  "Inheritance Systems": {
    description:
      "You may exhaust this card and spend 2 resources when you research a technology; ignore all of that technology's prerequisites",
    expansion: "BASE",
    faction: "L1Z1X Mindnet",
    name: "Inheritance Systems",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Instinct Training": {
    description:
      "You may exhaust this card and spend 1 token from your strategy pool when another player plays an action card; cancel that action card",
    expansion: "BASE",
    faction: "Xxcha Kingdom",
    name: "Instinct Training",
    prereqs: ["GREEN"],
    type: "GREEN",
  },
  "Integrated Economy": {
    description:
      "After you gain control of a planet, you may produce any number of units on that planet that have a combined cost equal to or less than that planet's resource value",
    expansion: "BASE",
    name: "Integrated Economy",
    prereqs: ["YELLOW", "YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "L4 Disruptors": {
    description:
      "During an invasion, units cannot use SPACE CANNON against your units",
    expansion: "BASE",
    faction: "Barony of Letnev",
    name: "L4 Disruptors",
    prereqs: ["YELLOW"],
    type: "YELLOW",
  },
  "Lazax Gate Folding": {
    description:
      "During your tactical actions, if you do not control Mecatol Rex, treat its systems as if it has both an α and β wormhole\n\nACTION: If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex",
    expansion: "BASE",
    faction: "Winnu",
    name: "Lazax Gate Folding",
    prereqs: ["BLUE", "BLUE"],
    type: "BLUE",
  },
  "Letani Warrior II": {
    description:
      "After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system\n\nPRODUCTION 2",
    expansion: "BASE",
    faction: "Arborec",
    name: "Letani Warrior II",
    prereqs: ["GREEN", "GREEN"],
    replaces: "Infantry II",
    stats: {
      combat: 7,
      cost: "1 (x2)",
    },
    type: "UPGRADE",
  },
  "LightWave Deflector": {
    description:
      "Your ships can move through systems that contain other players' ships",
    expansion: "BASE",
    name: "Light/Wave Deflector",
    prereqs: ["BLUE", "BLUE", "BLUE"],
    type: "BLUE",
  },
  "Magen Defense Grid": {
    description:
      "You may exhaust this card at the start of a round of ground combat on a planet that contains 1 or more of your units that have PLANETARY SHIELD; your opponent cannot make combat rolls this combat round",
    expansion: "BASE",
    name: "Magen Defense Grid",
    omega: {
      description:
        "At the start of ground combat on a planet that contains 1 or more of your structures, you may produce 1 hit and assign it to 1 of your opponent's ground forces",
      expansion: "CODEX ONE",
    },
    prereqs: ["RED"],
    type: "RED",
  },
  "Mageon Implants": {
    description:
      "ACTION: Exhaust this card to look at another player's hand of action cards. Choose 1 of those cards and add it to your hand",
    expansion: "BASE",
    faction: "Yssaril Tribes",
    name: "Mageon Implants",
    prereqs: ["GREEN", "GREEN", "GREEN"],
    type: "GREEN",
  },
  "Magmus Reactor": {
    description:
      "Your ships can move into supernovas\n\nAfter 1 or more of your units use PRODUCTION in a system that either contains a war sun or is adjacent to a supernova, gain 1 trade good",
    expansion: "BASE",
    faction: "Embers of Muaat",
    name: "Magmus Reactor",
    omega: {
      description:
        "Your ships can move into supernovas\n\nEach supernova that contains 1 or more of your units gains the PRODUCTION 5 ability as if it were 1 of your units",
      expansion: "CODEX ONE",
    },
    prereqs: ["RED", "RED"],
    type: "RED",
  },
  "Memoria II": {
    description:
      "You may treat this unit as if it were adjacent to systems that contain 1 or more of your mechs\n\nSUSTAIN DAMAGE\nANTI-FIGHTER BARRAGE 5 (x3)",
    expansion: "POK",
    faction: "Nomad",
    name: "Memoria II",
    prereqs: ["GREEN", "BLUE", "YELLOW"],
    stats: {
      capacity: 6,
      combat: "5 (x2)",
      cost: 8,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Mirror Computing": {
    description:
      "When you spend trade goods, each trade good is worth 2 resources or influence instead of 1",
    expansion: "BASE",
    faction: "Mentak Coalition",
    name: "Mirror Computing",
    prereqs: ["YELLOW", "YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Neural Motivator": {
    description: "During the status phase, draw 2 action cards instead of 1",
    expansion: "BASE",
    name: "Neural Motivator",
    prereqs: [],
    type: "GREEN",
  },
  Neuroglaive: {
    description:
      "After another player activates a system that contains 1 or more of your ships, that player removes 1 token from their fleet pool and returns it to their reinforcements",
    expansion: "BASE",
    faction: "Naalu Collective",
    name: "Neuroglaive",
    prereqs: ["GREEN", "GREEN", "GREEN"],
    type: "GREEN",
  },
  "Non-Euclidean Shielding": {
    description:
      "When 1 of your units uses SUSTAIN DAMAGE, cancel 2 hits instead of 1",
    expansion: "BASE",
    faction: "Barony of Letnev",
    name: "Non-Euclidean Shielding",
    prereqs: ["RED", "RED"],
    type: "RED",
  },
  "Nullification Field": {
    description:
      "After another player activates a system that contains 1 or more of your ships, you may exhaust this card and spend 1 token from your strategy pool; immediately end that player's turn",
    expansion: "BASE",
    faction: "Xxcha Kingdom",
    name: "Nullification Field",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "PDS II": {
    description:
      "You may use this unit's SPACE CANNON against ships that are adjacent to this unit's system\n\nPLANETARY SHIELD\nSPACE CANNON 5",
    expansion: "BASE",
    name: "PDS II",
    prereqs: ["RED", "YELLOW"],
    type: "UPGRADE",
  },
  "Plasma Scoring": {
    description:
      "When 1 or more of your units use BOMBARDMENT or SPACE CANNON, 1 of those units may roll 1 additional die",
    expansion: "BASE",
    name: "Plasma Scoring",
    prereqs: [],
    type: "RED",
  },
  "Pre-Fab Arcologies": {
    description: "After you explore a planet, ready that planet",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    name: "Pre-Fab Arcologies",
    prereqs: ["GREEN", "GREEN", "GREEN"],
    type: "GREEN",
  },
  "Predictive Intelligence": {
    description:
      "At the end of your turn, you may exhaust this card to redistribute your command tokens.\n\nWhen you cast votes during the agenda phase, you may cast 3 additional votes; if you do, and the outcome you voted for is not resolved, exhaust this card",
    expansion: "POK",
    name: "Predictive Intelligence",
    prereqs: ["YELLOW"],
    type: "YELLOW",
  },
  "Production Biomes": {
    description:
      "ACTION: Exhaust this card and spend 1 token from your strategy pool to gain 4 trade goods and choose 1 other player; that player gains 2 trade goods",
    expansion: "BASE",
    faction: "Emirates of Hacan",
    name: "Production Biomes",
    prereqs: ["GREEN", "GREEN"],
    type: "GREEN",
  },
  "Prototype War Sun II": {
    description:
      "Other players' units in this system lose PLANETARY SHIELD\n\nSUSTAIN DAMAGE\nBOMBARDMENT 3 (x3)",
    expansion: "BASE",
    faction: "Embers of Muaat",
    name: "Prototype War Sun II",
    prereqs: ["RED", "RED", "RED", "YELLOW"],
    replaces: "War Sun",
    stats: {
      capacity: 6,
      combat: "3 (x3)",
      cost: 10,
      move: 3,
    },
    type: "UPGRADE",
  },
  Psychoarchaeology: {
    description:
      "You can use technology specialties on planets you control without exhausting them, even if those planets are exhausted\n\nDuring the Action Phase, you can exhaust planets you control that have technology specialties to gain 1 trade good",
    expansion: "POK",
    name: "Psychoarchaeology",
    prereqs: [],
    type: "GREEN",
  },
  "Quantum Datahub Node": {
    description:
      "At the end of the strategy phase, you may spend 1 token from your strategy pool and give another player 3 of your trade goods. If you do, give 1 of your strategy cards to that player and take 1 of their strategy cards",
    expansion: "BASE",
    faction: "Emirates of Hacan",
    name: "Quantum Datahub Node",
    prereqs: ["YELLOW", "YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Salvage Operations": {
    description:
      "After you win or lose a space combat, gain 1 trade good; if you won the combat you may also produce 1 ship in that system of any ship type that was destroyed during the combat",
    expansion: "BASE",
    faction: "Mentak Coalition",
    name: "Salvage Operations",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Sarween Tools": {
    description:
      "When 1 or more of your units use PRODUCTION, reduce the combined cost of the produced units by 1",
    expansion: "BASE",
    name: "Sarween Tools",
    prereqs: [],
    type: "YELLOW",
  },
  "Saturn Engine II": {
    description: "SUSTAIN DAMAGE",
    expansion: "POK",
    faction: "Titans of Ul",
    name: "Saturn Engine II",
    prereqs: ["GREEN", "YELLOW", "RED"],
    replaces: "Cruiser II",
    stats: {
      capacity: 2,
      combat: 6,
      cost: 2,
      move: 3,
    },
    type: "UPGRADE",
  },
  "Scanlink Drone Network": {
    description:
      "When you activate a system, you may explore 1 planet in that system which contains 1 or more of your units",
    expansion: "POK",
    name: "Scanlink Drone Network",
    prereqs: [],
    type: "YELLOW",
  },
  "Self Assembly Routines": {
    description:
      "After 1 or more of your units use PRODUCTION, you may exhaust this card to place 1 mech from your reinforcements on a planet you control in that system\n\nAfter 1 of your mechs is destroyed, gain 1 trade good",
    expansion: "POK",
    name: "Self Assembly Routines",
    prereqs: ["RED"],
    type: "RED",
  },
  "Sling Relay": {
    description:
      "ACTION: Exhaust this card to produce 1 ship in any system that contains 1 of your space docks",
    expansion: "POK",
    name: "Sling Relay",
    prereqs: ["BLUE"],
    type: "BLUE",
  },
  "Space Dock II": {
    description:
      "This unit's PRODUCTION value is equal to 4 more than the resource value of this planet\n\nUp to 3 fighters in this system do not count against your ships' capacity\n\nPRODUCTION X",
    expansion: "BASE",
    name: "Space Dock II",
    prereqs: ["YELLOW", "YELLOW"],
    type: "UPGRADE",
  },
  "Spacial Conduit Cylinder": {
    description:
      "You may exhaust this card after you activate a system that contains 1 or more of your units; that system is adjacent to all other systems that contain 1 or more of your units during this activation",
    expansion: "BASE",
    faction: "Universities of Jol-Nar",
    name: "Spacial Conduit Cylinder",
    prereqs: ["BLUE", "BLUE"],
    type: "BLUE",
  },
  "Spec Ops II": {
    description:
      "After this unit is destroyed, roll 1 die. If the result is 5 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system",
    expansion: "BASE",
    faction: "Federation of Sol",
    name: "Spec Ops II",
    prereqs: ["GREEN", "GREEN"],
    replaces: "Infantry II",
    stats: {
      combat: 6,
      cost: "1 (x2)",
    },
    type: "UPGRADE",
  },
  "Strike Wing Alpha II": {
    description:
      "When this unit uses ANTI-FIGHTER BARRAGE, each result of 9 or 10 also destroys 1 of your opponent's infantry in the space area of the active system\n\nANTI-FIGHTER BARRAGE 6 (x3)",
    expansion: "POK",
    faction: "Argent Flight",
    name: "Strike Wing Alpha II",
    prereqs: ["RED", "RED"],
    replaces: "Destroyer II",
    stats: {
      capacity: 1,
      combat: 7,
      cost: 1,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Super-Dreadnought II": {
    description:
      '"Direct Hit" cards are no longer effective against this type of ship\n\nSUSTAIN DAMAGE\nBOMBARDMENT 4',
    expansion: "BASE",
    faction: "L1Z1X Mindnet",
    name: "Super-Dreadnought II",
    prereqs: ["BLUE", "BLUE", "YELLOW"],
    replaces: "Dreadnought II",
    stats: {
      capacity: 2,
      combat: 4,
      cost: 4,
      move: 2,
    },
    type: "UPGRADE",
  },
  Supercharge: {
    description:
      "At the start of a combat round, you may exhaust this card to apply +1 to the result of each of your unit's combat rolls during this combat round",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    name: "Supercharge",
    prereqs: ["RED"],
    type: "RED",
  },
  "Temporal Command Suite": {
    description:
      "After any player's agent becomes exhausted, you may exhaust this card to ready that agent; if you ready another player's agent, you may perform a transaction with that player",
    expansion: "POK",
    faction: "Nomad",
    name: "Temporal Command Suite",
    prereqs: ["YELLOW"],
    type: "YELLOW",
  },
  "Transit Diodes": {
    description:
      "You may exhaust this card at the start of your turn during the action phase; remove up to 4 of your ground forces from the game board and place them on 1 or more planets you control",
    expansion: "BASE",
    name: "Transit Diodes",
    prereqs: ["YELLOW", "YELLOW"],
    type: "YELLOW",
  },
  "Transparasteel Plating": {
    description:
      "During your turn of the action phase, players that have passed cannot play action cards",
    expansion: "BASE",
    faction: "Yssaril Tribes",
    name: "Transparasteel Plating",
    prereqs: ["GREEN"],
    type: "GREEN",
  },
  "Valkyrie Particle Weave": {
    description:
      "After making combat rolls during a round of ground combat, if your opponent produced 1 or more hits, you produce 1 additional hit",
    expansion: "BASE",
    faction: "Sardakk N'orr",
    name: "Valkyrie Particle Weave",
    prereqs: ["RED", "RED"],
    type: "RED",
  },
  Voidwatch: {
    description:
      "After a player moves ships into a system that contains 1 or more of your units, they must give you 1 promissory note from their hand, if able",
    expansion: "POK",
    faction: "Empyrean",
    name: "Voidwatch",
    prereqs: ["GREEN"],
    type: "GREEN",
  },
  Vortex: {
    description:
      "ACTION: Exhaust this card to choose another player's non-structure unit in a system that is adjacent to 1 or more of your space docks. Capture 1 unit of that type from that player's reinforcements",
    expansion: "POK",
    faction: "Vuil'raith Cabal",
    name: "Vortex",
    prereqs: ["RED"],
    type: "RED",
  },
  "War Sun": {
    description:
      "Other players' units in this system lose PLANETARY SHIELD\n\nSUSTAIN DAMAGE\nBOMBARDMENT 3 (x3)",
    expansion: "BASE",
    name: "War Sun",
    prereqs: ["YELLOW", "RED", "RED", "RED"],
    stats: {
      capacity: 6,
      combat: "3 (x3)",
      cost: 12,
      move: 2,
    },
    type: "UPGRADE",
  },
  "Wormhole Generator": {
    description:
      "At the start of the status phase, place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
    expansion: "BASE",
    faction: "Ghosts of Creuss",
    name: "Wormhole Generator",
    omega: {
      description:
        "ACTION: Exhaust this card to place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
      expansion: "CODEX ONE",
    },
    prereqs: ["BLUE", "BLUE"],
    type: "BLUE",
  },
  "X-89 Bacterial Weapon": {
    description:
      "ACTION: Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet",
    expansion: "BASE",
    name: "X-89 Bacterial Weapon",
    omega: {
      description:
        "After 1 or more of your units use BOMBARDMENT against a planet, if at least 1 of your opponent's infantry was destroyed, you may destroy all of your opponent's infantry on that planet",
      expansion: "CODEX ONE",
    },
    prereqs: ["GREEN", "GREEN", "GREEN"],
    type: "GREEN",
  },
  "Yin Spinner": {
    description:
      "After 1 or more of your units use PRODUCTION, place 1 infantry from your reinforcements on a planet you control in that system",
    expansion: "BASE",
    faction: "Yin Brotherhood",
    name: "Yin Spinner",
    omega: {
      description:
        "After you produce units, place up to 2 infantry from your reinforcements on any planet you control or in any space area that contains 1 or more of your ships",
      expansion: "CODEX ONE",
    },
    prereqs: ["GREEN", "GREEN"],
    type: "GREEN",
  },
};
