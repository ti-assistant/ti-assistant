import { fetcher, poster } from './util'

export async function passFaction(mutate, gameid, factionName) {
  const data = {
    action: "PASS",
    faction: factionName,
  };

  return mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
    
      updatedFactions[factionName].passed = true;

      return updatedFactions;
    },
    revalidate: false,
  });
}

export function readyAllFactions(mutate, gameid) {
  const data = {
    action: "READY_ALL",
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
    
      for (const factionName of Object.keys(factions)) {
        updatedFactions[factionName].passed = false;
      }

      return updatedFactions;
    },
    revalidate: false,
  });
}

export function manualVPUpdate(mutate, gameid, factionName, value) {
  const data = {
    action: "MANUAL_VP_ADJUST",
    faction: factionName,
    vps: value,
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
    
      updatedFactions[factionName].vps = (factions[factionName].vps ?? 0) + value;

      return updatedFactions;
    },
    revalidate: false,
  });
}

export function updateCastVotes(mutate, gameid, subStateFactions = {}) {
  const data = {
    action: "UPDATE_CAST_VOTES",
    factions: subStateFactions,
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
    
      for (const [factionName, votes] of Object.entries(subStateFactions)) {
        updatedFactions[factionName].castVotes += votes;
      }

      return updatedFactions;
    },
    revalidate: false,
  });
}

export function resetCastVotes(mutate, gameid) {
  const data = {
    action: "RESET_CAST_VOTES",
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
    
      for (const factionName of Object.keys(factions)) {
        updatedFactions[factionName].castVotes = 0;
      }

      return updatedFactions;
    },
    revalidate: false,
  });
}

export function chooseSubFaction(mutate, gameid, factionName, subFactionName) {
  const data = {
    action: "CHOOSE_SUB_FACTION",
    faction: factionName,
    subFaction: subFactionName,
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);

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

      return updatedFactions;
    },
    revalidate: false,
  });
}