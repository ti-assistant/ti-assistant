import { Optional } from "./types/types";
import { objectKeys } from "./util";

export function isHomeSystem(systemNumber?: string) {
  if (!systemNumber) {
    return false;
  }
  return systemNumber.match(/^P[1-8]$/);
}

export function isFactionHomeSystem(systemNumber: string) {
  const systemId = parseInt(systemNumber);
  if (systemId > 0 && systemId < 18) {
    return true;
  }
  if (systemId > 50 && systemId < 59) {
    return true;
  }
  if (systemId > 99 && systemId < 103) {
    return true;
  }
  if (systemId > 1000 && systemId < 1011) {
    return true;
  }
  if (systemId > 1011 && systemId < 1034) {
    return true;
  }
  return false;
}

export function getDefaultMapString(
  numFactions: number,
  mapStyle: MapStyle,
  thundersEdge: boolean
) {
  const mecatolSystem = thundersEdge ? "112 " : "18 ";
  switch (numFactions) {
    case 3:
      return (
        mecatolSystem +
        "0 0 0 0 0 0 " +
        "0 0 0 0 0 0 0 0 0 0 0 0 " +
        "-1 -1 0 P1 0 -1 -1 -1 0 P2 0 -1 -1 -1 0 P3 0 -1"
      );
    case 4:
      switch (mapStyle) {
        case "standard":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 P1 0 0 0 P2 0 0 0 0 P3 0 0 0 P4"
          );
        case "skinny":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "-1 0 P1 -1 -1 -1 -1 P2 0 -1 0 P3 -1 -1 -1 -1 P4 0"
          );
        case "warp":
          return (
            mecatolSystem +
            "85A3 0 0 85A 0 0 " +
            "0 87A3 0 0 0 88A 0 87A 0 0 0 88A3 " +
            "86A3 84A3 0 P1 0 0 P2 0 83A 86A 84A 0 P3 0 0 P4 0 83A3"
          );
      }
      break;
    case 5:
      switch (mapStyle) {
        case "standard":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 P1 0 0 0 P2 0 0 P3 0 0 P4 0 0 0 P5 0"
          );
        case "skinny":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 P1 -1 0 P2 -1 -1 0 P3 0 -1 -1 P4 0 -1 P5 0"
          );
        case "warp":
          return (
            mecatolSystem +
            "0 0 0 85A 0 0 " +
            "0 0 0 0 0 88A 0 87A 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 83A 86A 84A 0 P4 0 0 P5 0 0"
          );
      }
      break;
    case 6:
      switch (mapStyle) {
        case "standard":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0"
          );
        case "large":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 0 P2 0 0 0 P3 0 0 0 P4 0 0 0 P5 0 0 0 P6 0 0 0"
          );
      }
      break;
    case 7:
      switch (mapStyle) {
        case "standard":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 85A 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 88A 0 87A 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 83A 86A 84A 0 P5 0 0 P6 0 0 P7 0 0"
          );
        case "warp":
          return (
            mecatolSystem +
            "85B 0 0 84B 90B 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 88B3 0 P2 0 0 P3 0 86B 0 0 0 0 0 83B2 0 0 0 " +
            "P1 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 P4 0 0 P5 -1 -1 P6 0 -1 P7 0 0"
          );
      }
      break;
    case 8:
      switch (mapStyle) {
        case "standard":
          return (
            mecatolSystem +
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0 P7 0 0 P8 0 0"
          );
        case "warp":
          return (
            mecatolSystem +
            "87A1 90B3 0 88A2 89B 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 85B2 0 0 0 0 0 0 0 0 83B2 0 0 0 " +
            "P1 0 0 P2 -1 -1 P3 0 -1 P4 0 0 P5 0 0 P6 -1 -1 P7 0 -1 P8 0 0"
          );
      }
      break;
  }
  return (
    mecatolSystem +
    "0 0 0 0 0 0 " +
    "0 0 0 0 0 0 0 0 0 0 0 0 " +
    "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0"
  );
}

export function isValidMapString(mapString: string, numFactions: number) {
  let numFactionSystems = 0;
  const systems = mapString.split(" ");
  for (const system of systems) {
    if (!validSystemNumber(system)) {
      return false;
    }
    if (isHomeSystem(system)) {
      numFactionSystems++;
    }
  }
  if (numFactionSystems !== numFactions) {
    return false;
  }
  return true;
}

