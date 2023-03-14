import { Faction } from "./api/factions";
import { hasTech, Tech, TechType } from "./api/techs";

export function getTechColor(tech: Tech) {
  return getTechTypeColor(tech.type);
}

export function getTechTypeColor(type: TechType) {
  switch (type) {
    case "RED":
      return "indianred";
    case "YELLOW":
      return "goldenrod";
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
