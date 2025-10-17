import { createIntl, createIntlCache } from "react-intl";
import { buildPlanets } from "../../data/GameData";

export class PurgeSystemHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: PurgeSystemData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`systems.${this.data.event.systemId}.purged`]: true,
    };

    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const planets = buildPlanets(this.gameData, intl);

    for (const planet of Object.values(planets)) {
      if (planet.system === this.data.event.systemId) {
        updates[`planets.${planet.id}.state`] = "PURGED";
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
      entry.data.action === "UNPURGE_SYSTEM" &&
      entry.data.event.systemId === this.data.event.systemId
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}

export class UnpurgeSystemHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnpurgeSystemData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`systems.${this.data.event.systemId}.purged`]: "DELETE",
    };

    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const planets = buildPlanets(this.gameData, intl, true);

    for (const planet of Object.values(planets)) {
      if (planet.system === this.data.event.systemId) {
        updates[`planets.${planet.id}.state`] = "DELETE";
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
      entry.data.action === "PURGE_SYSTEM" &&
      entry.data.event.systemId === this.data.event.systemId
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
