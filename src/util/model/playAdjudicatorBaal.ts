import { createIntl, createIntlCache } from "react-intl";
import { buildSystems } from "../../data/GameData";
import { getMapString } from "../options";

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
      [`sequenceNum`]: "INCREMENT",
      [`leaders.Adjudicator Ba'al.state`]: "purged",
    };

    const newMapString = (
      getMapString(
        this.gameData.options,
        Object.keys(this.gameData.factions).length
      ) ?? ""
    )
      .split(" ")
      .map((system) => {
        if (system == this.data.event.systemId) {
          return "81";
        }
        return system;
      })
      .join(" ");

    updates[`options.processed-map-string`] = newMapString;

    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const system = buildSystems(this.gameData, intl)[this.data.event.systemId];
    if (!system) {
      return updates;
    }

    for (const planet of system.planets) {
      updates[`planets.${planet}.state`] = "PURGED";
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
      [`sequenceNum`]: "INCREMENT",
      [`leaders.Adjudicator Ba'al.state`]: "readied",
    };

    const newMapString = (
      getMapString(
        this.gameData.options,
        Object.keys(this.gameData.factions).length
      ) ?? ""
    )
      .split(" ")
      .map((system) => {
        if (system == "81") {
          return this.data.event.systemId;
        }
        return system;
      })
      .join(" ");

    updates[`options.processed-map-string`] = newMapString;

    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const system = buildSystems(this.gameData, intl)[this.data.event.systemId];
    if (!system) {
      return updates;
    }

    for (const planet of system.planets) {
      updates[`planets.${planet}.state`] = "DELETE";
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
    if (entry.data.action === "PLAY_ADJUDICATOR_BAAL") {
      return "DELETE";
    }

    return "IGNORE";
  }
}
