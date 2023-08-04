import { buildObjectives } from "../../data/GameData";
import { Handler, ActionLogAction } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface RevealObjectiveEvent {
  objective: string;
}

export interface RevealObjectiveData {
  action: "REVEAL_OBJECTIVE";
  event: RevealObjectiveEvent;
}

export interface HideObjectiveData {
  action: "HIDE_OBJECTIVE";
  event: RevealObjectiveEvent;
}

export class RevealObjectiveHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: RevealObjectiveData
  ) {}

  validate(): boolean {
    const objectives = buildObjectives(this.gameData);
    const objective = objectives[this.data.event.objective];

    if (!objective || objective.selected) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`objectives.${this.data.event.objective}.selected`]: true,
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: {
        action: "REVEAL_OBJECTIVE",
        event: this.data.event,
      },
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "HIDE_OBJECTIVE" &&
      entry.data.event.objective === this.data.event.objective
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class HideObjectiveHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: HideObjectiveData
  ) {}

  validate(): boolean {
    const objectives = buildObjectives(this.gameData);
    const objective = objectives[this.data.event.objective];

    if (!objective || !objective.selected) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`objectives.${this.data.event.objective}.selected`]: "DELETE",
      // [`objectives.${this.data.event.objective}.revealOrder`]: "DELETE",
    };

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: {
        action: "HIDE_OBJECTIVE",
        event: this.data.event,
      },
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "REVEAL_OBJECTIVE" &&
      entry.data.event.objective === this.data.event.objective
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}