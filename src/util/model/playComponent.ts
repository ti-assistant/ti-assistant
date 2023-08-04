import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";
import { AddAttachmentHandler, RemoveAttachmentHandler } from "./addAttachment";

export interface PlayComponentEvent {
  name: string;
}

export interface PlayComponentData {
  action: "PLAY_COMPONENT";
  event: PlayComponentEvent;
}

export interface UnplayComponentData {
  action: "UNPLAY_COMPONENT";
  event: PlayComponentEvent;
}

export class PlayComponentHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: PlayComponentData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    if (this.data.event.name === "Ul the Progenitor") {
      const handler = new AddAttachmentHandler(this.gameData, {
        action: "ADD_ATTACHMENT",
        event: {
          planet: "Elysium",
          attachment: "Ul the Progenitor",
        },
      });
      updates = {
        ...updates,
        ...handler.getUpdates(),
      };
    }

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

export class UnplayComponentHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnplayComponentData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    if (this.data.event.name === "Ul the Progenitor") {
      const handler = new RemoveAttachmentHandler(this.gameData, {
        action: "REMOVE_ATTACHMENT",
        event: {
          planet: "Elysium",
          attachment: "Ul the Progenitor",
        },
      });
      updates = {
        ...updates,
        ...handler.getUpdates(),
      };
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    // Note: There should only ever be 1 played component, so no need to check any fields.
    if (entry.data.action === "PLAY_COMPONENT") {
      return "REWIND_AND_DELETE";
    }

    return "IGNORE";
  }
}
