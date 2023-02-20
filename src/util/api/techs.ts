import { mutate } from "swr";
import { Faction, FactionUpdateData } from "./factions";
import { Expansion } from "./options";
import { poster } from "./util";

export type TechType = "red" | "blue" | "yellow" | "green" | "upgrade";

export interface UnitStats {
  capacity?: number;
  combat?: number | string;
  cost?: number | string;
  move?: number;
}

export interface BaseTech {
  description: string;
  faction?: string;
  game: Expansion;
  name: string;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  prereqs: TechType[];
  replaces?: string;
  stats?: UnitStats;
  type: TechType;
}

export interface GameTech {
  ready?: boolean;
}

export type Tech = BaseTech & GameTech;

/**
 * Checks whether a faction has unlocked a specific tech.
 */
export function hasTech(faction: Faction, tech: string) {
  if (!faction.techs) {
    return false;
  }
  let techName = tech.replace(/\//g, "").replace(/\./g, "").replace(" Ω", "");
  return !!faction.techs[techName];
}

export async function unlockTech(
  gameid: string,
  factionName: string,
  tech: string
) {
  const data: FactionUpdateData = {
    action: "ADD_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(
    `/api/${gameid}/factions`,
    async () => await poster(`/api/${gameid}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        const updatedFaction = updatedFactions[factionName];
        if (!updatedFaction) {
          return updatedFactions;
        }

        if (!updatedFaction.techs) {
          updatedFaction.techs = {};
        }

        const techString = tech
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        updatedFaction.techs[techString] = {
          ready: true,
        };

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export async function lockTech(
  gameid: string,
  factionName: string,
  tech: string
) {
  const data: FactionUpdateData = {
    action: "REMOVE_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(
    `/api/${gameid}/factions`,
    async () => await poster(`/api/${gameid}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        const updatedFaction = updatedFactions[factionName];
        if (!updatedFaction || !updatedFaction.techs) {
          return updatedFactions;
        }

        const techString = tech
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        delete updatedFaction.techs[techString];

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export async function chooseStartingTech(
  gameid: string,
  factionName: string,
  tech: string
) {
  const data: FactionUpdateData = {
    action: "CHOOSE_STARTING_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(
    `/api/${gameid}/factions`,
    async () => await poster(`/api/${gameid}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        const updatedFaction = updatedFactions[factionName];
        if (!updatedFaction) {
          return updatedFactions;
        }

        if (!updatedFaction.startswith) {
          updatedFaction.startswith = {
            planets: [],
            techs: [],
            units: {},
          };
        }

        const techString = tech
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        if (!updatedFaction.startswith.techs) {
          updatedFaction.startswith.techs = [];
        }

        updatedFaction.startswith.techs.push(techString);

        const council = updatedFactions["Council Keleres"];
        if (council) {
          if (!council.startswith) {
            council.startswith = {
              planets: [],
              techs: [],
              units: {},
            };
          }
          if (!council.startswith.choice) {
            council.startswith.choice = {
              options: [],
              select: 2,
            };
          }
          const existingChoices = council.startswith.choice.options;
          const councilChoice = new Set(existingChoices);
          councilChoice.add(techString);
          council.startswith.choice.options = Array.from(councilChoice);
        }

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export async function removeStartingTech(
  gameid: string,
  factionName: string,
  tech: string
) {
  const data: FactionUpdateData = {
    action: "REMOVE_STARTING_TECH",
    faction: factionName,
    tech: tech,
  };

  mutate(
    `/api/${gameid}/factions`,
    async () => await poster(`/api/${gameid}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        const techString = tech
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        const updatedFaction = updatedFactions[factionName];
        if (!updatedFaction) {
          return updatedFactions;
        }

        if (!updatedFaction.startswith) {
          updatedFaction.startswith = {
            planets: [],
            techs: [],
            units: {},
          };
        }

        updatedFaction.startswith.techs = (
          updatedFaction.startswith.techs ?? []
        ).filter((startingTech) => startingTech !== techString);

        const council = updatedFactions["Council Keleres"];
        if (council) {
          const councilChoice = new Set<string>();
          for (const [name, faction] of Object.entries(factions)) {
            if (name === "Council Keleres") {
              continue;
            }
            (faction.startswith.techs ?? []).forEach((tech) => {
              councilChoice.add(tech);
            });
          }
          if (!council.startswith.choice) {
            council.startswith.choice = {
              options: [],
              select: 2,
            };
          }
          council.startswith.choice.options = Array.from(councilChoice);
          council.startswith.techs = (council.startswith.techs ?? []).filter(
            (tech) => {
              return councilChoice.has(tech);
            }
          );
        }

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}
