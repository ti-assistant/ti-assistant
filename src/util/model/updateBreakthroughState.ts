// Note: This doesn't handle exhausted breakthroughs.
export class UpdateBreakthroughStateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UpdateBreakthroughStateData
  ) {
    const faction = gameData.factions[data.event.factionId];
    const state = faction?.breakthrough?.state;
    if (state) {
      this.data.event.prevState = state;
    } else {
      this.data.event.prevState = "locked";
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`factions.${this.data.event.factionId}.breakthrough.state`]:
        this.data.event.state === "locked" ? "DELETE" : this.data.event.state,
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
      entry.data.action === "UPDATE_BREAKTHROUGH_STATE" &&
      entry.data.event.factionId === this.data.event.factionId
    ) {
      if (
        entry.data.event.prevState === this.data.event.state ||
        !entry.data.event.prevState
      ) {
        return "DELETE";
      }
      return "IGNORE";
    }
    return "IGNORE";
  }
}
