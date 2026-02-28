export class EndGameHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: EndGameData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    return {
      [`state.finalPhase`]: this.gameData.state.phase,
      [`sequenceNum`]: "INCREMENT",
      [`state.phase`]: "END",
    };
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
      schema: "1.0.0",
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    return "IGNORE";
  }
}

export class ContinueGameHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ContinueGameData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    return {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`state.finalPhase`]: "DELETE",
      [`state.phase`]: this.gameData.state.finalPhase,
    };
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
      schema: "1.0.0",
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (entry.data.action === "END_GAME") {
      return "DELETE";
    }
    return "IGNORE";
  }
}
