import { OutcomeType } from "../api/agendas";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface SelectEligibleOutcomesEvent {
  outcomes: OutcomeType | "None";
}

export interface SelectEligibleOutcomesData {
  action: "SELECT_ELIGIBLE_OUTCOMES";
  event: SelectEligibleOutcomesEvent;
}

export class SelectEligibleOutcomesHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SelectEligibleOutcomesData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
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
    if (entry.data.action === "SELECT_ELIGIBLE_OUTCOMES") {
      if (this.data.event.outcomes === "None") {
        return "REWIND_AND_DELETE";
      }
      return "REWIND_AND_REPLACE";
    }
    return "IGNORE";
  }
}
