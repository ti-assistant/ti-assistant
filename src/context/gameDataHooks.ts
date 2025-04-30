import { BASE_OPTIONS } from "../../server/data/options";
import { computeVPs } from "../util/factions";
import { getInitiativeForFaction, getOnDeckFaction } from "../util/helpers";
import { Optional } from "../util/types/types";
import { useGameDataValue, useMemoizedGameDataValue } from "./dataHooks";

export type FactionOrdering =
  | "VICTORY_POINTS"
  | "MAP"
  | "SPEAKER"
  | "INITIATIVE"
  | "ALLIANCE"
  | "VOTING";

export function useGameData() {
  return useGameDataValue<GameData>("", {
    factions: {},
    leaders: {},
    options: BASE_OPTIONS,
    planets: {},
    sequenceNum: 0,
    state: {
      phase: "UNKNOWN",
      round: 1,
      speaker: "Vuil'raith Cabal",
    },
  });
}

export function useActiveFaction() {
  return useMemoizedGameDataValue<GameData, Optional<Faction>>(
    "",
    undefined,
    (data) => {
      const activePlayer = data.state.activeplayer;
      if (!activePlayer || activePlayer === "None") {
        return undefined;
      }
      return data.factions[activePlayer];
    }
  );
}

export function useOnDeckFaction() {
  return useMemoizedGameDataValue<GameData, Optional<Faction>>(
    "",
    undefined,
    (data) =>
      getOnDeckFaction(data.state, data.factions, data.strategycards ?? {})
  );
}

function buildSortFn(
  data: GameData,
  order: FactionOrdering,
  tieBreak?: FactionOrdering
) {
  function getSortValues(a: Faction, b: Faction, ordering: FactionOrdering) {
    switch (ordering) {
      case "MAP":
        return { a: a.mapPosition, b: b.mapPosition };
      case "INITIATIVE":
        const strategyCards = data.strategycards ?? {};
        return {
          a: getInitiativeForFaction(strategyCards, a.id),
          b: getInitiativeForFaction(strategyCards, b.id),
        };
      case "SPEAKER":
        return { a: a.order, b: b.order };
      case "VICTORY_POINTS":
        const objectives = data.objectives ?? {};
        let aValue = computeVPs(data.factions, a.id, objectives);
        let bValue = computeVPs(data.factions, b.id, objectives);
        switch (data.options["game-variant"]) {
          case "alliance-combined":
          case "alliance-separate":
            const aPartner = a.alliancePartner;
            const bPartner = b.alliancePartner;
            if (aPartner === b.id || !aPartner || !bPartner) {
              break;
            }
            const aPartnerVPs = computeVPs(data.factions, aPartner, objectives);
            const bPartnerVPs = computeVPs(data.factions, bPartner, objectives);
            aValue = aValue + aPartnerVPs;
            bValue = bValue + bPartnerVPs;
            break;
        }
        return { a: aValue, b: bValue };
      case "ALLIANCE":
        if (!a.alliancePartner || !b.alliancePartner) {
          return getSortValues(a, b, "MAP");
        }
        // If same alliance, sort normally.
        if (a.alliancePartner === b.id || b.alliancePartner === a.id) {
          return getSortValues(a, b, "MAP");
        }

        // If different alliance, sort by earliest partner.
        const aPartner = data.factions[a.alliancePartner];
        const bPartner = data.factions[b.alliancePartner];
        if (!aPartner || !bPartner) {
          return getSortValues(a, b, "MAP");
        }

        const aValues = getSortValues(a, aPartner, "MAP");
        const bValues = getSortValues(b, bPartner, "MAP");
        const lowerA = aValues.a < aValues.b ? a : aPartner;
        const lowerB = bValues.a < bValues.b ? b : bPartner;

        return getSortValues(lowerA, lowerB, "MAP");
      case "VOTING":
        if (a.id === "Argent Flight") {
          return { a: 0, b: 1 };
        }
        if (b.id === "Argent Flight") {
          return { a: 1, b: 0 };
        }
        return getSortValues(a, b, "SPEAKER");
    }
  }

  return (a: Faction, b: Faction) => {
    let values = getSortValues(a, b, order);
    if (tieBreak && values.a === values.b) {
      values = getSortValues(a, b, tieBreak);
    }
    return values.a - values.b;
  };
}

export function useOrderedFactionIds(
  ordering: FactionOrdering,
  tieBreak?: FactionOrdering
) {
  return useMemoizedGameDataValue<GameData, FactionId[]>("", [], (data) => {
    const orderedFactions = Object.values(data.factions).sort(
      buildSortFn(data, ordering, tieBreak)
    );
    return orderedFactions.map((faction) => faction.id);
  });
}

export function useFactionVPs(factionId: FactionId) {
  return useMemoizedGameDataValue<GameData, number>("", 0, (data) =>
    computeVPs(data.factions, factionId, data.objectives ?? {})
  );
}
