import { convertToFactionColor, getFactionName } from "../util/factions";
import { Optional } from "../util/types/types";
import { useGameDataValue, useMemoizedGameDataValue } from "./dataHooks";

export type Factions = Partial<Record<FactionId, Faction>>;

export function useFactions() {
  return useGameDataValue<Factions>("factions", {});
}

export function useFaction(factionId: FactionId) {
  return useGameDataValue<Optional<Faction>>(
    `factions.${factionId}`,
    undefined
  );
}

export function useNumFactions() {
  return useMemoizedGameDataValue<Factions, number>(
    "factions",
    6,
    (factions) => Object.values(factions).length
  );
}

export function useFactionColor(factionId: FactionId) {
  return useMemoizedGameDataValue<Optional<string>, string>(
    `factions.${factionId}.color`,
    "#555",
    (color) => convertToFactionColor(color)
  );
}

export function useFactionDisplayName(factionId: FactionId) {
  return useMemoizedGameDataValue<Optional<Faction>, string>(
    `factions.${factionId}`,
    "Loading Faction...",
    (faction) => getFactionName(faction)
  );
}

export function useAllSecondariesCompleted() {
  return useMemoizedGameDataValue<Factions, boolean>(
    "factions",
    false,
    (factions) => {
      const count = Object.values(factions).reduce((count, faction) => {
        if (faction.secondary === "DONE" || faction.secondary === "SKIPPED") {
          return count + 1;
        }
        return count;
      }, 0);
      return count === Object.values(factions).length - 1;
    }
  );
}
