import { buildFactions } from "../../data/GameData";

export class MarkSecondaryHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: MarkSecondaryData
  ) {}

  validate(): boolean {
    const faction = buildFactions(this.gameData)[this.data.event.faction];
    if (!faction) {
      return false;
    }
    return faction.secondary !== this.data.event.state;
  }

  getUpdates(): Record<string, any> {
    return {
      [`state.paused`]: false,
      [`factions.${this.data.event.faction}.secondary`]: this.data.event.state,
    };
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "MARK_SECONDARY" &&
      entry.data.event.faction === this.data.event.faction
    ) {
      if (this.data.event.state === "PENDING") {
        return "DELETE";
      }
      return "REPLACE";
    }

    return "IGNORE";
  }
}
