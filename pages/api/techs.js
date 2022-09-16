const { getFirestore } = require('firebase-admin/firestore');

const BASE_TECHS = {
  // Green Techs
  "Neural Motivator": {
    name: "Neural Motivator",
    type: "green",
    prereqs: [],
    game: "base",
  },
  "Psychoarchaeology": {
    name: "Psychoarchaeology",
    type: "green",
    prereqs: [],
    game: "pok",
  },
  "Dacxive Animators": {
    name: "Dacxive Animators",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "base",
  },
  "Bio Stims": {
    name: "Bio Stims",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  "Hyper Metabolism": {
    name: "Hyper Metabolism",
    type: "green",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
  },
  "X-89 Bacterial Weapon": {
    name: "X-89 Bacterial Weapon",
    type: "green",
    prereqs: [
      "green",
      "green",
      "green",
    ],
    game: "base",
  },

  // Blue Techs
  "Antimass Deflectors": {
    name: "Antimass Deflectors",
    type: "blue",
    prereqs: [],
    game: "base",
  },
  "Dark Energy Tap": {
    name: "Dark Energy Tap",
    type: "blue",
    prereqs: [],
    game: "pok",
  },
  "Gravity Drive": {
    name: "Gravity Drive",
    type: "blue",
    prereqs: [
      "blue",
    ],
    game: "base",
  },
  "Sling Relay": {
    name: "Sling Relay",
    type: "blue",
    prereqs: [
      "blue",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  "Fleet Logistics": {
    name: "Fleet Logistics",
    type: "blue",
    prereqs: [
      "blue",
      "blue",
    ],
    game: "base",
  },
  "LightWave Deflector": {
    name: "Light/Wave Deflector",
    type: "blue",
    prereqs: [
      "blue",
      "blue",
      "blue",
    ],
    game: "base",
  },

  // Yellow Tech
  "Sarween Tools": {
    name: "Sarween Tools",
    type: "yellow",
    prereqs: [],
    game: "base",
  },
  "Scanlink Drone Network": {
    name: "Scanlink Drone Network",
    type: "yellow",
    prereqs: [],
    game: "pok",
  },
  "Graviton Laser System": {
    name: "Graviton Laser System",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "base",
    canExhaust: true,
    isReady: true,
  },
  "Predictive Intelligence": {
    name: "Predictive Intelligence",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  "Transit Diodes": {
    name: "Transit Diodes",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    canExhaust: true,
    isReady: true,
  },
  "Integrated Economy": {
    name: "Integrated Economy",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
      "yellow",
    ],
    game: "base",
  },

  // Red Tech
  "Plasma Scoring": {
    name: "Plasma Scoring",
    type: "red",
    prereqs: [],
    game: "base",
  },
  "AI Development Algorithm": {
    name: "AI Development Algorithm",
    type: "red",
    prereqs: [],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  "Magen Defense Grid": {
    name: "Magen Defense Grid",
    type: "red",
    prereqs: [
      "red",
    ],
    game: "base",
  },
  "Self Assembly Routines": {
    name: "Self Assembly Routines",
    type: "red",
    prereqs: [
      "red",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  "Duranium Armor": {
    name: "Duranium Armor",
    type: "red",
    prereqs: [
      "red",
      "red",
    ],
    game: "base",
  },
  "Assault Cannon": {
    name: "Assault Cannon",
    type: "red",
    prereqs: [
      "red",
      "red",
      "red",
    ],
    game: "base",
  },

  // Unit Upgrades
  "Carrier II": {
    name: "Carrier II",
    type: "upgrade",
    prereqs: [
      "blue",
      "blue"
    ],
    game: "base",
  },
  "Cruiser II": {
    name: "Cruiser II",
    type: "upgrade",
    prereqs: [
      "green",
      "yellow",
      "red",
    ],
    game: "base",
  },
  "Destroyer II": {
    name: "Destroyer II",
    type: "upgrade",
    prereqs: [
      "red",
      "red",
    ],
    game: "base",
  },
  "Dreadnought II": {
    name: "Dreadnought II",
    type: "upgrade",
    prereqs: [
      "blue",
      "blue",
      "yellow",
    ],
    game: "base",
  },
  "Fighter II": {
    name: "Fighter II",
    type: "upgrade",
    prereqs: [
      "green",
      "blue",
    ],
    game: "base",
  },
  "Infantry II": {
    name: "Infantry II",
    type: "upgrade",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
  },
  "PDS II": {
    name: "PDS II",
    type: "upgrade",
    prereqs: [
      "red",
      "yellow",
    ],
    game: "base",
  },
  "Space Dock II": {
    name: "Space Dock II",
    type: "upgrade",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
  },
  "War Sun": {
    name: "War Sun",
    type: "upgrade",
    prereqs: [
      "yellow",
      "red",
      "red",
      "red",
    ],
    game: "base",
  },

  // Faction Techs
  "Bioplasmosis": {
    name: "Bioplasmosis",
    type: "green",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
    faction: "Arborec",
  },
  "Letani Warrior II": {
    name: "Letani Warrior II",
    type: "upgrade",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
    faction: "Arborec",
    replaces: "Infantry II",
  },
  "Aerie Hololattice": {
    name: "Aerie Hololattice",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "pok",
    faction: "Argent Flight",
  },
  "Strike Wing Alpha II": {
    name: "Strike Wing Alpha II",
    type: "upgrade",
    prereqs: [
      "red",
      "red",
    ],
    game: "pok",
    faction: "Argent Flight",
    replaces: "Destroyer II",
  },
  "L4 Disruptors": {
    name: "L4 Disruptors",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "base",
    faction: "Barony of Letnev",
  },
  "Non-Euclidean Shielding": {
    name: "Non-Euclidean Shielding",
    type: "red",
    prereqs: [
      "red",
      "red",
    ],
    game: "base",
    faction: "Barony of Letnev",
  },
  "Chaos Mapping": {
    name: "Chaos Mapping",
    type: "blue",
    prereqs: [
      "blue",
    ],
    game: "base",
    faction: "Clan of Saar",
  },
  "Floating Factory II": {
    name: "Floating Factory II",
    type: "upgrade",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Clan of Saar",
    replaces: "Space Dock II",
  },
  "IIHQ Modernization": {
    name: "I.I.H.Q. Modernization",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "codex-3",
    faction: "Council Keleres",
  },
  "Agency Supply Network": {
    name: "Agency Supply Network",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "codex-3",
    faction: "Council Keleres",
  },
  "Magmus Reactor": {
    name: "Magmus Reactor",
    type: "red",
    prereqs: [
      "red",
      "red",
    ],
    game: "base",
    faction: "Embers of Muaat",
  },
  "Prototype War Sun II": {
    name: "Prototype War Sun II",
    type: "upgrade",
    prereqs: [
      "red",
      "red",
      "red",
      "yellow",
    ],
    game: "base",
    faction: "Embers of Muaat",
    replaces: "War Sun",
  },
  "Production Biomes": {
    name: "Production Biomes",
    type: "green",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
    faction: "Emirates of Hacan",
  },
  "Quantum Datahub Node": {
    name: "Quantum Datahub Node",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Emirates of Hacan",
  },
  "Aetherstream": {
    name: "Aetherstream",
    type: "blue",
    prereqs: [
      "blue",
      "blue",
    ],
    game: "pok",
    faction: "Empyrean",
  },
  "Voidwatch": {
    name: "Voidwatch",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "pok",
    faction: "Empyrean",
  },
  "Spec Ops II": {
    name: "Spec Ops II",
    type: "upgrade",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
    faction: "Federation of Sol",
    replaces: "Infantry II",
  },
  "Advanced Carrier II": {
    name: "Advanced Carrier II",
    type: "upgrade",
    prereqs: [
      "blue",
      "blue",
    ],
    game: "base",
    faction: "Federation of Sol",
    replaces: "Carrier II",
  },
  "Wormhole Generator": {
    name: "Wormhole Generator",
    type: "blue",
    prereqs: [
      "blue",
      "blue",
    ],
    game: "base",
    faction: "Ghosts of Creuss",
  },
  "Dimensional Splicer": {
    name: "Dimensional Splicer",
    type: "red",
    prereqs: [
      "red",
    ],
    game: "base",
    faction: "Ghosts of Creuss",
  },
  "Inheritance Systems": {
    name: "Inheritance Systems",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "L1Z1X Mindnet",
  },
  "Super-Dreadnought II": {
    name: "Super-Dreadnought II",
    type: "upgrade",
    prereqs: [
      "blue",
      "blue",
      "yellow",
    ],
    game: "base",
    faction: "L1Z1X Mindnet",
    replaces: "Dreadnought II",
  },
  "Genetic Recombination": {
    name: "Genetic Recombination",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "pok",
    faction: "Mahact Gene-Sorcerers",
  },
  "Crimson Legionnaire II": {
    name: "Crimson Legionnaire II",
    type: "upgrade",
    prereqs: [
      "green",
      "green",
    ],
    game: "pok",
    faction: "Mahact Gene-Sorcerers",
    replaces: "Infantry II",
  },
  "Salvage Operations": {
    name: "Salvage Operations",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Mentak Coalition",
  },
  "Mirror Computing": {
    name: "Mirror Computing",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Mentak Coalition",
  },
  "Neuroglaive": {
    name: "Neuroglaive",
    type: "green",
    prereqs: [
      "green",
      "green",
      "green",
    ],
    game: "base",
    faction: "Naalu Collective",
  },
  "Hybrid Crystal Fighter II": {
    name: "Hybrid Crystal Fighter II",
    type: "upgrade",
    prereqs: [
      "green",
      "blue",
    ],
    game: "base",
    faction: "Naalu Collective",
    replaces: "Fighter II",
  },
  "Supercharge": {
    name: "Supercharge",
    type: "red",
    prereqs: [
      "red",
    ],
    game: "pok",
    faction: "Naaz-Rokha Alliance",
  },
  "Pre-Fab Arcologies": {
    name: "Pre-Fab Arcologies",
    type: "green",
    prereqs: [
      "green",
      "green",
      "green",
    ],
    game: "pok",
    faction: "Naaz-Rokha Alliance",
  },
  "Temporal Command Suite": {
    name: "Temporal Command Suite",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "pok",
    faction: "Nomad",
  },
  "Memoria II": {
    name: "Memoria II",
    type: "upgrade",
    prereqs: [
      "green",
      "blue",
      "yellow",
    ],
    game: "pok",
    faction: "Nomad",
  },
  "Valkyrie Particle Weave": {
    name: "Valkyrie Particle Weave",
    type: "red",
    prereqs: [
      "red",
      "red",
    ],
    game: "base",
    faction: "Sardakk N'orr",
  },
  "Exotrireme II": {
    name: "Exotrireme II",
    type: "upgrade",
    prereqs: [
      "blue",
      "blue",
      "yellow",
    ],
    game: "base",
    faction: "Sardakk N'orr",
    replaces: "Dreadnought II",
  },
  "Saturn Engine II": {
    name: "Saturn Engine II",
    type: "upgrade",
    prereqs: [
      "green",
      "yellow",
      "red",
    ],
    game: "pok",
    faction: "Titans of Ul",
    replaces: "Cruiser II",
  },
  "Hel Titan II": {
    name: "Hel Titan II",
    type: "upgrade",
    prereqs: [
      "yellow",
      "red",
    ],
    game: "pok",
    faction: "Titans of Ul",
    replaces: "PDS II",
  },
  "E-Res Siphons": {
    name: "E-Res Siphons",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Universities of Jol-Nar",
  },
  "Spacial Conduit Cylinder": {
    name: "Spacial Conduit Cylinder",
    type: "blue",
    prereqs: [
      "blue",
      "blue",
    ],
    game: "base",
    faction: "Universities of Jol-Nar",
  },
  "Vortex": {
    name: "Vortex",
    type: "red",
    prereqs: [
      "red",
    ],
    game: "pok",
    faction: "Vuil'Raith Cabal",
  },
  "Dimensional Tear II": {
    name: "Dimensional Tear II",
    type: "upgrade",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "pok",
    faction: "Vuil'Raith Cabal",
    replaces: "Space Dock II",
  },
  "Lazax Gate Folding": {
    name: "Lazax Gate Folding",
    type: "blue",
    prereqs: [
      "blue",
      "blue",
    ],
    game: "base",
    faction: "Winnu",
  },
  "Hegemonic Trade Policy": {
    name: "Hegemonic Trade Policy",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Winnu",
  },
  "Nullification Field": {
    name: "Nullification Field",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Xxcha Kingdom",
  },
  "Instinct Training": {
    name: "Instinct Training",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "base",
    faction: "Xxcha Kingdom",
  },
  "Impulse Core": {
    name: "Impulse Core",
    type: "yellow",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
    faction: "Yin Brotherhood",
  },
  "Yin Spinner": {
    name: "Yin Spinner",
    type: "green",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
    faction: "Yin Brotherhood",
  },
  "Transparasteel Plating": {
    name: "Transparasteel Plating",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "base",
    faction: "Yssaril Tribes",
  },
  "Mageon Implants": {
    name: "Mageon Implants",
    type: "green",
    prereqs: [
      "green",
      "green",
      "green",
    ],
    game: "base",
    faction: "Yssaril Tribes",
  },
};

export default async function handler(req, res) {
  const db = getFirestore();

  const techsRef = await db.collection('techs').get();

  let techs = {};
  techsRef.forEach((val) => {
    techs[val.id] = val.data();
  });

  res.status(200).json(techs);
}