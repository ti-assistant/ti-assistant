import { fetcher, poster } from './util'

/**
 * Checks whether a faction has unlocked a specific tech.
 * @param {Object} faction
 * @param {string} tech
 * @returns {bool}
 */
export function hasTech(faction, tech) {
  return !!faction.techs[tech];
}

export function attachToPlanet(mutate, gameid, attachments, planetName, attachmentName, gameOptions) {
  const data = {
    action: "ATTACH_TO_PLANET",
    attachment: attachmentName,
    planet: planetName,
  };

  const updatedAttachments = {...attachments};

  if (gameOptions['multiple-planet-attachments']) {
    updatedAttachments[attachmentName].planets.push(planetName);
  } else {
    updatedAttachments[attachmentName].planets = [planetName];
  }
  
  const options = {
    optimisticData: updatedAttachments,
  };

  mutate(`/api/${gameid}/attachments`, poster(`/api/${gameid}/attachmentUpdate`, data), options);
}

export function removeFromPlanet(mutate, gameid, attachments, planetName, attachmentName) {
  const data = {
    action: "REMOVE_FROM_PLANET",
    attachment: attachmentName,
    planet: planetName,
  };

  const updatedAttachments = {...attachments};

  delete updatedAttachments[attachmentName].planet;
  
  const options = {
    optimisticData: updatedAttachments,
  };

  mutate(`/api/${gameid}/attachments`, poster(`/api/${gameid}/attachmentUpdate`, data), options);
}