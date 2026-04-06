export class ChooseEdictHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ChooseEdictData,
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
      entry.data.action === "HIDE_EDICT" &&
      entry.data.event.edictId === this.data.event.edictId &&
      entry.data.event.tyrant === this.data.event.tyrant
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}

export class HideEdictHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: HideEdictData,
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
      entry.data.action === "CHOOSE_EDICT" &&
      entry.data.event.edictId === this.data.event.edictId &&
      entry.data.event.tyrant === this.data.event.tyrant
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
