import { buildFactions } from "../../data/GameData";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface ManualVPUpdateEvent {
  faction: string;
  vps: number;
}

export interface ManualVPUpdateData {
  action: "MANUAL_VP_UPDATE";
  event: ManualVPUpdateEvent;
}

export class ManualVPUpdateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ManualVPUpdateData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    // Reset order for all other cards
    const factionVPs =
      buildFactions(this.gameData)[this.data.event.faction]?.vps ?? 0;
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`factions.${this.data.event.faction}.vps`]:
        factionVPs + this.data.event.vps,
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
      entry.data.action === "MANUAL_VP_UPDATE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.vps + this.data.event.vps === 0
    ) {
      return "DELETE";
    }
    // Should never be allowed.
    return "IGNORE";
  }
}