export function validSystemNumber(number: string) {
  if (number === "") {
    return true;
  }
  let intVal = parseInt(number);
  if (isNaN(intVal)) {
    return isHomeSystem(number);
  }
  if (intVal < -1) {
    return false;
  }
  if (intVal > 4276) {
    return false;
  }
  if (intVal > 4252) {
    return true;
  }
  if (intVal > 1060) {
    return false;
  }
  if (intVal > 1000) {
    return true;
  }
  // The Fracture fake systems.
  if (intVal > 668) {
    return false;
  }
  if (intVal > 665) {
    return true;
  }
  if (intVal === 299) {
    return true;
  }
  // Council Keleres home systems
  if (intVal > 202) {
    return false;
  }
  if (intVal > 199) {
    return true;
  }
  if (intVal > 124) {
    return false;
  }

  return true;
}

export function updateMapString(
  mapString: string,
  mapStyle: MapStyle,
  numFactions: number,
  thundersEdge: boolean
) {
  const defaultMapString = getDefaultMapString(
    numFactions,
    mapStyle,
    thundersEdge
  );
  let updatedMapString =
    mapString !== ""
      ? mergeMapStrings(mapString, defaultMapString)
      : defaultMapString;

  if (!isValidMapString(updatedMapString, numFactions)) {
    let currentNum = numFactions;
    const tiles = updatedMapString.split(" ");
    for (let i = tiles.length - 1; i > 0; i--) {
      if (tiles[i] === "0") {
        tiles[i] = `P${currentNum}`;
        currentNum--;
        if (currentNum < 1) {
          break;
        }
      }
    }
    updatedMapString = tiles.join(" ");
    if (!isValidMapString(updatedMapString, numFactions)) {
      updatedMapString = mergeMapStrings(defaultMapString, mapString);
    }
  }
  return updatedMapString;
}

function mergeMapStrings(a: string, b: string) {
  let output = [];
  const aArray = a.split(" ");
  const bArray = b.split(" ");
  for (let i = 0; i < aArray.length; i++) {
    const aValue = aArray[i];
    const bValue = bArray[i];
    output.push(mapValuePriority(aValue, bValue));
  }
  return output.join(" ");
}

function mapValuePriority(a?: string, b?: string) {
  if (!a) {
    if (!b) {
      return a;
    }
    return b;
  }
  if (!b) {
    return a;
  }
  if (a === "0") {
    return b;
  }
  if (b === "0") {
    return a;
  }
  return a;
}

export function processMapString(
  mapString: string,
  mapStyle: MapStyle,
  numFactions: number,
  thundersEdge: boolean
) {
  if (!allSystemsValid(mapString)) {
    return getDefaultMapString(numFactions, mapStyle, thundersEdge);
  }
  if (allSystemsValid(mapString) && hasHomeSystems(mapString, numFactions)) {
    return makeHomeSystemsExplicit(
      maybeAddMecatol(mapString, thundersEdge),
      numFactions
    );
  }
  const updated = updateMapString(
    maybeAddMecatol(mapString, thundersEdge),
    mapStyle,
    numFactions,
    thundersEdge
  );
  return updated;
}

function maybeAddMecatol(mapString: string, thundersEdge: boolean) {
  if (
    mapString.startsWith("112 ") ||
    mapString.startsWith("18 ") ||
    mapString.includes(" 112 ") ||
    mapString.includes(" 18 ")
  ) {
    return mapString;
  }
  const mecatolSystem = thundersEdge ? "112" : "18";
  return `${mecatolSystem} ${mapString}`;
}

function makeHomeSystemsExplicit(mapString: string, numFactions: number) {
  const systems = mapString.split(" ");
  let explicitHomeSystems = 0;
  let implicitHomeSystems = 0;
  for (const system of systems) {
    if (system === "0") {
      implicitHomeSystems++;
    }
    if (isHomeSystem(system)) {
      explicitHomeSystems++;
    }
  }

  if (explicitHomeSystems === numFactions) {
    return mapString;
  }

  let currentNum = 1;
  for (let i = 0; i < systems.length; ++i) {
    if (systems[i] === "0") {
      systems[i] = `P${currentNum}`;
      currentNum++;
    }
  }
  return systems.join(" ");
}

function allSystemsValid(mapString: string) {
  const systems = mapString.split(" ");
  for (const system of systems) {
    if (!validSystemNumber(system)) {
      return false;
    }
  }
  return true;
}

function hasHomeSystems(mapString: string, numFactions: number) {
  const systems = mapString.split(" ");
  let explicitHomeSystems = 0;
  let implicitHomeSystems = 0;
  for (const system of systems) {
    if (system === "0") {
      implicitHomeSystems++;
    }
    if (isHomeSystem(system)) {
      explicitHomeSystems++;
    }
  }

  if (explicitHomeSystems === numFactions) {
    return true;
  }

  return implicitHomeSystems === numFactions;
}

