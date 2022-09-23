import { poster } from './util'

export const strategyCardOrder = {
  "Leadership": 1,
  "Diplomacy": 2,
  "Politics": 3,
  "Construction": 4,
  "Trade": 5,
  "Warfare": 6,
  "Technology": 7,
  "Imperial": 8,
};

export function useStrategyCard(mutate, gameid, strategyCards, cardName) {
  const data = {
    action: "USE_STRATEGY_CARD",
    card: cardName,
  };

  const updatedCards = {...strategyCards};

  updatedCards[cardName].used = true;

  const options = {
    optimisticData: updatedCards,
  };

  mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
}

export function resetStrategyCards(mutate, gameid, strategyCards) {
  const data = {
    action: "CLEAR_STRATEGY_CARDS",
  };

  const updatedCards = {...strategyCards};
  for (const name of Object.keys(updatedCards)) {
    delete updatedCards[name].faction;
    updatedCards[name].order = strategyCardOrder[name];
    delete updatedCards[name].used;
  }

  const options = {
    optimisticData: updatedCards,
  };

  mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
}