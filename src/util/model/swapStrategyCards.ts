export class SwapStrategyCardsHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SwapStrategyCardsData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const strategyCards = this.gameData.strategycards ?? {};
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
      [`sequenceNum`]: "INCREMENT",
      [`strategycards.${this.data.event.cardOne}.faction`]: factionTwo,
      [`strategycards.${this.data.event.cardOne}.order`]: "DELETE",
      [`strategycards.${this.data.event.cardTwo}.faction`]: factionOne,
      [`strategycards.${this.data.event.cardTwo}.order`]: "DELETE",
    };

    if (this.data.event.imperialArbiter) {
      updates[`agendas.Imperial Arbiter.passed`] = false;
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    return "IGNORE";
  }
}

export class UnswapStrategyCardsHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnswapStrategyCardsData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const strategyCards = this.gameData.strategycards ?? {};
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

    if (this.data.event.imperialArbiter) {
      updates[`agendas.Imperial Arbiter.passed`] = true;
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
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
