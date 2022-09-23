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

export function unlockTech(mutate, gameid, factions, factionName, tech) {
  const data = {
    action: "ADD_TECH",
    faction: factionName,
    tech: tech,
    returnAll: true,
  };

  const updatedFactions = {...factions};

  updatedFactions[factionName].techs[tech] = {
    ready: true,
  };

  const options = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);

  const opts = {
    optimisticData: updatedFactions[factionName],
  };
  mutate(`/api/${gameid}/factions/${factionName}`, fetcher(`/api/${gameid}/factions/${factionName}`), opts);
}