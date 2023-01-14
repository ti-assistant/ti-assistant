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

  return mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
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
}

export function manualVPUpdate(mutate, gameid, factions, factionName, value) {
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

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
}

export function updateCastVotes(mutate, gameid, factions, subStateFactions = {}) {
  const data = {
    action: "UPDATE_CAST_VOTES",
    factions: subStateFactions,
    returnAll: true,
  };

  const updatedFactions = {...factions};

  Object.entries(subStateFactions).forEach(([factionName, votes]) => {
    updatedFactions[factionName].castVotes += votes;
  });

  const options = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
}

export function resetCastVotes(mutate, gameid, factions) {
  const data = {
    action: "RESET_CAST_VOTES",
    returnAll: true,
  };

  const updatedFactions = {...factions};

  Object.keys(factions).forEach((factionName) => {
    updatedFactions[factionName].castVotes = 0;
  });

  const options = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
}

export function chooseSubFaction(mutate, gameid, factions, factionName, subFactionName) {
  const data = {
    action: "CHOOSE_SUB_FACTION",
    faction: factionName,
    subFaction: subFactionName,
    returnAll: true,
  };

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

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
}