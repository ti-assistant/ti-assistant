import { getCurrentTurnLogEntries } from "../api/actionLog";

export class SetTyrantHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: SetTyrantData) {
    if (this.gameData.state.tyrant) {
      this.data.event.prevTyrant = this.gameData.state.tyrant;
    }
  }

  validate(): boolean {
    return (
      this.gameData.state.tyrant !== this.data.event.newTyrant &&
      this.gameData.state.speaker !== this.data.event.newTyrant
    );
  }

  getUpdates(): Record<string, any> {
    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      const action = this.getActionLogAction(entry);
      if (action === "REPLACE") {
        this.data.event.prevTyrant = (
          entry.data as SetTyrantData
        ).event.prevTyrant;
      }
    }

    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`state.tyrant`]: this.data.event.newTyrant ?? "DELETE",
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    if (!this.data.event.prevTyrant) {
      delete this.data.event.prevTyrant;
    }
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (entry.data.action === "SET_TYRANT") {
      if (entry.data.event.prevTyrant === this.data.event.newTyrant) {
        return "DELETE";
      }
      return "REPLACE";
    }

    return "IGNORE";
  }
}
