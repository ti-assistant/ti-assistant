import { createIntl, createIntlCache } from "react-intl";
import { buildFactions, buildStrategyCards } from "../../data/GameData";
import { getOnDeckFaction } from "../helpers";

export class AssignStrategyCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: AssignStrategyCardData
  ) {}

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    if (this.gameData.state.activeplayer !== this.data.event.pickedBy) {
      return false;
    }
    const strategycards = buildStrategyCards(this.gameData, intl);

    const numCards = Object.values(strategycards).reduce((value, card) => {
      if (card.faction === this.data.event.assignedTo) {
        return value + 1;
      }
      return value;
    }, 0);
    const factions = buildFactions(this.gameData, intl);

    switch (Object.keys(factions).length) {
      case 3:
      case 4:
        return numCards < 2;
      case 5:
      case 6:
      case 7:
      case 8:
        return numCards < 1;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`strategycards.${this.data.event.id}.faction`]:
        this.data.event.assignedTo,
    };

    // TODO: Only update card if lower than other Naalu card.
    if (this.data.event.assignedTo === "Naalu Collective") {
      updates[`strategycards.${this.data.event.id}.order`] = 0;
    }
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const onDeckFaction = getOnDeckFaction(
      this.gameData.state,
      buildFactions(this.gameData, intl),
      buildStrategyCards(this.gameData, intl)
    );

    updates[`state.activeplayer`] = onDeckFaction ? onDeckFaction.name : "None";

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    // Should never be allowed.
    return "IGNORE";
  }
}

export class UnassignStrategyCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnassignStrategyCardData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`strategycards.${this.data.event.id}.faction`]: "DELETE",
      [`strategycards.${this.data.event.id}.order`]: "DELETE",
    };

    updates[`state.activeplayer`] = this.data.event.pickedBy;

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
      entry.data.action === "ASSIGN_STRATEGY_CARD" &&
      entry.data.event.assignedTo === this.data.event.assignedTo &&
      entry.data.event.id === this.data.event.id &&
      entry.data.event.pickedBy === this.data.event.pickedBy
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}
