import { fetcher, poster } from './util'

export async function passFaction(mutate, setUpdateTime, gameid, factions, factionName) {
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

  const factionsPromise = mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data, setUpdateTime), options);

  const opts = {
    optimisticData: updatedFactions[factionName],
  };
  const factionPromise = mutate(`/api/${gameid}/factions/${factionName}`, () => updatedFactions[factionName], opts);
  return Promise.all([factionsPromise, factionPromise]);
}

export function readyAllFactions(mutate, setUpdateTime, gameid, factions) {
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

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data, setUpdateTime), options);

  for (const factionName of Object.keys(updatedFactions)) {
    const opts = {
      optimisticData: updatedFactions[factionName],
    };

    mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
  }
}

export function saveFactionTimer(mutate, setUpdateTime, gameid, factions, factionName, factionTimer) {
  const data = {
    action: "SAVE_FACTION_TIMER",
    faction: factionName,
    timer: factionTimer,
    returnAll: true,
  };

  const updatedFactions = {...factions};

  updatedFactions[factionName].timer = factionTimer;

  const options = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data, setUpdateTime), options);

  for (const factionName of Object.keys(updatedFactions)) {
    const opts = {
      optimisticData: updatedFactions[factionName],
    };

    mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
  }
}

export function manualVPUpdate(mutate, setUpdateTime, gameid, factions, factionName, value) {
  const data = {
    action: "MANUAL_VP_ADJUST",
    faction: factionName,
    vps: value,
    returnAll: true,
  };

  const updatedFactions = {...factions};

  updatedFactions[factionName].vps = (updatedFactions[factionName].vps ?? 0) + value;

  const options = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data, setUpdateTime), options);

  const opts = {
    optimisticData: updatedFactions[factionName],
  };

  mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
}

export function chooseSubFaction(mutate, setUpdateTime, gameid, factions, factionName, subFactionName) {
  const data = {
    action: "CHOOSE_SUB_FACTION",
    faction: factionName,
    subFaction: subFactionName,
    returnAll: true,
  };

  console.log(factionName);

  const updatedFactions = {...factions};

  updatedFactions[factionName].startswith.faction = subFactionName;

  switch (subFactionName) {
    case "Argent Flight":
      updatedFactions[factionName].startswith.planets = [
        "Avar",
        "Valk",
        "Ylir",
      ];
      break;
    case "Mentak Coalition":
      updatedFactions[factionName].startswith.planets = [
        "Moll Primus",
      ];
      break;
    case "Xxcha Kingdom":
      updatedFactions[factionName].startswith.planets = [
        "Archon Ren",
        "Archon Tau",
      ];
      break;
  }

  const options = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data, setUpdateTime), options);

  const opts = {
    optimisticData: updatedFactions[factionName],
  };

  mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
}