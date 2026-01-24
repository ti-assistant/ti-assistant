export class ToggleStructureHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ToggleStructureData,
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
      case "PDS": {
        const numPds =
          this.gameData.planets[this.data.event.planetId]?.pds ?? 0;
        let update: number | "DELETE" =
          this.data.event.change === "Add"
            ? Math.min(numPds + 1, 2)
            : numPds - 1;
        if (update <= 0) {
          update = "DELETE";
        }
        updates[`planets.${this.data.event.planetId}.pds`] = update;
        break;
      }
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
