import { mutate } from "swr";
import { poster } from "./util";

export type StrategyCardName =
  | "Leadership"
  | "Diplomacy"
  | "Politics"
  | "Construction"
  | "Trade"
  | "Warfare"
  | "Technology"
  | "Imperial";

export type StrategyCardUpdateAction =
  | "ASSIGN_STRATEGY_CARD"
  | "SWAP_STRATEGY_CARDS"
  | "PUBLIC_DISGRACE"
  | "GIFT_OF_PRESCIENCE"
  | "USE_STRATEGY_CARD"
  | "CLEAR_STRATEGY_CARDS";

export interface StrategyCardUpdateData {
  action?: StrategyCardUpdateAction;
  card?: string;
  cardOne?: string;
  cardTwo?: string;
  faction?: string;
  timestamp?: number;
}

export interface BaseStrategyCard {
  color: string;
  name: StrategyCardName;
  order: number;
}

export interface GameStrategyCard {
  invalid?: boolean;
  order?: number;
  faction?: string;
  used?: boolean;
}

export type StrategyCard = BaseStrategyCard & GameStrategyCard;

export const strategyCardOrder: Record<StrategyCardName, number> = {
  Leadership: 1,
  Diplomacy: 2,
  Politics: 3,
  Construction: 4,
  Trade: 5,
  Warfare: 6,
  Technology: 7,
  Imperial: 8,
};

export function markStrategyCardUsed(
  gameId: string,
  cardName: StrategyCardName
) {
  const data: StrategyCardUpdateData = {
    action: "USE_STRATEGY_CARD",
    card: cardName,
  };

  mutate(
    `/api/${gameId}/strategycards`,
    async () => await poster(`/api/${gameId}/cardUpdate`, data),
    {
      optimisticData: (strategyCards: Record<string, StrategyCard>) => {
        const updatedCards = structuredClone(strategyCards);

        const card = updatedCards[cardName];

        if (!card) {
          return updatedCards;
        }

        card.used = true;

        return updatedCards;
      },
      revalidate: false,
    }
  );
}

export function resetStrategyCards(gameId: string) {
  const data: StrategyCardUpdateData = {
    action: "CLEAR_STRATEGY_CARDS",
  };

  mutate(
    `/api/${gameId}/strategycards`,
    async () => await poster(`/api/${gameId}/cardUpdate`, data),
    {
      optimisticData: (strategyCards: Record<string, StrategyCard>) => {
        const updatedCards = structuredClone(strategyCards);

        for (const card of Object.values(updatedCards)) {
          delete card.faction;
          card.order = strategyCardOrder[card.name];
          delete card.used;
        }

        return updatedCards;
      },
      revalidate: false,
    }
  );
}

export function swapStrategyCards(
  gameId: string,
  cardOne: StrategyCard,
  cardTwo: StrategyCard
) {
  const data: StrategyCardUpdateData = {
    action: "SWAP_STRATEGY_CARDS",
    cardOne: cardOne.name,
    cardTwo: cardTwo.name,
  };

  mutate(
    `/api/${gameId}/strategycards`,
    async () => await poster(`/api/${gameId}/cardUpdate`, data),
    {
      optimisticData: (strategyCards: Record<string, StrategyCard>) => {
        const updatedCards = structuredClone(strategyCards);

        const updatedCardOne = updatedCards[cardOne.name];
        const updatedCardTwo = updatedCards[cardTwo.name];

        if (!updatedCardOne || !updatedCardTwo) {
          return updatedCards;
        }

        updatedCardOne.faction = cardTwo.faction;
        updatedCardTwo.faction = cardOne.faction;
        if (cardOne.order === 0) {
          updatedCardTwo.order = 0;
          updatedCardOne.order = strategyCardOrder[cardOne.name];
        } else if (cardTwo.order === 0) {
          updatedCardTwo.order = strategyCardOrder[cardTwo.name];
          updatedCardOne.order = 0;
        }

        return updatedCards;
      },
      revalidate: false,
    }
  );
}

export function setFirstStrategyCard(gameId: string, cardName: string) {
  const data: StrategyCardUpdateData = {
    action: "GIFT_OF_PRESCIENCE",
    card: cardName,
  };

  mutate(
    `/api/${gameId}/strategycards`,
    async () => await poster(`/api/${gameId}/cardUpdate`, data),
    {
      optimisticData: (strategyCards: Record<string, StrategyCard>) => {
        const updatedCards = structuredClone(strategyCards);

        const card = updatedCards[cardName];
        if (!card) {
          return updatedCards;
        }

        for (const otherCard of Object.values(updatedCards)) {
          if (otherCard.order === 0) {
            otherCard.order = strategyCardOrder[otherCard.name];
          }
        }
        card.order = 0;

        return updatedCards;
      },
      revalidate: false,
    }
  );
}

export async function unassignStrategyCard(gameId: string, cardName: string) {
  const data: StrategyCardUpdateData = {
    action: "PUBLIC_DISGRACE",
    card: cardName,
  };

  let factionName: string | undefined;

  mutate(
    `/api/${gameId}/strategycards`,
    async () => await poster(`/api/${gameId}/cardUpdate`, data),
    {
      optimisticData: (strategyCards: Record<string, StrategyCard>) => {
        const updatedCards = structuredClone(strategyCards);

        const card = updatedCards[cardName];

        if (!card) {
          return updatedCards;
        }

        factionName = card.faction;

        if (!factionName) {
          return updatedCards;
        }

        delete card.faction;
        card.order = strategyCardOrder[card.name];

        return updatedCards;
      },
      revalidate: false,
    }
  );

  if (!factionName) {
    return;
  }

  // TODO: Consider whether there's a better option.
  // Maybe split the backend changes to have separate updates?
  mutate(
    `/api/${gameId}/state`,
    (state: {}) => {
      return {
        ...structuredClone(state),
        activeplayer: factionName,
      };
    },
    {
      revalidate: false,
    }
  );
}

export function assignStrategyCard(
  gameId: string,
  cardName: string,
  factionName: string
) {
  const data: StrategyCardUpdateData = {
    action: "ASSIGN_STRATEGY_CARD",
    card: cardName,
    faction: factionName,
  };

  mutate(
    `/api/${gameId}/strategycards`,
    async () => await poster(`/api/${gameId}/cardUpdate`, data),
    {
      optimisticData: (strategyCards: Record<string, StrategyCard>) => {
        const updatedCards = structuredClone(strategyCards);

        const card = updatedCards[cardName];

        if (!card) {
          return updatedCards;
        }

        card.faction = factionName;

        return updatedCards;
      },
      revalidate: false,
    }
  );
}
