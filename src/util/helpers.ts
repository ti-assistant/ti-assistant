import { Optional } from "./types/types";
import { getNextIndex } from "./util";

export function getOnDeckFaction(
  state: GameState,
  factions: Partial<Record<FactionId, Faction>>,
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>
): Optional<Faction> {
  switch (state.phase) {
    case "SETUP":
      // Probably not needed.
      return factions[state.speaker];
    case "STRATEGY": {
      if (!state.activeplayer) {
        return undefined;
      }
      // TODO: Handle 3 and 4 player counts needing to pick 2 SCs.
      const currentFaction =
        state.activeplayer && state.activeplayer !== "None"
          ? factions[state.activeplayer]
          : undefined;
      if (!currentFaction) {
        return undefined;
      }
      const numFactions = Object.keys(factions).length;
      const numPickedCards = Object.values(strategyCards).reduce(
        (num, card) => {
          if (card.faction) {
            return num + 1;
          }
          return num;
        },
        0
      );
      if (numFactions === 3 || numFactions === 4) {
        switch (numPickedCards) {
          // Last player is currently picking their second card.
          case numFactions * 2 - 1:
            return undefined;
          // Last player is currently picking their first card.
          case numFactions - 1:
            return factions[state.speaker];
        }
        // Wrap around after all players have selected once.
        // Reverse after all players have selected once.
        if (numPickedCards >= numFactions) {
          let nextOrder = currentFaction.order + 1;
          if (nextOrder > numFactions) {
            nextOrder = 1;
          }
          return Object.values(factions).find(
            (faction) => faction.order === nextOrder
          );
        }
      }
      let nextOrder = currentFaction.order + 1;
      const faction = Object.values(factions).find(
        (faction) => faction.order === nextOrder
      );
      if (!faction) {
        return undefined;
      }
      if (numFactions === numPickedCards) {
        return undefined;
      }
      return faction;
    }
    case "ACTION": {
      const activeplayer = state.lastActivePlayer
        ? state.lastActivePlayer
        : state.activeplayer;
      const orderedStrategyCards = Object.values(strategyCards).sort(
        (a, b) => a.order - b.order
      );
      // Keep only the first strategy card per player.
      const filteredStrategyCards = orderedStrategyCards.filter(
        (card, index) => {
          return (
            card.faction &&
            orderedStrategyCards.findIndex(
              (othercard) => card.faction === othercard.faction
            ) === index
          );
        }
      );
      const activeIndex = filteredStrategyCards.findIndex(
        (card) => card.faction === activeplayer
      );
      if (activeIndex === -1) {
        return undefined;
      }
      const length = filteredStrategyCards.length;
      for (
        let index = getNextIndex(activeIndex, length);
        index !== activeIndex;
        index = getNextIndex(index, length)
      ) {
        const nextCard = filteredStrategyCards[index];
        if (!nextCard) {
          break;
        }
        const factionId = nextCard.faction;
        if (!factionId) {
          break;
        }
        const faction = factions[factionId];
        if (!faction) {
          break;
        }
        if (!faction.passed) {
          return factions[factionId];
        }
      }
      if (!activeplayer) {
        return undefined;
      }
      const currentFaction =
        activeplayer && activeplayer !== "None"
          ? factions[activeplayer]
          : undefined;
      return currentFaction?.passed ? undefined : currentFaction;
    }
    case "STATUS": {
      // Probably not needed. Overall order is likely enough.
      const orderedStrategyCards = Object.values(strategyCards).sort(
        (a, b) => a.order - b.order
      );
      // Keep only the first strategy card per player.
      const filteredStrategyCards = orderedStrategyCards.filter(
        (card, index) => {
          return (
            card.faction &&
            orderedStrategyCards.findIndex(
              (othercard) => card.faction === othercard.faction
            ) === index
          );
        }
      );
      const activeIndex = orderedStrategyCards.findIndex(
        (card) => card.faction === state.activeplayer
      );
      if (activeIndex === -1) {
        return undefined;
      }
      const length = filteredStrategyCards.length;
      for (
        let index = getNextIndex(activeIndex, length);
        index !== activeIndex;
        index = getNextIndex(index, length)
      ) {
        const nextCard = filteredStrategyCards[index];
        if (!nextCard) {
          break;
        }
        const factionId = nextCard.faction;
        if (factionId) {
          return factions[factionId];
        }
      }
      return undefined;
    }
    case "AGENDA": {
      if (!state.activeplayer) {
        return undefined;
      }
      const currentFaction =
        state.activeplayer && state.activeplayer !== "None"
          ? factions[state.activeplayer]
          : undefined;
      return Object.values(factions).find(
        (faction) => faction.order === (currentFaction?.order ?? 0) + 1
      );
    }
  }
}

/**
 * Gets the strategy card(s) that a faction has selected.
 */
export function getStrategyCardsForFaction(
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>,
  factionId: FactionId
) {
  const cards = Object.values(strategyCards).filter(
    (card) => card.faction === factionId
  );
  return cards;
}

export function getInitiativeForFaction(
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>,
  factionId: FactionId
) {
  const cards = getStrategyCardsForFaction(strategyCards, factionId);
  return cards.reduce((initiative, card) => {
    if (card.order < initiative) {
      return card.order;
    }
    return initiative;
  }, Number.MAX_SAFE_INTEGER);
}
