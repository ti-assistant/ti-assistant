export class JoinSpliceHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: JoinSpliceData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
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
    if (
      entry.data.action === "JOIN_SPLICE" &&
      entry.data.event.factionId === this.data.event.factionId
    ) {
      return "REPLACE";
    }
    if (
      entry.data.action === "LEAVE_SPLICE" &&
      entry.data.event.factionId === this.data.event.factionId
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}

export class LeaveSpliceHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: LeaveSpliceData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
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
    if (
      entry.data.action === "JOIN_SPLICE" &&
      entry.data.event.factionId === this.data.event.factionId
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
