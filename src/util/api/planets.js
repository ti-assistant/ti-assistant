import { fetcher, poster } from './util'

export async function readyPlanets(mutate, gameid, planets, toReady, factionName) {
  const data = {
    action: "TOGGLE_PLANET",
    faction: factionName,
    planets: toReady,
    ready: true,
  };

  let updatedPlanets = {...planets};

  for (const planetName of toReady) {
    updatedPlanets[planetName].ready = true;
  }

  const options = {
    optimisticData: updatedPlanets,
  };

  return mutate(`/api/${gameid}/planets`, poster(`/api/${gameid}/planetUpdate`, data), options);
}

export async function exhaustPlanets(mutate, gameid, planets, toExhaust, factionName) {
  const data = {
    action: "TOGGLE_PLANET",
    faction: factionName,
    planets: toExhaust,
    ready: false,
  };

  let updatedPlanets = {...planets};

  for (const planetName of toExhaust) {
    updatedPlanets[planetName].ready = false;
  }

  const options = {
    optimisticData: updatedPlanets,
  };

  return mutate(`/api/${gameid}/planets`, poster(`/api/${gameid}/planetUpdate`, data), options);
}

export async function claimPlanet(mutate, gameid, planets, planet, factionName, gameOptions = {}) {
  const data = {
    action: "ADD_PLANET",
    faction: factionName,
    planet: planet,
  };

  const updatedPlanets = {...planets};

  if (!updatedPlanets[planet].owners) {
    updatedPlanets[planet].owners = [];
  }
  if (gameOptions['multiple-planet-owners']) {
    updatedPlanets[planet].owners.push(factionName);
  } else {
    updatedPlanets[planet].owners = [factionName];
  }
  updatedPlanets[planet].ready = true;

  const options = {
    optimisticData: updatedPlanets,
  };

  mutate(`/api/${gameid}/planets`, poster(`/api/${gameid}/planetUpdate`, data), options);
}

export async function unclaimPlanet(mutate, gameid, planets, planet, factionName) {
  const data = {
    action: "REMOVE_PLANET",
    faction: factionName,
    planet: planet,
  };

  const updatedPlanets = {...planets};

  const ownerSet = new Set(updatedPlanets[planet].owners ?? []);
  ownerSet.delete(factionName);
  updatedPlanets[planet].owners = Array.from(ownerSet);

  const options = {
    optimisticData: updatedPlanets,
  };

  mutate(`/api/${gameid}/planets`, poster(`/api/${gameid}/planetUpdate`, data), options);
}

export function addAttachment(mutate, gameid, planets, planetName, attachmentName) {
  const data = {
    action: "ADD_ATTACHMENT",
    attachment: attachmentName,
    planet: planetName,
  };

  const updatedPlanets = {...planets};

  updatedPlanets[planetName].attachments.push(attachmentName);

  Object.values(planets).forEach((planet) => {
    if ((planet.attachments.includes(attachmentName))) {
      updatedPlanets[planet.name].attachments = updatedPlanets[planet.name].attachments.filter((attachment) => attachment !== attachmentName);
    }
  });

  const options = {
    optimisticData: updatedPlanets,
  };

  mutate(`/api/${gameid}/planets`, poster(`/api/${gameid}/planetUpdate`, data), options);
}

export function removeAttachment(mutate, gameid, planets, planetName, attachmentName) {
  const data = {
    action: "REMOVE_ATTACHMENT",
    attachment: attachmentName,
    planet: planetName,
  };

  const updatedPlanets = {...planets};

  updatedPlanets[planetName].attachments = updatedPlanets[planetName].attachments.filter((attachment) => attachment !== attachmentName);

  const options = {
    optimisticData: updatedPlanets,
  };

  mutate(`/api/${gameid}/planets`, poster(`/api/${gameid}/planetUpdate`, data), options);
}
