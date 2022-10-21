/**
 * Gets all the attachments for a specific planet.
 * @param {Object} attachments
 * @param {string} planetName 
 * @returns {Array<Object>}
 */
 export function filterToPlanetAttachments(attachments, planetName) {
  return Object.values(attachments ?? {}).filter((attachment) => (attachment.planets ?? []).includes(planetName));
}