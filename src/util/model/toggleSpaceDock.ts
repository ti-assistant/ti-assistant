export class ToggleStructureHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ToggleStructureData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    switch (this.data.event.structure) {
      case "Space Dock":
        const update = this.data.event.change === "Add" ? true : "DELETE";
        updates[`planets.${this.data.event.planetId}.spaceDock`] = update;
        break;
      case "PDS":
        return updates;
    }

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
      entry.data.action === "TOGGLE_STRUCTURE" &&
      entry.data.event.structure === this.data.event.structure &&
      entry.data.event.planetId === this.data.event.planetId &&
      entry.data.event.change !== this.data.event.change
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
