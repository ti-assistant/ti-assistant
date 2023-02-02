import { poster } from './util'

export function claimPlanet(mutate, gameid, planet, factionName) {
  const data = {
    action: "ADD_PLANET",
    faction: factionName,
    planet: planet,
  };

  mutate(`/api/${gameid}/planets`, async () => await poster(`/api/${gameid}/planetUpdate`, data), {
    optimisticData: planets => {
      const updatedPlanets = structuredClone(planets);

      if (!updatedPlanets[planet]) {
        updatedPlanets[planet] = {};
      }

      updatedPlanets[planet].owners = [factionName];
      updatedPlanets[planet].ready = true;
      return updatedPlanets;
    },
    revalidate: false,
  });
}

export function unclaimPlanet(mutate, gameid, planet, factionName) {
  const data = {
    action: "REMOVE_PLANET",
    faction: factionName,
    planet: planet,
  };

  mutate(`/api/${gameid}/planets`, async () => await poster(`/api/${gameid}/planetUpdate`, data), {
    optimisticData: planets => {
      const updatedPlanets = structuredClone(planets);

      if (!updatedPlanets[planet]) {
        updatedPlanets[planet] = {};
      }

      updatedPlanets[planet].owners = [];

      return updatedPlanets;
    },
    revalidate: false,
  });
}

export function addAttachment(mutate, gameid, planetName, attachmentName) {
  const data = {
    action: "ADD_ATTACHMENT",
    attachment: attachmentName,
    planet: planetName,
  };

  mutate(`/api/${gameid}/planets`, async () => await poster(`/api/${gameid}/planetUpdate`, data), {
    optimisticData: planets => {
      const updatedPlanets = structuredClone(planets);

      // Remove attachment from other planets.
      Object.values(planets).forEach((planet) => {
        if ((planet.attachments.includes(attachmentName))) {
          updatedPlanets[planet.name].attachments = updatedPlanets[planet.name].attachments.filter((attachment) => attachment !== attachmentName);
        }
      });

      // Add attachment to planet.
      const planetAttachments = [...((planets[planetName] ?? {}).attachments ?? [])];
      planetAttachments.push(attachmentName);
      updatedPlanets[planetName].attachments = planetAttachments;

      return updatedPlanets;
    },
    revalidate: false,
  });
}

export function removeAttachment(mutate, gameid, planetName, attachmentName) {
  const data = {
    action: "REMOVE_ATTACHMENT",
    attachment: attachmentName,
    planet: planetName,
  };

  mutate(`/api/${gameid}/planets`, async () => await poster(`/api/${gameid}/planetUpdate`, data), {
    optimisticData: planets => {
      const updatedPlanets = structuredClone(planets);

      // Add attachment to planet.
      const planetAttachments = [...((planets[planetName] ?? {}).attachments ?? [])];
      updatedPlanets[planetName].attachments = planetAttachments.filter((attachment) => attachment !== attachmentName);

      return updatedPlanets;
    },
    revalidate: false,
  });
}
