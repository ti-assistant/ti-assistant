import { fetcher, poster } from './util'

/**
 * Checks whether a faction has unlocked a specific tech.
 * @param {Object} faction
 * @param {string} tech
 * @returns {bool}
 */
export function hasTech(faction, tech) {
  let techName = tech.replace(/\//g,"")
    .replace(/\./g,"")
    .replace(" Ω", "");
  return !!faction.techs[techName];
}

export async function unlockTech(mutate, gameid, factionName, tech) {
  const data = {
    action: "ADD_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
      
      const techString = tech.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      updatedFactions[factionName].techs[techString] = {
        ready: true,
      };

      return updatedFactions;
    },
    revalidate: false,
  });
}

export async function lockTech(mutate, gameid, factionName, tech) {
  const data = {
    action: "REMOVE_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
      
      const techString = tech.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      delete updatedFactions[factionName].techs[techString];

      return updatedFactions;
    },
    revalidate: false,
  });
}

export async function chooseStartingTech(mutate, gameid, factionName, tech) {
  const data = {
    action: "CHOOSE_STARTING_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
      
      const techString = tech.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      updatedFactions[factionName].startswith.techs = [
        ...(updatedFactions[factionName].startswith.techs ?? []),
        techString,
      ];
      if (factions["Council Keleres"]) {
        const councilChoice = new Set(updatedFactions["Council Keleres"].startswith.choice.options);
        councilChoice.add(techString);
        updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
      }

      return updatedFactions;
    },
    revalidate: false,
  });
}

export async function removeStartingTech(mutate, gameid, factionName, tech) {
  const data = {
    action: "REMOVE_STARTING_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(`/api/${gameid}/factions`, async () => await poster(`/api/${gameid}/factionUpdate`, data), {
    optimisticData: factions => {
      const updatedFactions = structuredClone(factions);
      
      const techString = tech.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      updatedFactions[factionName].startswith.techs = (updatedFactions[factionName].startswith.techs ?? []).filter((startingTech) => startingTech !== techString);

      if (factions["Council Keleres"]) {
        const councilChoice = new Set();
        for (const [name, faction] of Object.entries(factions)) {
          if (name === "Council Keleres") {
            continue;
          }
          (faction.startswith.techs ?? []).forEach((tech) => {
            councilChoice.add(tech);
          });
        }
        updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
        for (const [index, tech] of (factions["Council Keleres"].startswith.techs ?? []).entries()) {
          if (!councilChoice.has(tech)) {
            delete updatedFactions["Council Keleres"].techs[tech];
            factions["Council Keleres"].startswith.techs.splice(index, 1);
          }
        }
      }

      return updatedFactions;
    },
    revalidate: false,
  });
}