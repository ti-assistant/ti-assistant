import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface SetObjectivePointsEvent {
  objective: string;
  points: number;
}

export interface SetObjectivePointsData {
  action: "SET_OBJECTIVE_POINTS";
  event: SetObjectivePointsEvent;
}

export class SetObjectivePointsHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SetObjectivePointsData
  ) {}

  validate(): boolean {
    return this.data.event.objective === "Mutiny";
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`objectives.${this.data.event.objective}.points`]:
        this.data.event.points,
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
      entry.data.action === "SET_OBJECTIVE_POINTS" &&
      entry.data.event.objective === this.data.event.objective
    ) {
      if (entry.data.event.points === this.data.event.points) {
        return "REPLACE";
      }
      return "DELETE";
    }
    return "IGNORE";
  }
}
