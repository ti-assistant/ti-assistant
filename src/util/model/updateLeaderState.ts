// Note: This doesn't handle exhausted leaders.
export class UpdateLeaderStateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UpdateLeaderStateData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    switch (this.data.event.leaderType) {
      case "COMMANDER": {
        updates[`factions.${this.data.event.factionId}.commander`] =
          this.data.event.state;
        break;
      }
      case "HERO": {
        updates[`factions.${this.data.event.factionId}.hero`] =
          this.data.event.state;
        break;
      }
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
      entry.data.action === "UPDATE_LEADER_STATE" &&
      entry.data.event.factionId === this.data.event.factionId &&
      entry.data.event.leaderType === this.data.event.leaderType
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}
