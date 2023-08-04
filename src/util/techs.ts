import { Faction } from "./api/factions";
import { Options } from "./api/options";
import { Planet } from "./api/planets";
import { Relic } from "./api/relics";
import { hasTech, Tech, TechType } from "./api/techs";

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
  techs: Record<string, Tech>,
  faction: Faction
) {
  return Object.values(techs).filter((tech) => {
    return !!hasTech(faction, tech.name);
  });
}

/**
 * Gets all the techs not owned by a specific faction.
 */
export function filterToUnownedTechs(
  techs: Record<string, Tech>,
  faction: Faction
) {
  return Object.values(techs).filter((tech) => {
    return !hasTech(faction, tech.name);
  });
}

const TECH_ORDER = ["green", "blue", "yellow", "red", "upgrade"];

/**
 * Sorts techs in place into the proper order.
 */
export function sortTechs(techs: Tech[]) {
  techs.sort((a, b) => {
    const typeDiff = TECH_ORDER.indexOf(a.type) - TECH_ORDER.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

export function getFactionPreReqs(
  faction: Faction | undefined,
  techs: Record<string, Tech>,
  options: Options,
  planets: Planet[],
  relics: Record<string, Relic>
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
    const tech = techs[ownedTech];
    if (!tech) {
      continue;
    }
    prereqs[tech.type] += 1;
  }

  for (const planet of planets) {
    if (planet.owner !== faction.name) {
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
  if (theProphetsTears && theProphetsTears.owner === faction.name) {
    prereqs.RED += 1;
    prereqs.GREEN += 1;
    prereqs.YELLOW += 1;
    prereqs.BLUE += 1;
  }

  // NOTE: This only applies once the Yin Brotherhood unlocks their commander, but there's currently no way to detect this.
  if (
    options.expansions.includes("POK") &&
    faction.name === "Yin Brotherhood"
  ) {
    prereqs.GREEN += 1;
  }

  return prereqs;
}

export function canResearchTech(
  tech: Tech,
  options: Options,
  prereqs: Record<TechType, number>,
  faction: Faction | undefined,
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
    switch (faction.name) {
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
