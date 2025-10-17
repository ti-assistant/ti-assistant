import { ClaimPlanetHandler, UnclaimPlanetHandler } from "./claimPlanet";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "./scoreObjective";
import { UpdateBreakthroughStateHandler } from "./updateBreakthroughState";

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

    if (this.data.event.relic === "The Triad") {
      const planetHandler = new ClaimPlanetHandler(this.gameData, {
        action: "CLAIM_PLANET",
        event: {
          faction: this.data.event.faction,
          planet: "The Triad",
        },
      });

      updates = {
        ...updates,
        ...planetHandler.getUpdates(),
      };
    }
    if (this.data.event.relic === "The Quantumcore") {
      const breakthroughHandler = new UpdateBreakthroughStateHandler(
        this.gameData,
        {
          action: "UPDATE_BREAKTHROUGH_STATE",
          event: {
            factionId: this.data.event.faction,
            state: "readied",
          },
        }
      );

      updates = {
        ...updates,
        ...breakthroughHandler.getUpdates(),
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
    if (
      entry.data.action === "LOSE_RELIC" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.relic === this.data.event.relic
    ) {
      return "DELETE";
    }

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

    if (this.data.event.relic === "The Triad") {
      const planetHandler = new UnclaimPlanetHandler(this.gameData, {
        action: "UNCLAIM_PLANET",
        event: {
          faction: this.data.event.faction,
          planet: "The Triad",
        },
      });

      updates = {
        ...updates,
        ...planetHandler.getUpdates(),
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
    if (
      entry.data.action === "GAIN_RELIC" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.relic === this.data.event.relic
    ) {
      // Book of Latvinia has an effect on gain, so need to remove it.
      if (entry.data.event.relic === "Book of Latvinia") {
        return "REWIND_AND_DELETE";
      }
      return "DELETE";
    }

    return "IGNORE";
  }
}