export function getWormholeNexusSystemNumber(
  options: Options,
  planets: Partial<Record<PlanetId, Planet>>,
  factions: Partial<Record<FactionId, Faction>>
) {
  if (!options.expansions.includes("POK")) {
    return undefined;
  }

  if (options.mallice) {
    if (!options.mallice.startsWith("P")) {
      return options.mallice;
    }
    const number = options.mallice.at(options.mallice.length - 1);
    if (!number) {
      return options.mallice;
    }
    const factionIndex = parseInt(number);
    const mapOrderedFactions = Object.values(factions).sort(
      (a, b) => a.mapPosition - b.mapPosition
    );
    return getFactionSystemNumber(mapOrderedFactions[factionIndex - 1]);
  }

  const mallice = planets["Mallice"];

  if (!mallice) {
    return "PURGED";
  }

  if (mallice.owner) {
    return "B";
  }

  return "A";
}

const FACTION_TO_SYSTEM_NUMBER: Partial<Record<FactionId, string>> = {
  "Federation of Sol": "1",
  "Mentak Coalition": "2",
  "Yin Brotherhood": "3",
  "Embers of Muaat": "4",
  Arborec: "5",
  "L1Z1X Mindnet": "6",
  Winnu: "7",
  "Nekro Virus": "8",
  "Naalu Collective": "9",
  "Barony of Letnev": "10",
  "Clan of Saar": "11",
  "Universities of Jol-Nar": "12",
  "Sardakk N'orr": "13",
  "Xxcha Kingdom": "14",
  "Yssaril Tribes": "15",
  "Emirates of Hacan": "16",
  "Ghosts of Creuss": "17",
  "Mahact Gene-Sorcerers": "52",
  Nomad: "53",
  "Vuil'raith Cabal": "54",
  "Titans of Ul": "55",
  Empyrean: "56",
  "Naaz-Rokha Alliance": "57",
  "Argent Flight": "58",
  "Council Keleres": "299",
  "Last Bastion": "92",
  "Ral Nel Consortium": "93",
  "Crimson Rebellion": "94",
  "Deepwrought Scholarate": "95",
  Firmament: "96A",
  Obsidian: "96B",
  // Discordant Stars
  "Augurs of Ilyxum": "1001",
  "Bentor Conglomerate": "1002",
  "Berserkers of Kjalengard": "1003",
  "Celdauri Trade Confederation": "1004",
  "Cheiran Hordes": "1005",
  "Dih-Mohn Flotilla": "1006",
  "Edyn Mandate": "1007",
  "Florzen Profiteers": "1008",
  "Free Systems Compact": "1009",
  "Ghemina Raiders": "1010",
  "Ghoti Wayfarers": "1011",
  "Gledge Union": "1012",
  "Glimmer of Mortheus": "1013",
  "Kollecc Society": "1014",
  "Kortali Tribunal": "1015",
  "Kyro Sodality": "1016",
  "Lanefir Remnants": "1017",
  "Li-Zho Dynasty": "1018",
  "L'tokk Khrask": "1019",
  "Mirveda Protectorate": "1020",
  "Monks of Kolume": "1021",
  "Myko-Mentori": "1022",
  "Nivyn Star Kings": "1023",
  "Nokar Sellships": "1024",
  "Olradin League": "1025",
  "Roh'Dhna Mechatronics": "1026",
  "Savages of Cymiae": "1027",
  "Shipwrights of Axis": "1028",
  "Tnelis Syndicate": "1029",
  "Vaden Banking Clans": "1030",
  "Vaylerian Scourge": "1031",
  "Veldyr Sovereignty": "1032",
  "Zealots of Rhodun": "1033",
  "Zelian Purifier": "1034",
} as const;

export function getFactionSystemNumber(
  faction: Optional<{
    id?: FactionId;
    name?: string;
    startswith?: {
      faction?: FactionId;
      planetFaction?: FactionId;
    };
  }>
) {
  if (!faction?.id) {
    return "299";
  }
  if (faction.startswith?.planetFaction) {
    return FACTION_TO_SYSTEM_NUMBER[faction.startswith.planetFaction] ?? "299";
  }
  if (faction.id === "Council Keleres") {
    switch (faction.startswith?.faction) {
      case "Argent Flight":
        return "201";
      case "Xxcha Kingdom":
        return "200";
      case "Mentak Coalition":
        return "202";
    }
    return "299";
  }
  return FACTION_TO_SYSTEM_NUMBER[faction.id] ?? "299";
}

