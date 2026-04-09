export class UseGenomeHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UseGenomeData,
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
    return "IGNORE";
  }
}

export class UndoGenomeHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UndoGenomeData,
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
      entry.data.action === "USE_GENOME" &&
      entry.data.event.genomeId === this.data.event.genomeId
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
