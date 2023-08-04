import { buildFactions, buildStrategyCards } from "../../data/GameData";
import { StrategyCardName } from "../api/cards";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";
import { getOnDeckFaction } from "../helpers";

export interface AssignStrategyCardEvent {
  assignedTo: string;
  name: StrategyCardName;
  pickedBy: string;
}

export interface AssignStrategyCardData {
  action: "ASSIGN_STRATEGY_CARD";
  event: AssignStrategyCardEvent;
}

export interface UnassignStrategyCardData {
  action: "UNASSIGN_STRATEGY_CARD";
  event: AssignStrategyCardEvent;
}

export class AssignStrategyCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: AssignStrategyCardData
  ) {}

  validate(): boolean {
    if (this.gameData.state.activeplayer !== this.data.event.pickedBy) {
      return false;
    }
    const strategycards = buildStrategyCards(this.gameData);

    const numCards = Object.values(strategycards).reduce((value, card) => {
      if (card.faction === this.data.event.assignedTo) {
        return value + 1;
      }
      return value;
    }, 0);

    const factions = buildFactions(this.gameData);

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
      [`strategycards.${this.data.event.name}.faction`]:
        this.data.event.assignedTo,
    };

    // TODO: Only update card if lower than other Naalu card.
    if (this.data.event.assignedTo === "Naalu Collective") {
      updates[`strategycards.${this.data.event.name}.order`] = 0;
    }

    const onDeckFaction = getOnDeckFaction(
      this.gameData.state,
      buildFactions(this.gameData),
      buildStrategyCards(this.gameData)
    );

    updates[`state.activeplayer`] = onDeckFaction ? onDeckFaction.name : "None";

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
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
      [`strategycards.${this.data.event.name}.faction`]: "DELETE",
      [`strategycards.${this.data.event.name}.order`]: "DELETE",
    };

    updates[`state.activeplayer`] = this.data.event.pickedBy;

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
      entry.data.action === "ASSIGN_STRATEGY_CARD" &&
      entry.data.event.assignedTo === this.data.event.assignedTo &&
      entry.data.event.name === this.data.event.name &&
      entry.data.event.pickedBy === this.data.event.pickedBy
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}