const FACTION_TO_SYSTEM_ID: Partial<Record<FactionId, SystemId>> = {
  "Federation of Sol": 1,
  "Mentak Coalition": 2,
  "Yin Brotherhood": 3,
  "Embers of Muaat": 4,
  Arborec: 5,
  "L1Z1X Mindnet": 6,
  Winnu: 7,
  "Nekro Virus": 8,
  "Naalu Collective": 9,
  "Barony of Letnev": 10,
  "Clan of Saar": 11,
  "Universities of Jol-Nar": 12,
  "Sardakk N'orr": 13,
  "Xxcha Kingdom": 14,
  "Yssaril Tribes": 15,
  "Emirates of Hacan": 16,
  "Ghosts of Creuss": 17,
  "Mahact Gene-Sorcerers": 52,
  Nomad: 53,
  "Vuil'raith Cabal": 54,
  "Titans of Ul": 55,
  Empyrean: 56,
  "Naaz-Rokha Alliance": 57,
  "Argent Flight": 58,
  "Last Bastion": 92,
  "Ral Nel Consortium": 93,
  "Crimson Rebellion": 94,
  "Deepwrought Scholarate": 95,
  Firmament: "96A",
  Obsidian: "96B",
  // Discordant Stars
  "Augurs of Ilyxum": 1001,
  "Bentor Conglomerate": 1002,
  "Berserkers of Kjalengard": 1003,
  "Celdauri Trade Confederation": 1004,
  "Cheiran Hordes": 1005,
  "Dih-Mohn Flotilla": 1006,
  "Edyn Mandate": 1007,
  "Florzen Profiteers": 1008,
  "Free Systems Compact": 1009,
  "Ghemina Raiders": 1010,
  "Ghoti Wayfarers": 1011,
  "Gledge Union": 1012,
  "Glimmer of Mortheus": 1013,
  "Kollecc Society": 1014,
  "Kortali Tribunal": 1015,
  "Kyro Sodality": 1016,
  "Lanefir Remnants": 1017,
  "Li-Zho Dynasty": 1018,
  "L'tokk Khrask": 1019,
  "Mirveda Protectorate": 1020,
  "Monks of Kolume": 1021,
  "Myko-Mentori": 1022,
  "Nivyn Star Kings": 1023,
  "Nokar Sellships": 1024,
  "Olradin League": 1025,
  "Roh'Dhna Mechatronics": 1026,
  "Savages of Cymiae": 1027,
  "Shipwrights of Axis": 1028,
  "Tnelis Syndicate": 1029,
  "Vaden Banking Clans": 1030,
  "Vaylerian Scourge": 1031,
  "Veldyr Sovereignty": 1032,
  "Zealots of Rhodun": 1033,
  "Zelian Purifier": 1034,
} as const;

export function getFactionSystemId(faction: Faction): Optional<SystemId> {
  if (faction.startswith?.planetFaction) {
    return FACTION_TO_SYSTEM_ID[faction.startswith.planetFaction];
  }
  if (faction.id === "Council Keleres") {
    switch (faction.startswith?.faction) {
      case "Argent Flight":
        return 201;
      case "Xxcha Kingdom":
        return 200;
      case "Mentak Coalition":
        return 202;
    }
    return;
  }
  return FACTION_TO_SYSTEM_ID[faction.id];
}

export function extractFactionIds(
  mapString: string,
  mapStyle: MapStyle,
  numFactions: number,
  thundersEdge: boolean
) {
  const newSystems = mapString.split(" ");
  newSystems.unshift("18");
  const defaultMap = getDefaultMapString(numFactions, mapStyle, thundersEdge);

  const SYSTEMS_TO_FACTIONS: Record<string, FactionId> = {};
  objectKeys(FACTION_TO_SYSTEM_NUMBER).forEach((key) => {
    const systemNumber = FACTION_TO_SYSTEM_NUMBER[key];
    if (!systemNumber) {
      return;
    }
    SYSTEMS_TO_FACTIONS[systemNumber] = key;
  });

  const factions: Record<number, FactionId> = {};
  defaultMap.split(" ").forEach((system, index) => {
    if (!isHomeSystem(system)) {
      return;
    }

    const newSystem = newSystems[index];
    if (!newSystem) {
      return;
    }
    const factionId = SYSTEMS_TO_FACTIONS[newSystem];
    if (!factionId) {
      return;
    }

    const factionNum = parseInt(system.slice(-1));
    if (!factionNum || isNaN(factionNum)) {
      return;
    }

    factions[factionNum - 1] = factionId;
  });

  if (numFactions !== Object.keys(factions).length) {
    return;
  }
  return factions;
}
