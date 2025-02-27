import { getMapString } from "../options";

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

    const mapString = getMapString(
      this.gameData.options,
      Object.keys(this.gameData.factions).length
    );

    if (!mapString) {
      return {};
    }
    const systems = mapString.split(" ");

    while (
      systems.length < this.data.event.newItem.index - 1 ||
      systems.length < this.data.event.oldItem.index - 1
    ) {
      systems.push("-1");
    }
    let updatedSystemTiles = mapString.split(" ");

    const actualOldSystem = updatedSystemTiles[this.data.event.oldItem.index];
    const actualNewSystem = updatedSystemTiles[this.data.event.newItem.index];

    // Mallice
    if (this.data.event.oldItem.index === -2) {
      updates[`options.mallice`] =
        actualNewSystem ?? this.data.event.newItem.systemNumber;
    } else {
      updatedSystemTiles[this.data.event.oldItem.index] =
        actualNewSystem ?? this.data.event.newItem.systemNumber;
    }
    if (this.data.event.newItem.index === -2) {
      updates[`options.mallice`] =
        actualOldSystem ?? this.data.event.oldItem.systemNumber;
    } else {
      updatedSystemTiles[this.data.event.newItem.index] =
        actualOldSystem ?? this.data.event.oldItem.systemNumber;
    }

    while (
      updatedSystemTiles.length > 0 &&
      (updatedSystemTiles[updatedSystemTiles.length - 1] === "-1" ||
        !updatedSystemTiles[updatedSystemTiles.length - 1])
    ) {
      updatedSystemTiles.pop();
    }

    updates[`options.processed-map-string`] = updatedSystemTiles.join(" ");

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (entry.data.action === "SWAP_MAP_TILES") {
      return "DELETE";
    }

    return "IGNORE";
  }
}

function mergeMapStrings(a: string, b: string) {
  let output = [];
  const aArray = a.split(" ");
  const bArray = b.split(" ");
  let totalLength = Math.max(aArray.length, bArray.length);
  for (let i = 0; i < aArray.length; i++) {
    const aValue = aArray[i];
    const bValue = bArray[i];
    output.push(mapValuePriority(aValue, bValue));
  }
  return output.join(" ");
}

function mapValuePriority(a?: string, b?: string) {
  if (!a) {
    if (!b) {
      return a;
    }
    return b;
  }
  if (!b) {
    return a;
  }
  if (a === "0") {
    return b;
  }
  if (b === "0") {
    return a;
  }
  return a;
}
