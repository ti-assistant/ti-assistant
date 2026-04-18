import { ClaimPlanetHandler, UnclaimPlanetHandler } from "./claimPlanet";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "./scoreObjective";

export class PurgeRelicHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PurgeRelicData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`relics.${this.data.event.relic}.state`]: "purged",
    };

    const owner = (this.gameData.relics ?? {})[this.data.event.relic]?.owner;

    if (this.data.event.unravel && owner) {
      const scoreHandler = new ScoreObjectiveHandler(this.gameData, {
        action: "SCORE_OBJECTIVE",
        event: {
          faction: owner,
          objective: "Unravel",
        },
      });

      updates = {
        ...updates,
        ...scoreHandler.getUpdates(),
      };
    }

    if (this.data.event.relic === "Shard of the Throne" && owner) {
      const scoreHandler = new UnscoreObjectiveHandler(this.gameData, {
        action: "UNSCORE_OBJECTIVE",
        event: {
          faction: owner,
          objective: this.data.event.relic,
        },
      });

      updates = {
        ...updates,
        ...scoreHandler.getUpdates(),
      };
    }

    if (this.data.event.relic === "The Triad" && owner) {
      const planetHandler = new UnclaimPlanetHandler(this.gameData, {
        action: "UNCLAIM_PLANET",
        event: {
          faction: owner,
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
      entry.data.action === "UNPURGE_RELIC" &&
      entry.data.event.unravel === this.data.event.unravel &&
      entry.data.event.relic === this.data.event.relic
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class UnpurgeRelicHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnpurgeRelicData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`relics.${this.data.event.relic}.state`]: "DELETE",
    };

    const owner = (this.gameData.relics ?? {})[this.data.event.relic]?.owner;

    if (owner && this.data.event.unravel) {
      const scoreHandler = new UnscoreObjectiveHandler(this.gameData, {
        action: "UNSCORE_OBJECTIVE",
        event: {
          faction: owner,
          objective: "Unravel",
        },
      });

      updates = {
        ...updates,
        ...scoreHandler.getUpdates(),
      };
    }

    if (this.data.event.relic === "Shard of the Throne" && owner) {
      const scoreHandler = new ScoreObjectiveHandler(this.gameData, {
        action: "SCORE_OBJECTIVE",
        event: {
          faction: owner,
          objective: this.data.event.relic,
        },
      });

      updates = {
        ...updates,
        ...scoreHandler.getUpdates(),
      };
    }

    if (this.data.event.relic === "The Triad" && owner) {
      const planetHandler = new ClaimPlanetHandler(this.gameData, {
        action: "CLAIM_PLANET",
        event: {
          faction: owner,
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
      entry.data.action === "PURGE_RELIC" &&
      entry.data.event.unravel === this.data.event.unravel &&
      entry.data.event.relic === this.data.event.relic
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
