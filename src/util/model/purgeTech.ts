export class PurgeTechHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: PurgeTechData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    if (this.data.event.factionId) {
      updates[
        `factions.${this.data.event.factionId}.techs.${this.data.event.techId}.state`
      ] = "purged";
    } else {
      updates[`techs.${this.data.event.techId}.state`] = "purged";
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
      entry.data.action === "UNPURGE_TECH" &&
      entry.data.event.techId === this.data.event.techId &&
      entry.data.event.factionId === this.data.event.factionId
    ) {
      return "DELETE";
    }
    return "IGNORE";
  }
}

export class UnpurgeTechHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: UnpurgeTechData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    if (this.data.event.factionId) {
      updates[
        `factions.${this.data.event.factionId}.techs.${this.data.event.techId}.state`
      ] = "ready";
    } else {
      updates[`techs.${this.data.event.techId}.state`] = "DELETE";
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
      entry.data.action === "PURGE_TECH" &&
      entry.data.event.techId === this.data.event.techId &&
      entry.data.event.factionId === this.data.event.factionId
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
