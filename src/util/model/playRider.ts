import { OutcomeType } from "../api/agendas";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface PlayRiderEvent {
  rider: string;

  faction?: string;
  outcome?: OutcomeType;
}

export interface PlayRiderData {
  action: "PLAY_RIDER";
  event: PlayRiderEvent;
}

export interface UnplayRiderData {
  action: "UNPLAY_RIDER";
  event: PlayRiderEvent;
}

export class PlayRiderHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: PlayRiderData) {}

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
      entry.data.action === "PLAY_RIDER" &&
      entry.data.event.rider === this.data.event.rider
    ) {
      return "REPLACE";
    }
    return "IGNORE";
  }
}

export class UnplayRiderHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: UnplayRiderData) {}

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
      entry.data.action === "PLAY_RIDER" &&
      entry.data.event.rider === this.data.event.rider
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
