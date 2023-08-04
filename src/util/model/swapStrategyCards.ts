import { buildStrategyCards } from "../../data/GameData";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface SwapStrategyCardsEvent {
  cardOne: string;
  cardTwo: string;
  imperialArbiter?: boolean;
}

export interface SwapStrategyCardsData {
  action: "SWAP_STRATEGY_CARDS";
  event: SwapStrategyCardsEvent;
}

export interface UnswapStrategyCardsData {
  action: "UNSWAP_STRATEGY_CARDS";
  event: SwapStrategyCardsEvent;
}

export class SwapStrategyCardsHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SwapStrategyCardsData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const strategyCards = buildStrategyCards(this.gameData);
    const cardOne = strategyCards[this.data.event.cardOne];
    const cardTwo = strategyCards[this.data.event.cardTwo];

    if (!cardOne || !cardTwo) {
      return {};
    }

    const factionOne = cardOne.faction;
    const factionTwo = cardTwo.faction;

    if (!factionOne || !factionTwo) {
      return {};
    }

    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`strategycards.${this.data.event.cardOne}.faction`]: factionTwo,
      [`strategycards.${this.data.event.cardOne}.order`]: "DELETE",
      [`strategycards.${this.data.event.cardTwo}.faction`]: factionOne,
      [`strategycards.${this.data.event.cardTwo}.order`]: "DELETE",
    };

    // If faction was going first, find first card and update order.
    // May not work for 3-4 player games.
    let zeroFaction: string | undefined;
    if (cardOne.order === 0) {
      updates[`strategycards.${cardTwo.name}.order`] = 0;
      zeroFaction = factionOne;
    }
    if (cardTwo.order === 0) {
      updates[`strategycards.${cardOne.name}.order`] = 0;
      zeroFaction = factionTwo;
    }

    if (this.data.event.imperialArbiter) {
      updates[`agendas.Imperial Arbiter.passed`] = false;
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    return "IGNORE";
  }
}

export class UnswapStrategyCardsHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnswapStrategyCardsData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const strategyCards = buildStrategyCards(this.gameData);
    const cardOne = strategyCards[this.data.event.cardOne];
    const cardTwo = strategyCards[this.data.event.cardTwo];

    if (!cardOne || !cardTwo) {
      return {};
    }

    const factionOne = cardOne.faction;
    const factionTwo = cardTwo.faction;

    if (!factionOne || !factionTwo) {
      return {};
    }

    const updates: Record<string, any> = {
      [`strategycards.${this.data.event.cardOne}.faction`]: factionTwo,
      [`strategycards.${this.data.event.cardOne}.order`]: "DELETE",
      [`strategycards.${this.data.event.cardTwo}.faction`]: factionOne,
      [`strategycards.${this.data.event.cardTwo}.order`]: "DELETE",
    };

    // If faction was going first, find first card and update order.
    let zeroFaction: string | undefined;
    if (cardOne.order === 0) {
      updates[`strategycards.${cardTwo.name}.order`] = 0;
      zeroFaction = factionOne;
    }
    if (cardTwo.order === 0) {
      updates[`strategycards.${cardOne.name}.order`] = 0;
      zeroFaction = factionTwo;
    }

    if (this.data.event.imperialArbiter) {
      updates[`agendas.Imperial Arbiter.passed`] = true;
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "SWAP_STRATEGY_CARDS" &&
      entry.data.event.cardOne === this.data.event.cardOne &&
      entry.data.event.cardTwo === this.data.event.cardTwo
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
