import { createIntl, createIntlCache } from "react-intl";
import { buildFactions, buildStrategyCards } from "../../data/GameData";
import { getSelectedAction } from "../api/data";
import { getOnDeckFaction } from "../helpers";

export class UnpassHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: UnpassData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`factions.${this.data.event.factionId}.passed`]: "DELETE",
      [`state.activeplayer`]: this.data.event.factionId,
      [`leaders.Director Nel.state`]: "purged",
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (entry.data.action === "PASS") {
      return "DELETE";
    }
    return "IGNORE";
  }
}

export class PassHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: PassData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`factions.${this.data.event.factionId}.passed`]: true,
      [`state.activeplayer`]: "None",
      [`leaders.Director Nel.state`]: "readied",
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (entry.data.action === "UNPASS") {
      return "DELETE";
    }
    return "IGNORE";
  }
}
