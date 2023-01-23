
import { getNextIndex } from './util';

export function getOnDeckFaction(state, factions, strategyCards) {
  switch (state.phase) {
    case "SETUP":
      // Probably not needed.
      return factions[state.speaker];
    case "STRATEGY": {
      // TODO: Handle 3 and 4 player counts needing to pick 2 SCs.
      const currentFaction = factions[state.activeplayer];
      if (!currentFaction) {
        return null;
      }
      const numFactions = Object.keys(factions).length;
      if (numFactions === 3 || numFactions === 4) {
        const strategyCardsWithOwners = Object.values(strategyCards).filter((card) => !!card.faction);
        switch (strategyCardsWithOwners.length) {
          // Last player is currently picking.
          case numFactions - 1:
            return currentFaction;
          // First player is currently picking their second card.
          case numFactions * 2 - 1:
            return null;
        }
        // Reverse after all players have selected once.
        if (strategyCardsWithOwners.length >= numFactions) {
          return Object.values(factions).find((faction) => faction.order === currentFaction.order - 1);
        }
      }
      return Object.values(factions).find((faction) => faction.order === currentFaction.order + 1);
    }
    case "ACTION": {
      const orderedStrategyCards = Object.values(strategyCards).sort((a, b) => a.order - b.order);
      // Keep only the first strategy card per player.
      const filteredStrategyCards = orderedStrategyCards.filter((card, index) => {
        return card.faction && orderedStrategyCards.findIndex((othercard) => card.faction === othercard.faction) === index;
      });
      const activeIndex = filteredStrategyCards.findIndex((card) => card.faction === state.activeplayer);
      if (activeIndex === -1) {
        return null;
      }
      const length = filteredStrategyCards.length;
      for (let index = getNextIndex(activeIndex, length); index !== activeIndex; index = getNextIndex(index, length)) {
        const factionName = filteredStrategyCards[index].faction;
        if (factionName && !factions[factionName].passed) {
          return factions[factionName];
        }
      }
      const currentFaction = factions[state.activeplayer];
      return currentFaction.passed ? null : currentFaction;
    }
    case "STATUS": {
      // Probably not needed. Overall order is likely enough.
      const orderedStrategyCards = Object.values(strategyCards).sort((a, b) => a.order - b.order);
      // Keep only the first strategy card per player.
      const filteredStrategyCards = orderedStrategyCards.filter((card, index) => {
        return card.faction && orderedStrategyCards.findIndex((othercard) => card.faction === othercard.faction) === index;
      });
      const activeIndex = orderedStrategyCards.findIndex((card) => card.faction === state.activeplayer);
      if (activeIndex === -1) {
        return null;
      }
      const length = filteredStrategyCards.length;
      for (let index = getNextIndex(activeIndex, length); index !== activeIndex; index = getNextIndex(index, length)) {
        const factionName = filteredStrategyCards[index].faction;
        if (factionName) {
          return factions[factionName];
        }
      }
      return null;
    }
    case "AGENDA": {
      const currentFaction = factions[state.activeplayer];
      return Object.values(factions).find((faction) => faction.order === currentFaction.order + 1);
    }
  }
}

/**
 * Gets the strategy card(s) that a faction has selected.
 * @param {Object} strategyCards 
 * @param {string} faction 
 * @returns {Array<Object>}
 */
export function getStrategyCardsForFaction(strategyCards, faction) {
  const cards = Object.values(strategyCards).filter((card) => card.faction === faction);
  return cards;
}

export function getInitiativeForFaction(strategyCards, factionName) {
  const cards = getStrategyCardsForFaction(strategyCards, factionName);
  return cards.reduce((initiative, card) => {
    if (card.order < initiative) {
      return card.order;
    }
    return initiative;
  }, Number.MAX_SAFE_INTEGER);
}