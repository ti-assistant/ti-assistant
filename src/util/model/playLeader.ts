import { createIntl, createIntlCache } from "react-intl";
import { buildLeaders } from "../../data/GameData";

export class PlayLeaderHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayLeaderData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);

    const leader = buildLeaders(this.gameData, intl)[this.data.event.leader];

    if (!leader) {
      return {};
    }

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    switch (leader.type) {
      case "AGENT":
        updates[`leaders.${this.data.event.leader}.state`] = "exhausted";
        break;
      case "HERO":
        updates[`leaders.${this.data.event.leader}.state`] = "purged";
        break;
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
      entry.data.action === "UNPLAY_LEADER" &&
      entry.data.event.leader === this.data.event.leader
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class UnplayLeaderHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnplayLeaderData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`leaders.${this.data.event.leader}.state`]: "readied",
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
    if (
      entry.data.action === "PLAY_LEADER" &&
      entry.data.event.leader === this.data.event.leader
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
