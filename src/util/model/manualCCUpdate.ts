export class ManualCCUpdateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ManualCCUpdateData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const commandCounters =
      this.gameData.factions[this.data.event.faction]?.commandCounters ?? 8;

    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`factions.${this.data.event.faction}.commandCounters`]:
        commandCounters + this.data.event.commandCounters,
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
      entry.data.action === "MANUAL_CC_UPDATE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.commandCounters + this.data.event.commandCounters === 0
    ) {
      return "DELETE";
    }
    // Should never be allowed.
    return "IGNORE";
  }
}
