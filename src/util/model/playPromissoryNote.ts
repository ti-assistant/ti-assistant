import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

// Should only be used for non-component promissories

export interface PlayPromissoryNoteEvent {
  card: string;

  // The player that played the card, or the target of the card.
  target: string;
}

export interface PlayPromissoryNoteData {
  action: "PLAY_PROMISSORY_NOTE";
  event: PlayPromissoryNoteEvent;
}

export interface UnplayPromissoryNoteData {
  action: "UNPLAY_PROMISSORY_NOTE";
  event: PlayPromissoryNoteEvent;
}

export class PlayPromissoryNoteHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayPromissoryNoteData
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

export class UnplayPromissoryNoteHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnplayPromissoryNoteData
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
      entry.data.action === "PLAY_PROMISSORY_NOTE" &&
      entry.data.event.card === this.data.event.card &&
      entry.data.event.target === this.data.event.target
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
