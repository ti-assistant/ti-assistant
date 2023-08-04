import { getCurrentTurnLogEntries } from "../api/actionLog";
import { ActionLogAction, Handler } from "../api/data";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface SetSpeakerEvent {
  newSpeaker: string;
  // Set by server, used for undo.
  prevSpeaker?: string;
}

export interface SetSpeakerData {
  action: "SET_SPEAKER";
  event: SetSpeakerEvent;
}

export class SetSpeakerHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: SetSpeakerData) {}

  validate(): boolean {
    return this.gameData.state.speaker !== this.data.event.newSpeaker;
  }

  getUpdates(): Record<string, any> {
    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      const action = this.getActionLogAction(entry);
      if (action === "REPLACE") {
        this.data.event.prevSpeaker = (
          entry.data as SetSpeakerData
        ).event.prevSpeaker;
      }
    }

    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`state.speaker`]: this.data.event.newSpeaker,
    };

    if (
      this.gameData.state.phase === "STRATEGY" &&
      this.gameData.state.speaker === this.gameData.state.activeplayer
    ) {
      updates[`state.activeplayer`] = this.data.event.newSpeaker;
    }

    const currentOrder =
      this.gameData.factions[this.data.event.newSpeaker]?.order ?? 1;
    for (const [name, faction] of Object.entries(this.gameData.factions)) {
      let factionOrder = faction.order - currentOrder + 1;
      if (factionOrder < 1) {
        factionOrder += Object.keys(this.gameData.factions).length;
      }
      const factionString = `factions.${name}.order`;
      updates[factionString] = factionOrder;
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
    if (entry.data.action === "SET_SPEAKER") {
      if (entry.data.event.prevSpeaker === this.data.event.newSpeaker) {
        return "DELETE";
      }
      return "REPLACE";
    }

    return "IGNORE";
  }
}
