// Should only be used for non-component promissories
export class PlayPromissoryNoteHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayPromissoryNoteData
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

export class UnplayPromissoryNoteHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnplayPromissoryNoteData
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
      entry.data.action === "PLAY_PROMISSORY_NOTE" &&
      entry.data.event.card === this.data.event.card &&
      entry.data.event.target === this.data.event.target
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
