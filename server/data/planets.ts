import { BasePlanet } from "../../src/util/api/planets";

export type PlanetId =
  | "000"
  | "Abaddon"
  | "Abyz"
  | "Accoen"
  | "Acheron"
  | "Alio Prima"
  | "Ang"
  | "Arc Prime"
  | "Archon Ren"
  | "Archon Tau"
  | "Archon Vail"
  | "Arcturus"
  | "Arinam"
  | "Arnor"
  | "Arretze"
  | "Ashtroth"
  | "Atlas"
  | "Avar"
  | "Ba'kal"
  | "Bereg"
  | "Cealdri"
  | "Centauri"
  | "Cormund"
  | "Corneeq"
  | "Creuss"
  | "Custodia Vigilia"
  | "Dal Bootha"
  | "Darien"
  | "Druaa"
  | "Elysium"
  | "Everra"
  | "Fria"
  | "Gral"
  | "Hercant"
  | "Hope's End"
  | "Ixth"
  | "Jeol Ir"
  | "Jol"
  | "Jord"
  | "Kamdorn"
  | "Kraag"
  | "Lazar"
  | "Lirta IV"
  | "Lisis"
  | "Lisis II"
  | "Lodor"
  | "Loki"
  | "Lor"
  | "Maaluuk"
  | "Mallice"
  | "Mecatol Rex"
  | "Meer"
  | "Mehar Xull"
  | "Mellon"
  | "Mirage"
  | "Moll Primus"
  | "Mordai II"
  | "Muaat"
  | "Naazir"
  | "Nar"
  | "Nestphar"
  | "New Albion"
  | "Perimeter"
  | "Primor"
  | "Quann"
  | "Qucen'n"
  | "Quinarra"
  | "Ragh"
  | "Rarron"
  | "Resculon"
  | "Retillion"
  | "Rigel I"
  | "Rigel II"
  | "Rigel III"
  | "Rokha"
  | "Sakulag"
  | "Saudor"
  | "Sem-Lore"
  | "Shalloq"
  | "Siig"
  | "Starpoint"
  | "Tar'Mann"
  | "Tequ'ran"
  | "The Dark"
  | "Thibah"
  | "Torkan"
  | "Tren'Lak"
  | "Valk"
  | "Vefut II"
  | "Vega Major"
  | "Vega Minor"
  | "Velnor"
  | "Vorhal"
  | "Wellon"
  | "Winnu"
  | "Wren Terra"
  | "Xanhact"
  | "Xxehan"
  | "Ylir"
  | "Zohbat";

