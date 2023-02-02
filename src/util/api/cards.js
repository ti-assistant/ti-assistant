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

export function useStrategyCard(mutate, gameid, cardName) {
  const data = {
    action: "USE_STRATEGY_CARD",
    card: cardName,
  };

  mutate(`/api/${gameid}/strategycards`, async () => await poster(`/api/${gameid}/cardUpdate`, data), {
    optimisticData: strategyCards => {
      const updatedCards = structuredClone(strategyCards);

      updatedCards[cardName].used = true;

      return updatedCards;
    },
    revalidate: false,
  });
}

export function resetStrategyCards(mutate, gameid) {
  const data = {
    action: "CLEAR_STRATEGY_CARDS",
  };

  mutate(`/api/${gameid}/strategycards`, async () => await poster(`/api/${gameid}/cardUpdate`, data), {
    optimisticData: strategyCards => {
      const updatedCards = structuredClone(strategyCards);

      for (const name of Object.keys(strategyCards)) {
        delete updatedCards[name].faction;
        updatedCards[name].order = strategyCardOrder[name];
        delete updatedCards[name].used;
      }

      return updatedCards;
    },
    revalidate: false,
  });
}

export function swapStrategyCards(mutate, gameid, cardOne, cardTwo) {
  const data = {
    action: "SWAP_STRATEGY_CARDS",
    cardOne: cardOne.name,
    cardTwo: cardTwo.name,
  };

  mutate(`/api/${gameid}/strategycards`, async () => await poster(`/api/${gameid}/cardUpdate`, data), {
    optimisticData: strategyCards => {
      const updatedCards = structuredClone(strategyCards);

      updatedCards[cardOne.name].faction = cardTwo.faction;
      updatedCards[cardTwo.name].faction = cardOne.faction;
      if (cardOne.order === 0) {
        updatedCards[cardTwo.name].order = 0;
        updatedCards[cardOne.name].order = strategyCardOrder[cardOne.name];
      } else if (cardTwo.order === 0) {
        updatedCards[cardTwo.name].order = strategyCardOrder[cardTwo.name];
        updatedCards[cardOne.name].order = 0;
      }

      return updatedCards;
    },
    revalidate: false,
  });
}

export function setFirstStrategyCard(mutate, gameid, cardName) {
  const data = {
    action: "GIFT_OF_PRESCIENCE",
    card: cardName,
  };

  mutate(`/api/${gameid}/strategycards`, async () => await poster(`/api/${gameid}/cardUpdate`, data), {
    optimisticData: strategyCards => {
      const updatedCards = structuredClone(strategyCards);

      updatedCards[cardName].order = 0;
      Object.entries(updatedCards).forEach(([name, card]) => {
        if (card.order === 0) {
          updatedCards[name].order = strategyCardOrder[name];
        }
      });

      return updatedCards;
    },
    revalidate: false,
  });
}

export async function unassignStrategyCard(mutate, gameid, cardName) {
  const data = {
    action: "PUBLIC_DISGRACE",
    card: cardName,
  };

  let factionName = null;

  mutate(`/api/${gameid}/strategycards`, async () => await poster(`/api/${gameid}/cardUpdate`, data), {
    optimisticData: strategyCards => {
      const updatedCards = structuredClone(strategyCards);

      factionName = strategyCards[cardName].faction;

      if (!factionName) {
        return updatedCards;
      }

      delete updatedCards[cardName].faction;
      updatedCards[cardName].order = strategyCardOrder[cardName];

      return updatedCards;
    },
    revalidate: false,
  });

  // TODO: Consider whether there's a better option.
  // Maybe split the backend changes to have separate updates?
  mutate(`/api/${gameid}/state`, state => {
    return {
      ...structuredClone(state),
      activeplayer: factionName,
    };
  }, {
    revalidate: false,
  });
}

export function assignStrategyCard(mutate, gameid, cardName, factionName) {
  const data = {
    action: "ASSIGN_STRATEGY_CARD",
    card: cardName,
    faction: factionName,
  };

  mutate(`/api/${gameid}/strategycards`, async () => await poster(`/api/${gameid}/cardUpdate`, data), {
    optimisticData: strategyCards => {
      const updatedCards = structuredClone(strategyCards);

      updatedCards[cardName].faction = factionName;

      if (factionName === "Naalu Collective") {
        updatedCards[cardName].order = 0;
      }

      return updatedCards;
    },
    revalidate: false,
  });
}

