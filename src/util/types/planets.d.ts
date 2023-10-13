type PlanetAttribute =
  | "legendary"
  | "red-skip"
  | "yellow-skip"
  | "blue-skip"
  | "green-skip"
  | "demilitarized"
  | "tomb"
  | "space-cannon"
  | "all-types"
  | "victory-point";

type PlanetType = "INDUSTRIAL" | "CULTURAL" | "HAZARDOUS" | "ALL" | "NONE";

type PlanetUpdateAction =
  | "ADD_PLANET"
  | "REMOVE_PLANET"
  | "ADD_ATTACHMENT"
  | "REMOVE_ATTACHMENT"
  | "PURGE_PLANET"
  | "UNPURGE_PLANET";

interface PlanetUpdateData {
  action?: PlanetUpdateAction;
  attachment?: string;
  faction?: FactionId;
  planet?: string;
  timestamp?: number;
}

interface BasePlanet {
  expansion: Expansion;
  ability?: string;
  attributes: PlanetAttribute[];
  faction?: FactionId;
  home?: boolean;
  id: PlanetId;
  influence: number;
  locked?: boolean;
  name: string;
  position?: { x: number; y: number };
  resources: number;
  subFaction?: SubFaction;
  system?: number;
  type: PlanetType;
}

interface GamePlanet {
  owner?: FactionId;
  ready?: boolean;
  state?: PlanetState;
  attachments?: AttachmentId[];
}

type Planet = BasePlanet & GamePlanet;

type PlanetId =
  | "000"
  | "Abaddon"
  | "Abyz"
  | "Accoen"
  | "Acheron"
  | "Alio Prima"
  | "Ang"
  | "Arc Prime"
  | "Archon Ren"
  | "Archon Ren Keleres"
  | "Archon Tau"
  | "Archon Tau Keleres"
  | "Archon Vail"
  | "Arcturus"
  | "Arinam"
  | "Arnor"
  | "Arretze"
  | "Ashtroth"
  | "Atlas"
  | "Avar"
  | "Avar Keleres"
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
  | "Moll Primus Keleres"
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
  | "Tren'lak"
  | "Valk"
  | "Valk Keleres"
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
  | "Ylir Keleres"
  | "Zohbat"
  | DiscordantStars.PlanetId;
