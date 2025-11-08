import { BASE_OPTIONS } from "../../server/data/options";
import { computeScoredVPs, computeVPs } from "../util/factions";
import { getInitiativeForFaction, getOnDeckFaction } from "../util/helpers";
import { Optional } from "../util/types/types";
import { useGameDataValue, useMemoizedGameDataValue } from "./dataHooks";
import { Factions } from "./factionDataHooks";
import { Objectives } from "./objectiveDataHooks";

export type FactionOrdering =
  | "VICTORY_POINTS"
  | "MAP"
  | "SPEAKER"
  | "INITIATIVE"
  | "ALLIANCE"
  | "VOTING";

export type FactionOnlyOrdering = "MAP" | "SPEAKER" | "ALLIANCE" | "VOTING";

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

export function useActiveFactionId() {
  return useMemoizedGameDataValue<GameState, Optional<FactionId>>(
    "state",
    undefined,
    (state) => {
      const activePlayer = state.activeplayer;
      if (!activePlayer || activePlayer === "None") {
        return undefined;
      }
      return activePlayer;
    }
  );
}

export function useOnDeckFactionId() {
  return useMemoizedGameDataValue<GameData, Optional<FactionId>>(
    "",
    undefined,
    (data) => {
      const onDeckFaction = getOnDeckFaction(
        data.state,
        data.factions,
        data.strategycards ?? {}
      );
      if (!onDeckFaction) {
        return undefined;
      }
      return onDeckFaction.id;
    }
  );
}

function buildSortFn(
  data: GameData,
  order: FactionOrdering,
  tieBreak?: FactionOrdering,
  offsetValue?: number
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
        if (!offsetValue) {
          return { a: a.order, b: b.order };
        }
        if (a.order === offsetValue) {
          return { a: -1, b: 1 };
        }
        if (b.order === offsetValue) {
          return { a: 1, b: -1 };
        }
        if (a.order < offsetValue) {
          if (b.order < offsetValue) {
            return { a: a.order, b: b.order };
          }
          return { a: 1, b: -1 };
        }
        if (b.order > offsetValue) {
          return { a: a.order, b: b.order };
        }
        return { a: -1, b: 1 };
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
        // Flip the sign to sort in descending order.
        return { a: -aValue, b: -bValue };
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
        if (a.order === 1) {
          return { a: 1, b: 0 };
        }
        if (b.order === 1) {
          return { a: 0, b: 1 };
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

function buildFactionSortFn(
  factions: Factions,
  order: FactionOnlyOrdering,
  tieBreak?: FactionOnlyOrdering,
  offsetValue?: number
) {
  function getSortValues(
    a: Faction,
    b: Faction,
    ordering: FactionOnlyOrdering
  ) {
    switch (ordering) {
      case "MAP":
        return { a: a.mapPosition, b: b.mapPosition };
      case "SPEAKER":
        if (!offsetValue) {
          return { a: a.order, b: b.order };
        }
        if (a.order === offsetValue) {
          return { a: -1, b: 1 };
        }
        if (b.order === offsetValue) {
          return { a: 1, b: -1 };
        }
        if (a.order < offsetValue) {
          if (b.order < offsetValue) {
            return { a: a.order, b: b.order };
          }
          return { a: 1, b: -1 };
        }
        if (b.order > offsetValue) {
          return { a: a.order, b: b.order };
        }
        return { a: -1, b: 1 };
      case "ALLIANCE":
        if (!a.alliancePartner || !b.alliancePartner) {
          return getSortValues(a, b, "MAP");
        }
        // If same alliance, sort normally.
        if (a.alliancePartner === b.id || b.alliancePartner === a.id) {
          return getSortValues(a, b, "MAP");
        }

        // If different alliance, sort by earliest partner.
        const aPartner = factions[a.alliancePartner];
        const bPartner = factions[b.alliancePartner];
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
        if (a.order === 1) {
          return { a: 1, b: 0 };
        }
        if (b.order === 1) {
          return { a: 0, b: 1 };
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

export function useCompleteOrderedFactionIds(
  ordering: FactionOrdering,
  tieBreak?: FactionOrdering,
  speakerOffset?: FactionId
) {
  return useMemoizedGameDataValue<GameData, FactionId[]>("", [], (data) => {
    let offsetValue: Optional<number>;
    if (speakerOffset) {
      offsetValue = data.factions[speakerOffset]?.order ?? 0;
    }
    const orderedFactions = Object.values(data.factions).sort(
      buildSortFn(data, ordering, tieBreak, offsetValue)
    );
    return orderedFactions.map((faction) => faction.id);
  });
}

export function useOrderedFactionIds(
  ordering: FactionOnlyOrdering,
  tieBreak?: FactionOnlyOrdering,
  speakerOffset?: FactionId
) {
  return useMemoizedGameDataValue<Factions, FactionId[]>(
    "factions",
    [],
    (factions) => {
      let offsetValue: Optional<number>;
      if (speakerOffset) {
        offsetValue = factions[speakerOffset]?.order ?? 0;
      }
      const orderedFactions = Object.values(factions).sort(
        buildFactionSortFn(factions, ordering, tieBreak, offsetValue)
      );
      return orderedFactions.map((faction) => faction.id);
    }
  );
}

export function useScoredFactionVPs(factionId: FactionId) {
  return useMemoizedGameDataValue<Objectives, number>(
    "objectives",
    0,
    (objectives) => computeScoredVPs(factionId, objectives)
  );
}

export function useManualFactionVPs(factionId: FactionId) {
  return useGameDataValue(`factions.${factionId}.vps`, 0);
}
