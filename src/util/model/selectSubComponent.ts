export class SelectSubComponentHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SelectSubComponentData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (entry.data.action === "SELECT_SUB_COMPONENT") {
      if (this.data.event.subComponent === "None") {
        return "REWIND_AND_DELETE";
      }
      return "REWIND_AND_REPLACE";
    }
    return "IGNORE";
  }
}
