import { StrategyCard } from "./api/cards";
import { Faction } from "./api/factions";
import { GameState } from "./api/state";
import { SubState } from "./api/subState";
import { getNextIndex } from "./util";

export function getOnDeckFaction(
  state: GameState,
  factions: Record<string, Faction>,
  strategyCards: Record<string, StrategyCard>,
  subState: SubState
): Faction | undefined {
  switch (state.phase) {
    case "SETUP":
      // Probably not needed.
      return factions[state.speaker];
    case "STRATEGY": {
      if (!state.activeplayer) {
        return undefined;
      }
      // TODO: Handle 3 and 4 player counts needing to pick 2 SCs.
      const currentFaction = factions[state.activeplayer];
      if (!currentFaction) {
        return undefined;
      }
      const numFactions = Object.keys(factions).length;
      if (numFactions === 3 || numFactions === 4) {
        const numPickedCards = (subState.strategyCards ?? []).length;
        switch (numPickedCards) {
          // Last player is currently picking.
          case numFactions - 1:
            return currentFaction;
          // First player is currently picking their second card.
          case numFactions * 2 - 1:
            return undefined;
        }
        // Reverse after all players have selected once.
        if (numPickedCards >= numFactions) {
          let nextOrder = currentFaction.order - 1;
          if (nextOrder === 0) {
            nextOrder = numFactions;
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
      const cards = getStrategyCardsForFaction(strategyCards, faction.name);
      if (cards.length === 2) {
        return undefined;
      }
      if (numFactions > 4 && cards.length === 1) {
        return undefined;
      }
      return faction;
    }
    case "ACTION": {
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
        const factionName = nextCard.faction;
        if (!factionName) {
          break;
        }
        const faction = factions[factionName];
        if (!faction) {
          break;
        }
        if (!faction.passed) {
          return factions[factionName];
        }
      }
      if (!state.activeplayer) {
        return undefined;
      }
      const currentFaction = factions[state.activeplayer];
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
        const factionName = nextCard.faction;
        if (factionName) {
          return factions[factionName];
        }
      }
      return undefined;
    }
    case "AGENDA": {
      if (!state.activeplayer) {
        return undefined;
      }
      const currentFaction = factions[state.activeplayer];
      return Object.values(factions).find(
        (faction) => faction.order === currentFaction?.order ?? 0 + 1
      );
    }
  }
}

export function getPreviousFaction(
  state: GameState,
  factions: Record<string, Faction>,
  subState: SubState
) {
  // TODO: Add ability to get previous faction in action phase.
  if (state.phase !== "STRATEGY") {
    return undefined;
  }

  if (!subState.strategyCards) {
    return undefined;
  }

  const lastPicked = subState.strategyCards[subState.strategyCards.length - 1];

  if (!lastPicked) {
    return undefined;
  }

  return factions[lastPicked.pickedBy];
}

/**
 * Gets the strategy card(s) that a faction has selected.
 */
export function getStrategyCardsForFaction(
  strategyCards: Record<string, StrategyCard>,
  factionName: string
) {
  const cards = Object.values(strategyCards).filter(
    (card) => card.faction === factionName
  );
  return cards;
}

export function getInitiativeForFaction(
  strategyCards: Record<string, StrategyCard>,
  factionName: string
) {
  const cards = getStrategyCardsForFaction(strategyCards, factionName);
  return cards.reduce((initiative, card) => {
    if (card.order < initiative) {
      return card.order;
    }
    return initiative;
  }, Number.MAX_SAFE_INTEGER);
}
