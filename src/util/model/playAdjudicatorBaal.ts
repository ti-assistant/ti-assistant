import { buildSystems } from "../../data/GameData";

export class PlayAdjudicatorBaalHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayAdjudicatorBaalData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`leaders.Adjudicator Ba'al.state`]: "purged",
    };

    const newMapString = (this.gameData.options["map-string"] ?? "")
      .split(" ")
      .map((system) => {
        if (system == this.data.event.systemId) {
          return "81";
        }
        return system;
      })
      .join(" ");

    updates[`options.map-string`] = newMapString;

    const system = buildSystems(this.gameData)[this.data.event.systemId];
    if (!system) {
      return updates;
    }

    for (const planet of system.planets) {
      updates[`planets.${planet}.state`] = "PURGED";
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (entry.data.action === "PLAY_ADJUDICATOR_BAAL") {
      return "REPLACE";
    }

    return "IGNORE";
  }
}

export class UndoAdjudicatorBaalHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UndoAdjudicatorBaalData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`leaders.Adjudicator Ba'al.state`]: "readied",
    };

    const newMapString = (this.gameData.options["map-string"] ?? "")
      .split(" ")
      .map((system) => {
        if (system == "81") {
          return this.data.event.systemId;
        }
        return system;
      })
      .join(" ");

    updates[`options.map-string`] = newMapString;

    const system = buildSystems(this.gameData)[this.data.event.systemId];
    if (!system) {
      return updates;
    }

    for (const planet of system.planets) {
      updates[`planets.${planet}.state`] = "DELETE";
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (entry.data.action === "PLAY_ADJUDICATOR_BAAL") {
      return "DELETE";
    }

    return "IGNORE";
  }
}
