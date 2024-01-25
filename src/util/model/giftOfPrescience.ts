import { createIntl, createIntlCache } from "react-intl";
import { buildStrategyCards } from "../../data/GameData";

const GIFT_OF_PRESCIENCE_FACTION = "Naalu Collective" as const;

export class GiftOfPrescienceHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: GiftOfPrescienceData
  ) {}

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const strategyCards = buildStrategyCards(this.gameData, intl);

    for (const card of Object.values(strategyCards)) {
      if (card.faction === this.data.event.faction && card.order === 0) {
        return false;
      }
    }
    return true;
  }

  getUpdates(): Record<string, any> {
    // Reset order for all other cards
    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    for (const cardId of Object.keys(this.gameData.strategycards ?? {})) {
      updates[`strategycards.${cardId}.order`] = "DELETE";
    }

    // Find the first card for this faction and update it.
    const strategyCards = buildStrategyCards(this.gameData, intl);
    let minCard: StrategyCard | undefined;
    for (const card of Object.values(strategyCards)) {
      if (
        card.faction === this.data.event.faction &&
        (!minCard || minCard.order > card.order)
      ) {
        minCard = card;
      }
    }

    if (!minCard) {
      return {};
    }

    updates[`strategycards.${minCard.id}.order`] = 0;

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
      entry.data.action === "GIFT_OF_PRESCIENCE" &&
      this.data.event.faction === GIFT_OF_PRESCIENCE_FACTION
    ) {
      return "DELETE";
    }
    // Should never be allowed.
    return "IGNORE";
  }
}
