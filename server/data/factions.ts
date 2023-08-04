import { BaseFaction } from "../../src/util/api/factions";
import { DISCORDANT_STARS_FACTIONS } from "./discordantstars/factions";

export type FactionId =
  | "Arborec"
  | "Argent Flight"
  | "Barony of Letnev"
  | "Clan of Saar"
  | "Council Keleres"
  | "Embers of Muaat"
  | "Emirates of Hacan"
  | "Empyrean"
  | "Federation of Sol"
  | "Ghosts of Creuss"
  | "L1Z1X Mindnet"
  | "Mahact Gene-Sorcerers"
  | "Mentak Coalition"
  | "Naalu Collective"
  | "Naaz-Rokha Alliance"
  | "Nekro Virus"
  | "Nomad"
  | "Sardakk N'orr"
  | "Titans of Ul"
  | "Universities of Jol-Nar"
  | "Vuil'raith Cabal"
  | "Winnu"
  | "Xxcha Kingdom"
  | "Yin Brotherhood"
  | "Yssaril Tribes"
  | DiscordantStars.FactionId;

export const BASE_FACTIONS: Record<FactionId, BaseFaction> = {
  Arborec: {
    colors: {
      Black: 0.1,
      Blue: 0.1,
      Green: 1.6,
      Yellow: 0.1,
    },
    commodities: 3,
    expansion: "BASE",
    name: "Arborec",
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
  },
  "Argent Flight": {
    colors: {
      Blue: 0.15,
      Green: 0.15,
      Orange: 1.6,
    },
    commodities: 3,
    expansion: "POK",
    name: "Argent Flight",
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
  },
  "Barony of Letnev": {
    colors: {
      Black: 0.8,
      Blue: 0.1,
      Red: 0.95,
    },
    commodities: 2,
    expansion: "BASE",
    name: "Barony of Letnev",
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
  },
  "Clan of Saar": {
    colors: {
      Green: 0.5,
      Orange: 0.85,
      Yellow: 0.4,
    },
    commodities: 3,
    expansion: "BASE",
    name: "Clan of Saar",
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
  },
  "Council Keleres": {
    colors: {
      Blue: 0.5,
      Orange: 0.35,
      Purple: 0.7,
      Yellow: 0.35,
    },
    commodities: 2,
    expansion: "CODEX THREE",
    name: "Council Keleres",
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
  },
  "Embers of Muaat": {
    colors: {
      Orange: 0.65,
      Red: 1.25,
    },
    commodities: 4,
    expansion: "BASE",
    name: "Embers of Muaat",
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
  },
  "Emirates of Hacan": {
    colors: {
      Orange: 0.7,
      Yellow: 1.2,
    },
    commodities: 6,
    expansion: "BASE",
    name: "Emirates of Hacan",
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
  },
  Empyrean: {
    colors: {
      Magenta: 0.15,
      Purple: 1.6,
      Red: 0.15,
    },
    commodities: 4,
    expansion: "POK",
    name: "Empyrean",
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
  },
  "Federation of Sol": {
    colors: {
      Blue: 1.15,
      Yellow: 0.75,
    },
    commodities: 4,
    expansion: "BASE",
    name: "Federation of Sol",
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
  },
  "Ghosts of Creuss": {
    colors: {
      Black: 0.1,
      Blue: 1.7,
      Purple: 0.1,
    },
    commodities: 4,
    expansion: "BASE",
    name: "Ghosts of Creuss",
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
  },
  "L1Z1X Mindnet": {
    colors: {
      Black: 0.7,
      Blue: 0.6,
      Red: 0.6,
    },
    commodities: 2,
    expansion: "BASE",
    name: "L1Z1X Mindnet",
    shortname: "L1Z1X",
    startswith: {
      planets: ["[0.0.0]"],
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
  },
  "Mahact Gene-Sorcerers": {
    colors: {
      Purple: 0.3,
      Yellow: 1.6,
    },
    commodities: 3,
    expansion: "POK",
    name: "Mahact Gene-Sorcerers",
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
  },
  "Mentak Coalition": {
    colors: {
      Black: 0.5,
      Orange: 0.95,
      Yellow: 0.45,
    },
    commodities: 2,
    expansion: "BASE",
    name: "Mentak Coalition",
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
  },
  "Naalu Collective": {
    colors: {
      Green: 1.15,
      Orange: 0.3,
      Yellow: 0.45,
    },
    commodities: 3,
    expansion: "BASE",
    name: "Naalu Collective",
    shortname: "Naalu",
    startswith: {
      planets: ["Druua", "Maaluuk"],
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
  },
  "Naaz-Rokha Alliance": {
    colors: {
      Green: 1.6,
      Yellow: 0.3,
    },
    commodities: 3,
    expansion: "POK",
    name: "Naaz-Rokha Alliance",
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
  },
  "Nekro Virus": {
    colors: {
      Black: 0.15,
      Red: 1.75,
    },
    commodities: 3,
    expansion: "BASE",
    name: "Nekro Virus",
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
  },
  Nomad: {
    colors: {
      Blue: 1.25,
      Purple: 0.65,
    },
    commodities: 4,
    expansion: "POK",
    name: "Nomad",
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
  },
  "Sardakk N'orr": {
    colors: {
      Black: 1,
      Red: 0.9,
    },
    commodities: 3,
    expansion: "BASE",
    name: "Sardakk N'orr",
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
  },
  "Titans of Ul": {
    colors: {
      Magenta: 1.9,
    },
    commodities: 2,
    expansion: "POK",
    name: "Titans of Ul",
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
  },
  "Universities of Jol-Nar": {
    colors: {
      Blue: 1.6,
      Purple: 0.3,
    },
    commodities: 4,
    expansion: "BASE",
    name: "Universities of Jol-Nar",
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
  },
  "Vuil'raith Cabal": {
    colors: {
      Black: 0.4,
      Magenta: 0.1,
      Red: 1.35,
    },
    commodities: 2,
    expansion: "POK",
    name: "Vuil'raith Cabal",
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
  },
  Winnu: {
    colors: {
      Orange: 0.75,
      Purple: 0.6,
      Yellow: 0.55,
    },
    commodities: 3,
    expansion: "BASE",
    name: "Winnu",
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
  },
  "Xxcha Kingdom": {
    colors: {
      Blue: 0.8,
      Green: 1.1,
    },
    commodities: 4,
    expansion: "BASE",
    name: "Xxcha Kingdom",
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
  },
  "Yin Brotherhood": {
    colors: {
      Black: 0.6,
      Purple: 1.05,
      Yellow: 0.25,
    },
    commodities: 2,
    expansion: "BASE",
    name: "Yin Brotherhood",
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
  },
  "Yssaril Tribes": {
    colors: {
      Black: 0.1,
      Green: 0.93,
      Red: 0.25,
      Yellow: 0.63,
    },
    commodities: 3,
    expansion: "BASE",
    name: "Yssaril Tribes",
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
  },
  ...DISCORDANT_STARS_FACTIONS,
};
