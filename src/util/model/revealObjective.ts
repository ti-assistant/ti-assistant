import { createIntl, createIntlCache } from "react-intl";
import { buildObjectives } from "../../data/GameData";

export class RevealObjectiveHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: RevealObjectiveData
  ) {}

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const objectives = buildObjectives(this.gameData, intl);
    const objective = objectives[this.data.event.objective];

    if (!objective || objective.selected) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
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
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const objectives = buildObjectives(this.gameData, intl);
    const objective = objectives[this.data.event.objective];

    if (!objective || !objective.selected) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
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
