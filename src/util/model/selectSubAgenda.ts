import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface SelectSubAgendaEvent {
  subAgenda: string;
}

export interface SelectSubAgendaData {
  action: "SELECT_SUB_AGENDA";
  event: SelectSubAgendaEvent;
}

export class SelectSubAgendaHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SelectSubAgendaData
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
    if (entry.data.action === "SELECT_SUB_AGENDA") {
      if (this.data.event.subAgenda === "None") {
        return "REWIND_AND_DELETE";
      }
      return "REWIND_AND_REPLACE";
    }
    return "IGNORE";
  }
}
