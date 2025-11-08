import { sortTechs } from "../util/techs";
import { useGameDataValue, useMemoizedGameDataValue } from "./dataHooks";
import { Factions } from "./factionDataHooks";

export type Techs = Partial<Record<TechId, Tech>>;

export function useOrderedTechIds(filterFn?: (tech: Tech) => boolean) {
  return useMemoizedGameDataValue<Techs, TechId[]>("techs", [], (techs) => {
    let matchingTechs = Object.values(techs);
    if (filterFn) {
      matchingTechs = matchingTechs.filter(filterFn);
    }
    sortTechs(matchingTechs);
    return matchingTechs.map((tech) => tech.id);
  });
}

export function useTechState(techId: TechId) {
  return useGameDataValue<TechState>(`techs.${techId}.state`, "ready");
}

export function useIsTechResearched(techId: TechId) {
  return useMemoizedGameDataValue<Factions, boolean>(
    `factions`,
    false,
    (factions) => {
      for (const faction of Object.values(factions)) {
        const factionTech = faction.techs[techId];
        if (factionTech && factionTech.state !== "purged") {
          return true;
        }
      }
      return false;
    }
  );
}

export function useFactionsWithTech(techId: TechId) {
  return useMemoizedGameDataValue<Factions, Set<FactionId>>(
    "factions",
    new Set(),
    (factions) => {
      const factionSet = new Set<FactionId>();
      for (const faction of Object.values(factions)) {
        const factionTech = faction.techs[techId];
        if (factionTech && factionTech.state !== "purged") {
          factionSet.add(faction.id);
        }
      }
      return factionSet;
    }
  );
}
