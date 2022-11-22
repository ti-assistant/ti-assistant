import { fetcher, poster } from './util'

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

export function swapStrategyCards(mutate, gameid, strategyCards, cardOne, cardTwo) {
  const data = {
    action: "SWAP_STRATEGY_CARDS",
    cardOne: cardOne.name,
    cardTwo: cardTwo.name,
  };

  const updatedCards = {...strategyCards};
  updatedCards[cardOne.name].faction = cardTwo.faction;
  updatedCards[cardTwo.name].faction = cardOne.faction;
  if (cardOne.order === 0) {
    updatedCards[cardTwo.name].order = 0;
    updatedCards[cardOne.name].order = strategyCardOrder[cardOne.name];
  } else if (cardTwo.order === 0) {
    updatedCards[cardTwo.name].order = strategyCardOrder[cardTwo.name];
    updatedCards[cardOne.name].order = 0;
  }

  const options = {
    optimisticData: updatedCards,
  };
  mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
}

export function setFirstStrategyCard(mutate, gameid, strategyCards, cardName) {
  const data = {
    action: "GIFT_OF_PRESCIENCE",
    card: cardName,
  };

  const updatedCards = {...strategyCards};
  updatedCards[cardName].order = 0;
  Object.entries(updatedCards).forEach(([name, card]) => {
    if (card.order === 0) {
      updatedCards[name].order = strategyCardOrder[name];
    }
  });

  const options = {
    optimisticData: updatedCards,
  };
  mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
}

export async function unassignStrategyCard(mutate, gameid, strategyCards, cardName, state) {
  const data = {
    action: "PUBLIC_DISGRACE",
    card: cardName,
  };

  const factionName = strategyCards[cardName].faction;
  if (!factionName) {
    return;
  }

  const updatedCards = {...strategyCards};
  let numPickedCards = 0;
  for (const [name, card] of Object.entries(strategyCards)) {
    if (card.invalid && name !== data.card) {
      delete updatedCards[cardName].invalid;
    }
    if (card.faction) {
      numPickedCards++;
    }
  }
  // if (numPickedCards < 8) {
  //   updatedCards[cardName].invalid = true;
  // }
  delete updatedCards[cardName].faction;
  // Need to reset the card order
  // if (factionName === "Naalu Collective") {
    updatedCards[cardName].order = strategyCardOrder[cardName];
  // }

  const options = {
    optimisticData: updatedCards,
  };
  await mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);

  const updatedState = {...state};
  updatedState.activeplayer = factionName;

  const opts = {
    optimisticData: updatedState,
  };
  await mutate(`/api/${gameid}/state`, fetcher(`/api/${gameid}/state`), opts);
}