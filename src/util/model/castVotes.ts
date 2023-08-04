import { Handler, ActionLogAction } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface CastVotesEvent {
  faction: string;
  target?: string;
  votes: number;
}

export interface CastVotesData {
  action: "CAST_VOTES";
  event: CastVotesEvent;
}

export class CastVotesHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: CastVotesData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    return {
      [`state.paused`]: false,
    };
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "CAST_VOTES" &&
      entry.data.event.faction === this.data.event.faction
    ) {
      if (!this.data.event.target) {
        return "DELETE";
      }
      return "REPLACE";
    }
    return "IGNORE";
  }
}
