import { fetcher, poster } from './util'

export async function passFaction(mutate, gameid, factions, factionName) {
  const data = {
    action: "PASS",
    faction: factionName,
    returnAll: true,
  };

  const updatedFactions = {...factions};

  updatedFactions[factionName].passed = true;

  const options = {
    optimisticData: updatedFactions,
  };

  const factionsPromise = mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);

  const opts = {
    optimisticData: updatedFactions[factionName],
  };
  const factionPromise = mutate(`/api/${gameid}/factions/${factionName}`, () => updatedFactions[factionName], opts);
  return Promise.all([factionsPromise, factionPromise]);
}

export function readyAllFactions(mutate, gameid, factions) {
  const data = {
    action: "READY_ALL",
    returnAll: true,
  };

  const updatedFactions = {...factions};

  for (const factionName of Object.keys(updatedFactions)) {
    updatedFactions[factionName].passed = false;
  }

  const options = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);

  for (const factionName of Object.keys(updatedFactions)) {
    const opts = {
      optimisticData: updatedFactions[factionName],
    };

    mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
  }
}