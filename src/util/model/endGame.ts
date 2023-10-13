export class EndGameHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: EndGameData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    return {
      [`state.finalPhase`]: this.gameData.state.phase,
      [`state.phase`]: "END",
    };
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

export class ContinueGameHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: ContinueGameData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    return {
      [`state.paused`]: false,
      [`state.finalPhase`]: "DELETE",
      [`state.phase`]: this.gameData.state.finalPhase,
    };
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (entry.data.action === "END_GAME") {
      return "DELETE";
    }
    return "IGNORE";
  }
}
