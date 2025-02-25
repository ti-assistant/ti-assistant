export class SelectFactionHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SelectFactionData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
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
    if (entry.data.action === "SELECT_FACTION") {
      if (this.data.event.faction === "None") {
        return "REWIND_AND_DELETE";
      }
      return "REWIND_AND_REPLACE";
    }
    return "IGNORE";
  }
}
