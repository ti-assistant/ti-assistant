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
  return useGameDataValue<Optional<string>>(
    `factions.${factionId}.color`,
    undefined
  );
}
