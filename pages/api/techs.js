const BASE_TECHS = [
  // Green Techs
  {
    name: "Neural Motivator",
    type: "green",
    prereqs: [],
    game: "base",
  },
  {
    name: "Psychoarchaeology",
    type: "green",
    prereqs: [],
    game: "pok",
  },
  {
    name: "Dacxive Animators",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "base",
  },
  {
    name: "Bio Stims",
    type: "green",
    prereqs: [
      "green",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  {
    name: "Hyper Metabolism",
    type: "green",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
  },
  {
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
  {
    name: "Antimass Deflectors",
    type: "blue",
    prereqs: [],
    game: "base",
  },
  {
    name: "Dark Energy Tap",
    type: "blue",
    prereqs: [],
    game: "pok",
  },
  {
    name: "Gravity Drive",
    type: "blue",
    prereqs: [
      "blue",
    ],
    game: "base",
  },
  {
    name: "Sling Relay",
    type: "blue",
    prereqs: [
      "blue",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  {
    name: "Fleet Logistics",
    type: "blue",
    prereqs: [
      "blue",
      "blue",
    ],
    game: "base",
  },
  {
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
  {
    name: "Sarween Tools",
    type: "yellow",
    prereqs: [],
    game: "base",
  },
  {
    name: "Scanlink Drone Network",
    type: "yellow",
    prereqs: [],
    game: "pok",
  },
  {
    name: "Graviton Laser System",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "base",
    canExhaust: true,
    isReady: true,
  },
  {
    name: "Predictive Intelligence",
    type: "yellow",
    prereqs: [
      "yellow",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  {
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
  {
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
  {
    name: "Plasma Scoring",
    type: "red",
    prereqs: [],
    game: "base",
  },
  {
    name: "AI Development Algorithm",
    type: "red",
    prereqs: [],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  {
    name: "Magen Defense Grid",
    type: "red",
    prereqs: [
      "red",
    ],
    game: "base",
  },
  {
    name: "Self Assembly Routines",
    type: "red",
    prereqs: [
      "red",
    ],
    game: "pok",
    canExhaust: true,
    isReady: true,
  },
  {
    name: "Duranium Armor",
    type: "red",
    prereqs: [
      "red",
      "red",
    ],
    game: "base",
  },
  {
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
  {
    name: "Carrier II",
    type: "upgrade",
    prereqs: [
      "blue",
      "blue"
    ],
    game: "base",
  },
  {
    name: "Cruiser II",
    type: "upgrade",
    prereqs: [
      "green",
      "yellow",
      "red",
    ],
    game: "base",
  },
  {
    name: "Destroyer II",
    type: "upgrade",
    prereqs: [
      "red",
      "red",
    ],
    game: "base",
  },
  {
    name: "Dreadnought II",
    type: "upgrade",
    prereqs: [
      "blue",
      "blue",
      "yellow",
    ],
    game: "base",
  },
  {
    name: "Fighter II",
    type: "upgrade",
    prereqs: [
      "green",
      "blue",
    ],
    game: "base",
  },
  {
    name: "Infantry II",
    type: "upgrade",
    prereqs: [
      "green",
      "green",
    ],
    game: "base",
  },
  {
    name: "PDS II",
    type: "upgrade",
    prereqs: [
      "red",
      "yellow",
    ],
    game: "base",
  },
  {
    name: "Space Dock II",
    type: "upgrade",
    prereqs: [
      "yellow",
      "yellow",
    ],
    game: "base",
  },
  {
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
];

export default function handler(req, res) {
  res.status(200).json(BASE_TECHS);
}