/**
 * Gets all the techs owned by a specific faction.
 * @param {Object} techs
 * @param {Object} faction 
 * @returns {Array<Object>}
 */
export function filterToOwnedTechs(techs, faction) {
  return Object.values(techs ?? {}).filter((tech) => !!(faction.techs ?? {})[tech.name]);
}

/**
 * Gets all the techs not owned by a specific faction.
 * @param {Object} techs
 * @param {Object} faction 
 * @returns {Array<Object>}
 */
 export function filterToUnownedTechs(techs, faction) {
  return Object.values(techs ?? {}).filter((tech) => !(faction.techs ?? {})[tech.name]);
}

/**
 * Gets all the techs that a specific faction starts with.
 * @param {Object} techs
 * @param {Object} faction 
 * @returns {Array<Object>}
 */
 export function filterToStartingTechs(techs, faction) {
  return Object.values(techs ?? {}).filter((tech) => !!(faction.startswith.techs ?? {})[tech.name]);
}

const TECH_ORDER = [
  "green",
  "blue",
  "yellow",
  "red",
  "upgrade",
];

/**
 * Sorts techs in place into the proper order.
 * @param {Array<Object>} techs
 */
export function sortTechs(techs) {
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
  })
}