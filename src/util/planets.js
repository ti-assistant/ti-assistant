import { filterToPlanetAttachments } from "./attachments";

/**
 * Gets all the planets claimed by a specific faction.
 * @param {Object} planets
 * @param {string} factionName 
 * @returns {Array<Object>}
 */
export function filterToClaimedPlanets(planets, factionName) {
  return Object.values(planets ?? {}).filter((planet) => (planet.owners ?? []).includes(factionName));
}

/**
 * Updates all planets' values based on their attachments.
 * @param {Array<Object>} planets
 * @param {Object} attachments 
 * @returns {Array<Object>}
 */
export function applyAllPlanetAttachments(planets, attachments) {
  return planets.map((planet) => {
    return applyPlanetAttachments(planet, attachments);
  });
}

/**
 * Updates a single planet's values based on the attachments on the planet.
 * @param {Object} planet
 * @param {Object} attachments 
 * @returns {Object}
 */
function applyPlanetAttachments(planet, attachments) {
  let updatedPlanet = {...planet};
  updatedPlanet.attributes = [...planet.attributes];
  const planetAttachments = filterToPlanetAttachments(attachments, planet.name);
  planetAttachments.forEach((attachment) => {
    if (attachment.attribute.includes("skip")) {
      if (hasSkip(updatedPlanet)) {
        updatedPlanet.resources += attachment.resources;
        updatedPlanet.influence += attachment.influence;
      } else {
        updatedPlanet.attributes.push(attachment.attribute);
      }
    } else if (attachment.attribute === "all-types") {
      updatedPlanet.type = "all";
      updatedPlanet.resources += attachment.resources;
      updatedPlanet.influence += attachment.influence;
    } else {
      updatedPlanet.resources += attachment.resources;
      updatedPlanet.influence += attachment.influence;
      if (attachment.attribute && !updatedPlanet.attributes.includes(attachment.attribute)) {
        updatedPlanet.attributes.push(attachment.attribute);
      }
    }
  });
  return updatedPlanet;
}