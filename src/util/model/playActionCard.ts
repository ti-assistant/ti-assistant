import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

// Should only be used for non-component cards

export interface PlayActionCardEvent {
  card: string;

  // The player that played the card, or the target of the card.
  target: string;
}

export interface PlayActionCardData {
  action: "PLAY_ACTION_CARD";
  event: PlayActionCardEvent;
}

export interface UnplayActionCardData {
  action: "UNPLAY_ACTION_CARD";
  event: PlayActionCardEvent;
}

export class PlayActionCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayActionCardData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    return "IGNORE";
  }
}

export class UnplayActionCardHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnplayActionCardData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "PLAY_ACTION_CARD" &&
      entry.data.event.card === this.data.event.card &&
      entry.data.event.target === this.data.event.target
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
