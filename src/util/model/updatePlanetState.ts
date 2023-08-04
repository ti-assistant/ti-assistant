import { getCurrentTurnLogEntries } from "../api/actionLog";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export type PlanetState = "READIED" | "EXHAUSTED" | "PURGED";

export interface UpdatePlanetStateEvent {
  planet: string;
  state: string;
}

export interface UpdatePlanetStateData {
  action: "UPDATE_PLANET_STATE";
  event: UpdatePlanetStateEvent;
}

// Note: This doesn't handle exhausted planets.
export class UpdatePlanetStateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UpdatePlanetStateData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`planets.${this.data.event.planet}.state`]: this.data.event.state,
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
      entry.data.action === "UPDATE_PLANET_STATE" &&
      entry.data.event.planet === this.data.event.planet
    ) {
      if (this.data.event.state === "READIED") {
        return "DELETE";
      }
      return "REPLACE";
    }
    return "IGNORE";
  }
}