export const BASE_PLANETS: Record<PlanetId, BasePlanet> = {
  "000": {
    attributes: [],
    expansion: "BASE",
    faction: "L1Z1X Mindnet",
    home: true,
    influence: 0,
    name: "[0.0.0]",
    resources: 5,
    type: "NONE",
  },
  Abaddon: {
    attributes: [],
    expansion: "POK",
    influence: 0,
    name: "Abaddon",
    resources: 1,
    system: 75,
    type: "CULTURAL",
  },
  Abyz: {
    attributes: [],
    expansion: "BASE",
    influence: 0,
    name: "Abyz",
    resources: 3,
    system: 38,
    type: "HAZARDOUS",
  },
  Accoen: {
    attributes: [],
    expansion: "POK",
    influence: 3,
    name: "Accoen",
    resources: 2,
    system: 69,
    type: "INDUSTRIAL",
  },
  Acheron: {
    attributes: [],
    expansion: "POK",
    faction: "Vuil'Raith Cabal",
    home: true,
    influence: 0,
    name: "Acheron",
    resources: 4,
    type: "NONE",
  },
  "Alio Prima": {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Alio Prima",
    resources: 1,
    system: 71,
    type: "CULTURAL",
  },
  Ang: {
    attributes: ["red-skip"],
    expansion: "POK",
    influence: 0,
    name: "Ang",
    resources: 2,
    system: 61,
    type: "INDUSTRIAL",
  },
  "Arc Prime": {
    attributes: [],
    expansion: "BASE",
    faction: "Barony of Letnev",
    home: true,
    influence: 0,
    name: "Arc Prime",
    resources: 4,
    type: "NONE",
  },
  "Archon Ren": {
    attributes: [],
    expansion: "BASE",
    faction: "Xxcha Kingdom",
    home: true,
    influence: 3,
    name: "Archon Ren",
    resources: 2,
    type: "NONE",
  },
  "Archon Tau": {
    attributes: [],
    expansion: "BASE",
    faction: "Xxcha Kingdom",
    home: true,
    influence: 1,
    name: "Archon Tau",
    resources: 1,
    type: "NONE",
  },
  "Archon Vail": {
    attributes: ["blue-skip"],
    expansion: "POK",
    influence: 3,
    name: "Archon Vail",
    resources: 1,
    system: 59,
    type: "HAZARDOUS",
  },
  Arcturus: {
    attributes: [],
    expansion: "POK",
    faction: "Nomad",
    home: true,
    influence: 4,
    name: "Arcturus",
    resources: 4,
    type: "NONE",
  },
  Arinam: {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Arinam",
    resources: 1,
    system: 37,
    type: "INDUSTRIAL",
  },
  Arnor: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "ARNOR",
    resources: 2,
    system: 36,
    type: "INDUSTRIAL",
  },
  Arretze: {
    attributes: [],
    expansion: "BASE",
    faction: "Emirates of Hacan",
    home: true,
    influence: 0,
    name: "Arretze",
    resources: 2,
    type: "NONE",
  },
  Ashtroth: {
    attributes: [],
    expansion: "POK",
    influence: 0,
    name: "Ashtroth",
    resources: 2,
    system: 75,
    type: "HAZARDOUS",
  },
  Atlas: {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Atlas",
    resources: 3,
    system: 64,
    type: "HAZARDOUS",
  },
  Avar: {
    attributes: [],
    expansion: "POK",
    faction: "Argent Flight",
    home: true,
    influence: 1,
    name: "Avar",
    resources: 1,
    type: "NONE",
  },
  "Ba'kal": {
    attributes: [],
    expansion: "POK",
    influence: 2,
    name: "Ba'kal",
    resources: 3,
    system: 71,
    type: "INDUSTRIAL",
  },
  Bereg: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "Bereg",
    resources: 3,
    system: 35,
    type: "HAZARDOUS",
  },
  Cealdri: {
    attributes: ["yellow-skip"],
    expansion: "POK",
    influence: 2,
    name: "Cealdri",
    resources: 0,
    system: 73,
    type: "CULTURAL",
  },
  Centauri: {
    attributes: [],
    expansion: "BASE",
    influence: 3,
    name: "Centauri",
    resources: 1,
    system: 34,
    type: "CULTURAL",
  },
  Cormund: {
    attributes: [],
    expansion: "POK",
    influence: 0,
    name: "Cormund",
    resources: 2,
    system: 67,
    type: "HAZARDOUS",
  },
  Corneeq: {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Corneeq",
    resources: 1,
    system: 33,
    type: "CULTURAL",
  },
  Creuss: {
    attributes: [],
    expansion: "BASE",
    faction: "Ghosts of Creuss",
    home: true,
    influence: 2,
    name: "Creuss",
    resources: 4,
    type: "NONE",
  },
  "Custodia Vigilia": {
    ability:
      "While you control Mecatol Rex, it gains SPACE CANNON 5 and PRODUCTION 3.\n\nGain 2 command tokens when another player scores Victory Points using Imperial",
    attributes: ["legendary"],
    expansion: "CODEX THREE",
    faction: "Council Keleres",
    influence: 3,
    locked: true,
    name: "Custodia Vigilia",
    resources: 2,
    type: "NONE",
  },
  "Dal Bootha": {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Dal Bootha",
    resources: 0,
    system: 32,
    type: "CULTURAL",
  },
  Darien: {
    attributes: [],
    expansion: "BASE",
    faction: "Yin Brotherhood",
    home: true,
    influence: 4,
    name: "Darien",
    resources: 4,
    type: "NONE",
  },
  Druaa: {
    attributes: [],
    expansion: "BASE",
    faction: "Naalu Collective",
    home: true,
    influence: 1,
    name: "Druaa",
    resources: 3,
    type: "NONE",
  },
  Elysium: {
    attributes: [],
    expansion: "POK",
    faction: "Titans of Ul",
    home: true,
    influence: 1,
    name: "Elysium",
    resources: 4,
    type: "NONE",
  },
  Everra: {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Everra",
    resources: 3,
    system: 68,
    type: "CULTURAL",
  },
  Fria: {
    attributes: [],
    expansion: "BASE",
    influence: 0,
    name: "Fria",
    resources: 2,
    system: 38,
    type: "HAZARDOUS",
  },
  Gral: {
    attributes: ["blue-skip"],
    expansion: "BASE",
    influence: 1,
    name: "Gral",
    resources: 1,
    system: 34,
    type: "INDUSTRIAL",
  },
  Hercant: {
    attributes: [],
    expansion: "BASE",
    faction: "Emirates of Hacan",
    home: true,
    influence: 1,
    name: "Hercant",
    resources: 1,
    type: "NONE",
  },
  "Hope's End": {
    ability:
      "You may exhaust this card at the end of your turn to place 1 mech from your reinforcements on any planet you control, or draw 1 action card",
    attributes: ["legendary"],
    expansion: "POK",
    influence: 0,
    name: "Hope's End",
    resources: 3,
    system: 66,
    type: "HAZARDOUS",
  },
  Ixth: {
    attributes: [],
    expansion: "POK",
    faction: "Mahact Gene-Sorcerers",
    home: true,
    influence: 5,
    name: "Ixth",
    resources: 3,
    type: "NONE",
  },
  "Jeol Ir": {
    attributes: [],
    expansion: "POK",
    influence: 3,
    name: "Jeol Ir",
    resources: 2,
    system: 69,
    type: "INDUSTRIAL",
  },
  Jol: {
    attributes: [],
    expansion: "BASE",
    faction: "Universities of Jol-Nar",
    home: true,
    influence: 2,
    name: "Jol",
    resources: 1,
    type: "NONE",
  },
  Jord: {
    attributes: [],
    expansion: "BASE",
    faction: "Federation of Sol",
    home: true,
    influence: 2,
    name: "Jord",
    resources: 4,
    type: "NONE",
  },
  Kamdorn: {
    attributes: [],
    expansion: "BASE",
    faction: "Emirates of Hacan",
    influence: 1,
    name: "Kamdorn",
    resources: 0,
    type: "NONE",
  },
  Kraag: {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Kraag",
    resources: 2,
    system: 70,
    type: "HAZARDOUS",
  },
  Lazar: {
    attributes: ["yellow-skip"],
    expansion: "BASE",
    influence: 0,
    name: "Lazar",
    resources: 1,
    system: 31,
    type: "INDUSTRIAL",
  },
  "Lirta IV": {
    attributes: [],
    expansion: "BASE",
    influence: 3,
    name: "Lirta IV",
    resources: 2,
    system: 35,
    type: "HAZARDOUS",
  },
  Lisis: {
    attributes: [],
    expansion: "POK",
    influence: 2,
    name: "Lisis",
    resources: 2,
    system: 72,
    type: "INDUSTRIAL",
  },
  "Lisis II": {
    attributes: [],
    expansion: "BASE",
    faction: "Clan of Saar",
    influence: 0,
    name: "Lisis II",
    resources: 1,
    type: "NONE",
  },
  Lodor: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "Lodor",
    resources: 3,
    system: 26,
    type: "CULTURAL",
  },
  Loki: {
    attributes: [],
    expansion: "POK",
    influence: 2,
    name: "Loki",
    resources: 1,
    system: 75,
    type: "CULTURAL",
  },
  Lor: {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Lor",
    resources: 1,
    system: 36,
    type: "INDUSTRIAL",
  },
  Maaluuk: {
    attributes: [],
    expansion: "BASE",
    faction: "Naalu Collective",
    home: true,
    influence: 2,
    name: "Maaluuk",
    resources: 0,
    type: "NONE",
  },
  Mallice: {
    ability:
      "You may exhaust this card at the end of your turn to gain 2 trade goods or convert all of your commodities into trade goods",
    attributes: ["legendary"],
    expansion: "POK",
    influence: 3,
    name: "Mallice",
    resources: 0,
    type: "CULTURAL",
  },
  "Mecatol Rex": {
    attributes: [],
    expansion: "BASE",
    influence: 6,
    name: "Mecatol Rex",
    resources: 1,
    type: "NONE",
  },
  Meer: {
    attributes: ["red-skip"],
    expansion: "BASE",
    influence: 4,
    name: "Meer",
    resources: 0,
    system: 37,
    type: "HAZARDOUS",
  },
  "Mehar Xull": {
    attributes: ["red-skip"],
    expansion: "BASE",
    influence: 3,
    name: "Mehar Xull",
    resources: 1,
    system: 24,
    type: "HAZARDOUS",
  },
  Mellon: {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Mellon",
    resources: 0,
    system: 30,
    type: "CULTURAL",
  },
  Mirage: {
    ability:
      "You may exhaust this card at the end of your turn to place up to 2 fighters from your reinforcements in any system that contains 1 or more of your ships",
    attributes: ["legendary"],
    expansion: "POK",
    influence: 2,
    name: "Mirage",
    resources: 1,
    type: "CULTURAL",
  },
  "Moll Primus": {
    attributes: [],
    expansion: "BASE",
    faction: "Mentak Coalition",
    home: true,
    influence: 1,
    name: "Moll Primus",
    resources: 4,
    type: "NONE",
  },
  "Mordai II": {
    attributes: [],
    expansion: "BASE",
    faction: "Nekro Virus",
    home: true,
    influence: 0,
    name: "Mordai II",
    resources: 4,
    type: "NONE",
  },
  Muaat: {
    attributes: [],
    expansion: "BASE",
    faction: "Embers of Muaat",
    home: true,
    influence: 1,
    name: "Muaat",
    resources: 4,
    type: "NONE",
  },
  Naazir: {
    attributes: [],
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    home: true,
    influence: 1,
    name: "Naazir",
    resources: 2,
    type: "NONE",
  },
  Nar: {
    attributes: [],
    expansion: "BASE",
    faction: "Universities of Jol-Nar",
    home: true,
    influence: 3,
    name: "Nar",
    resources: 2,
    type: "NONE",
  },
  Nestphar: {
    attributes: [],
    expansion: "BASE",
    faction: "Arborec",
    home: true,
    influence: 2,
    name: "Nestphar",
    resources: 3,
    type: "NONE",
  },
  "New Albion": {
    attributes: ["green-skip"],
    expansion: "BASE",
    influence: 1,
    name: "New Albion",
    resources: 1,
    system: 27,
    type: "INDUSTRIAL",
  },
  Perimeter: {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Perimeter",
    resources: 2,
    system: 60,
    type: "INDUSTRIAL",
  },
  Primor: {
    ability:
      "You may exhaust this card at the end of your turn to place up to 2 infantry from your reinforcements on any planet you control",
    attributes: ["legendary"],
    expansion: "POK",
    influence: 1,
    name: "Primor",
    resources: 2,
    system: 65,
    type: "CULTURAL",
  },
  Quann: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "Quann",
    resources: 2,
    system: 25,
    type: "CULTURAL",
  },
  "Qucen'n": {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Qucen'n",
    resources: 1,
    system: 29,
    type: "INDUSTRIAL",
  },
  Quinarra: {
    attributes: [],
    expansion: "BASE",
    faction: "Sardakk N'orr",
    home: true,
    influence: 1,
    name: "Quinarra",
    resources: 3,
    type: "NONE",
  },
  Ragh: {
    attributes: [],
    expansion: "BASE",
    faction: "Clan of Saar",
    influence: 1,
    name: "Ragh",
    resources: 2,
    type: "NONE",
  },
  Rarron: {
    attributes: [],
    expansion: "BASE",
    influence: 3,
    name: "Rarron",
    resources: 0,
    system: 29,
    type: "CULTURAL",
  },
  Resculon: {
    attributes: [],
    expansion: "BASE",
    influence: 0,
    name: "Resculon",
    resources: 2,
    system: 33,
    type: "CULTURAL",
  },
  Retillion: {
    attributes: [],
    expansion: "BASE",
    faction: "Yssaril Tribes",
    home: true,
    influence: 3,
    name: "Retillion",
    resources: 2,
    type: "NONE",
  },
  "Rigel I": {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Rigel I",
    resources: 0,
    system: 76,
    type: "HAZARDOUS",
  },
  "Rigel II": {
    attributes: [],
    expansion: "POK",
    influence: 2,
    name: "Rigel II",
    resources: 1,
    system: 76,
    type: "INDUSTRIAL",
  },
  "Rigel III": {
    attributes: ["green-skip"],
    expansion: "POK",
    influence: 1,
    name: "Rigel III",
    resources: 1,
    system: 76,
    type: "INDUSTRIAL",
  },
  Rokha: {
    attributes: [],
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    home: true,
    influence: 2,
    name: "Rokha",
    resources: 1,
    type: "NONE",
  },
  Sakulag: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "Sakulag",
    resources: 2,
    system: 31,
    type: "HAZARDOUS",
  },
  Saudor: {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Saudor",
    resources: 2,
    system: 23,
    type: "INDUSTRIAL",
  },
  "Sem-Lore": {
    attributes: ["yellow-skip"],
    expansion: "POK",
    influence: 2,
    name: "Sem-Lore",
    resources: 3,
    system: 62,
    type: "CULTURAL",
  },
  Shalloq: {
    attributes: [],
    expansion: "BASE",
    faction: "Yssaril Tribes",
    home: true,
    influence: 2,
    name: "Shalloq",
    resources: 1,
    type: "NONE",
  },
  Siig: {
    attributes: [],
    expansion: "POK",
    influence: 2,
    name: "Siig",
    resources: 0,
    system: 70,
    type: "HAZARDOUS",
  },
  Starpoint: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "Starpoint",
    resources: 3,
    system: 27,
    type: "HAZARDOUS",
  },
  "Tar'Mann": {
    attributes: ["green-skip"],
    expansion: "BASE",
    influence: 1,
    name: "Tar'Mann",
    resources: 1,
    system: 22,
    type: "INDUSTRIAL",
  },
  "Tequ'ran": {
    attributes: [],
    expansion: "BASE",
    influence: 0,
    name: "Tequ'ran",
    resources: 2,
    system: 28,
    type: "HAZARDOUS",
  },
  "The Dark": {
    attributes: [],
    expansion: "POK",
    faction: "Empyrean",
    home: true,
    influence: 4,
    name: "The Dark",
    resources: 3,
    type: "NONE",
  },
  Thibah: {
    attributes: ["blue-skip"],
    expansion: "BASE",
    influence: 1,
    name: "Thibah",
    resources: 1,
    system: 21,
    type: "INDUSTRIAL",
  },
  Torkan: {
    attributes: [],
    expansion: "BASE",
    influence: 3,
    name: "Torkan",
    resources: 0,
    system: 28,
    type: "CULTURAL",
  },
  "Tren'Lak": {
    attributes: [],
    expansion: "BASE",
    faction: "Sardakk N'orr",
    home: true,
    influence: 0,
    name: "Tren'Lak",
    resources: 1,
    type: "NONE",
  },
  Valk: {
    attributes: [],
    expansion: "POK",
    faction: "Argent Flight",
    home: true,
    influence: 0,
    name: "Valk",
    resources: 2,
    type: "NONE",
  },
  "Vefut II": {
    attributes: [],
    expansion: "BASE",
    influence: 2,
    name: "Vefut II",
    resources: 2,
    system: 20,
    type: "HAZARDOUS",
  },
  "Vega Major": {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Vega Major",
    resources: 2,
    system: 74,
    type: "CULTURAL",
  },
  "Vega Minor": {
    attributes: ["blue-skip"],
    expansion: "POK",
    influence: 2,
    name: "Vega Minor",
    resources: 1,
    system: 74,
    type: "CULTURAL",
  },
  Velnor: {
    attributes: ["red-skip"],
    expansion: "POK",
    influence: 1,
    name: "Velnor",
    resources: 2,
    system: 72,
    type: "INDUSTRIAL",
  },
  Vorhal: {
    attributes: ["green-skip"],
    expansion: "POK",
    influence: 2,
    name: "Vorhal",
    resources: 0,
    system: 63,
    type: "CULTURAL",
  },
  Wellon: {
    attributes: ["yellow-skip"],
    expansion: "BASE",
    influence: 2,
    name: "Wellon",
    resources: 1,
    system: 19,
    type: "INDUSTRIAL",
  },
  Winnu: {
    attributes: [],
    expansion: "BASE",
    faction: "Winnu",
    home: true,
    influence: 4,
    name: "Winnu",
    resources: 3,
    type: "NONE",
  },
  "Wren Terra": {
    attributes: [],
    expansion: "BASE",
    faction: "Barony of Letnev",
    home: true,
    influence: 1,
    name: "Wren Terra",
    resources: 2,
    type: "NONE",
  },
  Xanhact: {
    attributes: [],
    expansion: "POK",
    influence: 1,
    name: "Xanhact",
    resources: 0,
    system: 73,
    type: "HAZARDOUS",
  },
  Xxehan: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "Xxehan",
    resources: 1,
    system: 32,
    type: "CULTURAL",
  },
  Ylir: {
    attributes: [],
    expansion: "POK",
    faction: "Argent Flight",
    home: true,
    influence: 2,
    name: "Ylir",
    resources: 0,
    type: "NONE",
  },
  Zohbat: {
    attributes: [],
    expansion: "BASE",
    influence: 1,
    name: "Zohbat",
    resources: 3,
    system: 30,
    type: "HAZARDOUS",
  },
};
