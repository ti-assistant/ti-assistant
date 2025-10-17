import { arrayRemove, arrayUnion } from "../api/util";

export class GainAllianceHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: GainAllianceData) {
    for (const faction of Object.values(gameData.factions)) {
      if (
        faction.id === "Mahact Gene-Sorcerers" ||
        faction.id === data.event.faction
      ) {
        continue;
      }
      if ((faction.alliances ?? []).includes(data.event.fromFaction)) {
        this.data.event.prevFaction = faction.id;
        break;
      }
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const alliances =
      this.gameData.factions[this.data.event.faction]?.alliances ?? [];
    updates[`factions.${this.data.event.faction}.alliances`] = arrayUnion(
      alliances,
      this.data.event.fromFaction
    );

    for (const faction of Object.values(this.gameData.factions)) {
      if (
        faction.id === "Mahact Gene-Sorcerers" ||
        faction.id === this.data.event.faction
      ) {
        continue;
      }
      const alliances = this.gameData.factions[faction.id]?.alliances ?? [];
      updates[`factions.${faction.id}.alliances`] = arrayRemove(
        alliances,
        this.data.event.fromFaction
      );
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
      entry.data.action === "GAIN_ALLIANCE" &&
      entry.data.event.faction === this.data.event.prevFaction &&
      entry.data.event.fromFaction === this.data.event.fromFaction
    ) {
      return "REPLACE";
    }

    if (
      entry.data.action === "LOSE_ALLIANCE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.fromFaction === this.data.event.fromFaction
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class LoseAllianceHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: LoseAllianceData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const alliances =
      this.gameData.factions[this.data.event.faction]?.alliances ?? [];
    updates[`factions.${this.data.event.faction}.alliances`] = arrayRemove(
      alliances,
      this.data.event.fromFaction
    );

    if (this.data.event.prevFaction) {
      const alliances =
        this.gameData.factions[this.data.event.prevFaction]?.alliances ?? [];
      updates[`factions.${this.data.event.prevFaction}.alliances`] = arrayUnion(
        alliances,
        this.data.event.fromFaction
      );
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
      entry.data.action === "GAIN_ALLIANCE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.fromFaction === this.data.event.fromFaction
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
