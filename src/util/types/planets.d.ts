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
  | "victory-point"
  // Discordant Stars
  | "extra-votes"
  | "production"
  | "infantry";

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
  system?: SystemId;
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
  | "Abyz"
  | "Arc Prime"
  | "Archon Ren"
  | "Archon Tau"
  | "Arinam"
  | "Arnor"
  | "Arretze"
  | "Bereg"
  | "Centauri"
  | "Corneeq"
  | "Creuss"
  | "Dal Bootha"
  | "Darien"
  | "Druaa"
  | "Fria"
  | "Gral"
  | "Hercant"
  | "Jol"
  | "Jord"
  | "Kamdorn"
  | "Lazar"
  | "Lirta IV"
  | "Lisis II"
  | "Lodor"
  | "Lor"
  | "Maaluuk"
  | "Mecatol Rex"
  | "Meer"
  | "Mehar Xull"
  | "Mellon"
  | "Moll Primus"
  | "Mordai II"
  | "Muaat"
  | "Nar"
  | "Nestphar"
  | "New Albion"
  | "Quann"
  | "Qucen'n"
  | "Quinarra"
  | "Ragh"
  | "Rarron"
  | "Resculon"
  | "Retillion"
  | "Sakulag"
  | "Saudor"
  | "Shalloq"
  | "Starpoint"
  | "Tar'Mann"
  | "Tequ'ran"
  | "Thibah"
  | "Torkan"
  | "Tren'lak"
  | "Vefut II"
  | "Wellon"
  | "Winnu"
  | "Wren Terra"
  | "Xxehan"
  | "Zohbat"
  | ProphecyOfKings.PlanetId
  | CodexThree.PlanetId
  | DiscordantStars.PlanetId;
