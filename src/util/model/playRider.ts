export class PlayRiderHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: PlayRiderData) {}

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
      entry.data.action === "PLAY_RIDER" &&
      entry.data.event.rider === this.data.event.rider
    ) {
      return "REPLACE";
    }
    return "IGNORE";
  }
}

export class UnplayRiderHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: UnplayRiderData) {}

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
      entry.data.action === "PLAY_RIDER" &&
      entry.data.event.rider === this.data.event.rider
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
