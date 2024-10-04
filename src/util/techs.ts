import { hasTech } from "./api/techs";
import { Optional } from "./types/types";

export function getTechColor(tech: Tech) {
  return getTechTypeColor(tech.type);
}

export function getTechTypeColor(type: TechType) {
  switch (type) {
    case "RED":
      return "indianred";
    case "YELLOW":
      return "gold";
    case "BLUE":
      return "cornflowerblue";
    case "GREEN":
      return "seagreen";
  }
  return "#eee";
}

/**
 * Gets all the techs owned by a specific faction.
 */
export function filterToOwnedTechs(
  techs: Partial<Record<TechId, Tech>>,
  faction: Faction
) {
  return Object.values(techs).filter((tech) => {
    return !!hasTech(faction, tech.id);
  });
}

/**
 * Gets all the techs not owned by a specific faction.
 */
export function filterToUnownedTechs(
  techs: Partial<Record<TechId, Tech>>,
  faction: Faction
) {
  return Object.values(techs).filter((tech) => {
    return !hasTech(faction, tech.id);
  });
}

const TECH_ORDER: Record<TechType, number> = {
  GREEN: 1,
  BLUE: 2,
  YELLOW: 3,
  RED: 4,
  UPGRADE: 5,
} as const;

/**
 * Sorts techs in place into the proper order.
 */
export function sortTechs(techs: Tech[]) {
  techs.sort((a, b) => {
    const typeDiff = TECH_ORDER[a.type] - TECH_ORDER[b.type];
    if (typeDiff !== 0) {
      return typeDiff;
    }
    if (a.type === "UPGRADE") {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    }
    const prereqDiff = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.expansion === "POK") {
      return 1;
    }
    if (b.expansion === "POK") {
      return -1;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

export function getFactionPreReqs(
  faction: Optional<Faction>,
  techs: Partial<Record<TechId, Tech>>,
  options: Options,
  planets: Planet[],
  relics: Partial<Record<RelicId, Relic>>
) {
  const prereqs: Record<TechType, number> = {
    RED: 0,
    GREEN: 0,
    YELLOW: 0,
    BLUE: 0,
    UPGRADE: 0,
  };

  if (!faction) {
    return prereqs;
  }

  for (const ownedTech of Object.keys(faction.techs)) {
    const tech = techs[ownedTech as TechId];
    if (!tech) {
      continue;
    }
    prereqs[tech.type] += 1;
  }

  for (const planet of planets) {
    if (planet.owner !== faction.id) {
      continue;
    }
    for (const attribute of planet.attributes) {
      switch (attribute) {
        case "red-skip":
          prereqs.RED += 1;
          break;
        case "green-skip":
          prereqs.GREEN += 1;
          break;
        case "yellow-skip":
          prereqs.YELLOW += 1;
          break;
        case "blue-skip":
          prereqs.BLUE += 1;
          break;
      }
    }
  }

  // The Prophet's Tears can substitute for any 1 pre-req.
  const theProphetsTears = relics["The Prophet's Tears"];
  if (theProphetsTears && theProphetsTears.owner === faction.id) {
    prereqs.RED += 1;
    prereqs.GREEN += 1;
    prereqs.YELLOW += 1;
    prereqs.BLUE += 1;
  }

  // NOTE: This only applies once the Yin Brotherhood unlocks their commander, but there's currently no way to detect this.
  if (options.expansions.includes("POK") && faction.id === "Yin Brotherhood") {
    prereqs.GREEN += 1;
  }

  return prereqs;
}

export function canResearchTech(
  tech: Tech,
  options: Options,
  prereqs: Record<TechType, number>,
  faction: Optional<Faction>,
  isTechOwned: boolean
) {
  const localPrereqs = structuredClone(prereqs);

  let usedAida = true;
  let usedJolNar = true;
  if (faction) {
    if (hasTech(faction, "Inheritance Systems")) {
      return true;
    }
    if (hasTech(faction, "AI Development Algorithm")) {
      usedAida = false;
    }
    switch (faction.id) {
      case "Nekro Virus": {
        return isTechOwned;
      }
      case "Universities of Jol-Nar": {
        usedJolNar = false;
        break;
      }
      case "Yin Brotherhood": {
        if (isTechOwned) {
          return true;
        }
      }
    }
  }

  for (const req of tech.prereqs) {
    if (localPrereqs[req] === 0) {
      if (!usedAida && tech.type === "UPGRADE") {
        usedAida = true;
        continue;
      }
      if (!usedJolNar && tech.type !== "UPGRADE") {
        usedJolNar = true;
        continue;
      }
      return false;
    }
    localPrereqs[req] -= 1;
  }
  return true;
}

export function sortTechsByPreReqAndExpansion(techs: Tech[]) {
  techs.sort((a, b) => {
    if (a.prereqs.length === b.prereqs.length) {
      if (a.expansion > b.expansion) {
        return 1;
      }
      return -1;
    }
    if (a.prereqs.length > b.prereqs.length) {
      return 1;
    }
    return -1;
  });
}

export function sortTechsByName(techs: Tech[]) {
  techs.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
}
