const { getFirestore } = require('firebase-admin/firestore');

const FACTIONS = {
  Arborec: {
    colors: {
      Green: 1.6,
      Black: 0.1,
      Yellow: 0.1,
      Blue: 0.1
    },
    game: "base",
    startswith: {
      techs: [
        "Magen Defense Grid",
      ],
      planets: [
        "Nestphar",
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 1,
        "Fighter": 2,
        "Infantry": 4,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Argent Flight": {
    colors: {
      Orange: 1.6,
      Blue: 0.15,
      Green: 0.15
    },
    game: "pok",
    startswith: {
      planets: [
        "Valk",
        "Avar",
        "Ylir",
      ],
      units: {
        "Carrier": 1,
        "Destroyer": 2,
        "Fighter": 2,
        "Infantry": 5,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Barony of Letnev": {
    colors: {
      Red: 0.95,
      Black: 0.8,
      Blue: 0.1
    },
    game: "base",
    startswith: {
      techs: [
        "Antimass Deflectors",
        "Plasma Scoring",
      ],
      planets: [
        "Arc Prime",
        "Wren Terra",
      ],
      units: {
        "Carrier": 1,
        "Destroyer": 1,
        "Dreadnought": 1,
        "Fighter": 1,
        "Infantry": 3,
        "Space Dock": 1,
      },
    },
  },
  "Clan of Saar": {
    colors: {
      Orange: 0.85,
      Green: 0.5,
      Yellow: 0.4
    },
    game: "base",
    startswith: {
      techs: [
        "Antimass Deflectors",
      ],
      planets: [
        "Lisis II",
        "Ragh",
      ],
      units: {
        "Carrier": 2,
        "Cruiser": 1,
        "Fighter": 2,
        "Infantry": 4,
        "Space Dock": 1,
      },
    },
  },
  "Council Keleres": {
    colors: {
      Purple: 0.7,
      Blue: 0.5,
      Orange: 0.35,
      Yellow: 0.35
    },
    game: "codex-3",
    startswith: {
      units: {
        "Carrier": 2,
        "Cruiser": 1,
        "Fighter": 2,
        "Infantry": 2,
        "Space Dock": 1,
      },
    },
  },
  "Embers of Muaat": {
    colors: {
      Red: 1.25,
      Orange: 0.65
    },
    game: "base",
    startswith: {
      techs: [
        "Plasma Scoring",
      ],
      planets: [
        "Muaat",
      ],
      units: {
        "Fighter": 2,
        "Infantry": 4,
        "Space Dock": 1,
        "War Sun": 1,
      },
    },
  },
  "Emirates of Hacan": {
    colors: {
      Yellow: 1.2,
      Orange: 0.7
    },
    game: "base",
    startswith: {
      techs: [
        "Antimass Deflectors",
        "Sarween Tools",
      ],
      planets: [
        "Arretze",
        "Hercant",
        "Kamdorn",
      ],
      units: {
        "Carrier": 2,
        "Cruiser": 1,
        "Fighter": 2,
        "Infantry": 4,
        "Space Dock": 1,
      },
    },
  },
  Empyrean: {
    colors: {
      Purple: 1.6,
      Red: 0.15,
      Magenta: 0.15
    },
    game: "pok",
    startswith: {
      techs: [
        "Dark Energy Tap",
      ],
      planets: [
        "The Dark",
      ],
      units: {
        "Carrier": 2,
        "Destroyer": 1,
        "Fighter": 2,
        "Infantry": 4,
        "Space Dock": 1,
      },
    },
  },
  "Federation of Sol": {
    colors: {
      Blue: 1.15,
      Yellow: 0.75
    },
    game: "base",
    startswith: {
      techs: [
        "Neural Motivator",
        "Antimass Deflectors",
      ],
      planets: [
        "Jord",
      ],
      units: {
        "Carrier": 2,
        "Destroyer": 1,
        "Fighter": 3,
        "Infantry": 5,
        "Space Dock": 1,
      },
    },
  },
  "Ghosts of Creuss": {
    colors: {
      Blue: 1.7,
      Black: 0.1,
      Purple: 0.1
    },
    game: "base",
    startswith: {
      techs: [
        "Gravity Drive",
      ],
      planets: [
        "Creuss",
      ],
      units: {
        "Carrier": 1,
        "Destroyer": 2,
        "Fighter": 2,
        "Infantry": 4,
        "Space Dock": 1,
      },
    },
  },
  "L1Z1X Mindnet": {
    colors: {
      Black: 0.7,
      Blue: 0.6,
      Red: 0.6
    },
    game: "base",
    startswith: {
      techs: [
        "Neural Motivator",
        "Plasma Scoring",
      ],
      planets: [
        "[0.0.0]",
      ],
      units: {
        "Carrier": 1,
        "Dreadnought": 1,
        "Fighter": 3,
        "Infantry": 5,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Mahact Gene-Sorcerers": {
    colors: {
      Yellow: 1.6,
      Purple: 0.3
    },
    game: "pok",
    startswith: {
      techs: [
        "Bio Stims",
        "Predictive Intelligence",
      ],
      planets: [
        "Ixth",
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 1,
        "Dreadnought": 1,
        "Fighter": 2,
        "Infantry": 3,
        "Space Dock": 1,
      },
    },
  },
  "Mentak Coalition": {
    colors: {
      Orange: 0.95,
      Black: 0.5,
      Yellow: 0.45
    },
    game: "base",
    startswith: {
      techs: [
        "Sarween Tools",
        "Plasma Scoring",
      ],
      planets: [
        "Moll Primus",
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 2,
        "Fighter": 3,
        "Infantry": 4,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Naalu Collective": {
    colors: {
      Green: 1.15,
      Yellow: 0.45,
      Orange: 0.3
    },
    game: "base",
    startswith: {
      techs: [
        "Neural Motivator",
        "Sarween Tools",
      ],
      planets: [
        "Maaluuk",
        "Druua"
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 1,
        "Destroyer": 1,
        "Fighter": 3,
        "Infantry": 4,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Naaz-Rokha Alliance": {
    colors: {
      Green: 1.6,
      Yellow: 0.3
    },
    game: "pok",
    startswith: {
      techs: [
        "Psychoarchaeology",
        "AI Development Algorithm",
      ],
      planets: [
        "Naazir",
        "Rokha"
      ],
      units: {
        "Carrier": 2,
        "Destroyer": 1,
        "Fighter": 2,
        "Infantry": 3,
        "Mech": 1,
        "Space Dock": 1,
      },
    },
  },
  "Nekro Virus": {
    colors: {
      Red: 1.75,
      Black: 0.15
    },
    game: "base",
    startswith: {
      techs: [
        "Dacxive Animators",
      ],
      planets: [
        "Mordai II",
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 1,
        "Dreadnought": 1,
        "Fighter": 2,
        "Infantry": 2,
        "Space Dock": 1,
      },
    },
  },
  Nomad: {
    colors: {
      Blue: 1.25,
      Purple: 0.65
    },
    game: "pok",
    startswith: {
      techs: [
        "Sling Relay",
      ],
      planets: [
        "Arcturus",
      ],
      units: {
        "Carrier": 1,
        "Destroyer": 1,
        "Fighter": 3,
        "Flagship": 1,
        "Infantry": 4,
        "Space Dock": 1,
      },
    },
  },
  "Sardakk N'orr": {
    colors: {
      Black: 1.0,
      Red: 0.9
    },
    game: "base",
    startswith: {
      planets: [
        "Tren'lak",
        "Quinarra",
      ],
      units: {
        "Carrier": 2,
        "Cruiser": 1,
        "Infantry": 5,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Titans of Ul": {
    colors: {
      Magenta: 1.9
    },
    game: "pok",
    startswith: {
      techs: [
        "Antimass Deflectors",
        "Scanlink Drone Network",
      ],
      planets: [
        "Elysium",
      ],
      units: {
        "Cruiser": 2,
        "Dreadnought": 1,
        "Fighter": 2,
        "Infantry": 3,
        "Space Dock": 1,
      },
    },
  },
  "Universities of Jol'Nar": {
    colors: {
      Blue: 1.6,
      Purple: 0.3
    },
    game: "base",
    startswith: {
      techs: [
        "Neural Motivator",
        "Antimass Deflectors",
        "Sarween Tools",
        "Plasma Scoring",
      ],
      planets: [
        "Jol",
        "Nar",
      ],
      units: {
        "Carrier": 2,
        "Dreadnought": 1,
        "Fighter": 1,
        "Infantry": 2,
        "Space Dock": 1,
        "PDS": 2,
      },
    },
  },
  "Vuil'Raith Cabal": {
    colors: {
      Red: 1.35,
      Black: 0.4,
      Magenta: 0.1
    },
    game: "pok",
    startswith: {
      techs: [
        "Self Assembly Routines",
      ],
      planets: [
        "Acheron",
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 1,
        "Dreadnought": 1,
        "Fighter": 3,
        "Infantry": 3,
        "Space Dock": 1,
      },
    },
  },
  Winnu: {
    colors: {
      Orange: 0.75,
      Purple: 0.6,
      Yellow: 0.55
    },
    game: "base",
    startswith: {
      planets: [
        "Winnu",
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 1,
        "Fighter": 2,
        "Infantry": 2,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Xxcha Kingdom": {
    colors: {
      Green: 1.1,
      Blue: 0.8
    },
    game: "base",
    startswith: {
      techs: [
        "Graviton Laser System",
      ],
      planets: [
        "Archon Ren",
        "Archon Tau",
      ],
      units: {
        "Carrier": 1,
        "Cruiser": 2,
        "Fighter": 3,
        "Infantry": 4,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  },
  "Yin Brotherhood": {
    colors: {
      Purple: 1.05,
      Black: 0.6,
      Yellow: 0.25
    },
    game: "base",
    startswith: {
      techs: [
        "Sarween Tools",
      ],
      planets: [
        "Darien",
      ],
      units: {
        "Carrier": 2,
        "Destroyer": 1,
        "Fighter": 4,
        "Infantry": 4,
        "Space Dock": 1,
      },
    },
  },
  "Yssaril Tribes": {
    colors: {
      Green: 0.93,
      Yellow: 0.63,
      Red: 0.25,
      Black: 0.1
    },
    game: "base",
    startswith: {
      techs: [
        "Neural Motivator",
      ],
      planets: [
        "Retillion",
        "Shalloq"
      ],
      units: {
        "Carrier": 2,
        "Cruiser": 1,
        "Fighter": 2,
        "Infantry": 5,
        "Space Dock": 1,
        "PDS": 1,
      },
    },
  }
};

export default async function handler(req, res) {
  const db = getFirestore();

  const factionsRef = await db.collection('factions').get();

  let factions = {};
  factionsRef.forEach((val) => {
    factions[val.id] = val.data();
  });

  res.status(200).json(factions);
}