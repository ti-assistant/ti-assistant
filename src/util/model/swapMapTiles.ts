export class SwapMapTilesHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: SwapMapTilesData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const systems = (this.gameData.options["map-string"] ?? "").split(" ");

    while (
      systems.length < this.data.event.newItem.index - 1 ||
      systems.length < this.data.event.oldItem.index - 1
    ) {
      systems.push("-1");
    }

    systems[this.data.event.oldItem.index - 1] =
      this.data.event.newItem.systemNumber;

    systems[this.data.event.newItem.index - 1] =
      this.data.event.oldItem.systemNumber;

    while (systems.length > 0 && systems[systems.length - 1] === "-1") {
      systems.pop();
    }

    updates[`options.map-string`] = systems.join(" ");

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (entry.data.action === "SWAP_MAP_TILES") {
      return "DELETE";
    }

    return "IGNORE";
  }
}
