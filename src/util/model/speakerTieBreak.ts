export class SpeakerTieBreakHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SpeakerTieBreakData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
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
    if (entry.data.action === "SPEAKER_TIE_BREAK") {
      if (this.data.event.tieBreak === "None") {
        return "DELETE";
      }
      return "REPLACE";
    }
    return "IGNORE";
  }
}
