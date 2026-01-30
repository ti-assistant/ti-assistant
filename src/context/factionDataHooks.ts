import { convertToFactionColor, getFactionName } from "../util/factions";
import { Optional } from "../util/types/types";
import { objectEntries } from "../util/util";
import { useGameDataValue, useMemoizedGameDataValue } from "./dataHooks";

export type Factions = Partial<Record<FactionId, Faction>>;

export function useFactions() {
  return useGameDataValue<Factions>("factions", {});
}

export function useFaction(factionId: FactionId) {
  return useGameDataValue<Optional<Faction>>(
    `factions.${factionId}`,
    undefined,
  );
}

export function useFactionTechs(factionId: FactionId) {
  return useMemoizedGameDataValue<Optional<Faction>, Set<TechId>>(
    `factions.${factionId}`,
    new Set(),
    (faction) => {
      if (!faction) {
        return new Set();
      }
      return new Set(
        objectEntries(faction.techs)
          .filter(([_, tech]) => tech.state !== "purged")
          .map(([techId, _]) => techId),
      );
    },
  );
}

export function useNumFactions() {
  return useMemoizedGameDataValue<Factions, number>(
    "factions",
    6,
    (factions) => Object.values(factions).length,
  );
}

export function usePassedFactionIds() {
  return useMemoizedGameDataValue<Factions, FactionId[]>(
    "factions",
    [],
    (factions) =>
      Object.values(factions)
        .filter((faction) => faction.passed)
        .map((faction) => faction.id),
  );
}

export function useFactionColor(factionId: FactionId) {
  return useMemoizedGameDataValue<Optional<string>, string>(
    `factions.${factionId}.color`,
    "#555",
    (color) => convertToFactionColor(color),
  );
}

export function useIsFactionPassed(factionId: FactionId) {
  return useGameDataValue<boolean>(`factions.${factionId}.passed`, false);
}

export function useFactionDisplayName(factionId: FactionId) {
  return useMemoizedGameDataValue<Optional<Faction>, string>(
    `factions.${factionId}`,
    "Loading Faction...",
    (faction) => getFactionName(faction),
  );
}

export interface FactionName {
  name: string;
  playerName?: string;
  shortName: string;
}

export function useFactionDisplayNameObject(factionId: FactionId) {
  return useMemoizedGameDataValue<Optional<Faction>, FactionName>(
    `factions.${factionId}`,
    {
      name: "Loading Faction...",
      shortName: "Loading Faction...",
    },
    (faction) => {
      return {
        name: faction?.name ?? "Loading Faction...",
        playerName: faction?.playerName,
        shortName: faction?.shortname ?? "Loading Faction...",
      };
    },
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
    },
  );
}

export function useFactionHasTech(factionId: FactionId, techId: TechId) {
  return useMemoizedGameDataValue<Partial<Record<TechId, GameTech>>, boolean>(
    `factions.${factionId}.techs`,
    false,
    (factionTechs) => {
      const tech = factionTechs[techId];
      return !!tech && tech.state !== "purged";
    },
  );
}

export function useFactionSecondary(factionId: FactionId) {
  return useGameDataValue<Secondary>(
    `factions.${factionId}.secondary`,
    "PENDING",
  );
}

export function useAllFactionAlliances() {
  return useMemoizedGameDataValue<
    GameData,
    Partial<Record<FactionId, FactionId[]>>
  >("", {}, (gameData) => {
    const alliances: Partial<Record<FactionId, FactionId[]>> = {};
    for (const faction of Object.values(gameData.factions)) {
      alliances[faction.id] = faction.alliances ?? [];
    }
    return alliances;
  });
}
