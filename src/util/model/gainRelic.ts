import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "./scoreObjective";

export class GainRelicHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: GainRelicData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`relics.${this.data.event.relic}.owner`]: this.data.event.faction,
    };

    if (this.data.event.relic === "Shard of the Throne") {
      const scoreHandler = new ScoreObjectiveHandler(this.gameData, {
        action: "SCORE_OBJECTIVE",
        event: {
          faction: this.data.event.faction,
          objective: this.data.event.relic,
        },
      });

      updates = {
        ...updates,
        ...scoreHandler.getUpdates(),
      };
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
    return "IGNORE";
  }
}

export class LoseRelicHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: LoseRelicData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`relics.${this.data.event.relic}.owner`]: "DELETE",
    };

    if (this.data.event.relic === "Shard of the Throne") {
      const scoreHandler = new UnscoreObjectiveHandler(this.gameData, {
        action: "UNSCORE_OBJECTIVE",
        event: {
          faction: this.data.event.faction,
          objective: this.data.event.relic,
        },
      });

      updates = {
        ...updates,
        ...scoreHandler.getUpdates(),
      };
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
    // Note: There should only ever be 1 gained relic, so no need to check any fields.
    if (
      entry.data.action === "GAIN_RELIC" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.relic === this.data.event.relic
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
