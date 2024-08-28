// Should only be used for non-component cards
export class PlayActionCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayActionCardData
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

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    return "IGNORE";
  }
}

export class UnplayActionCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnplayActionCardData
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

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "PLAY_ACTION_CARD" &&
      entry.data.event.card === this.data.event.card &&
      entry.data.event.target === this.data.event.target
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
