export class RevealAgendaHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: RevealAgendaData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };
    if (this.data.event.veto) {
      updates[`agendas.${this.data.event.agenda}.resolved`] = "DELETE";
    }
    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (
      entry.data.action === "HIDE_AGENDA" &&
      entry.data.event.agenda === this.data.event.agenda
    ) {
      return "REWIND_AND_DELETE";
    }
    return "IGNORE";
  }
}

export class HideAgendaHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: HideAgendaData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };
    if (this.data.event.veto) {
      updates[`agendas.${this.data.event.agenda}.resolved`] = true;
    }
    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (
      entry.data.action === "REVEAL_AGENDA" &&
      entry.data.event.agenda === this.data.event.agenda &&
      !this.data.event.veto
    ) {
      return "REWIND_AND_DELETE";
    }

    return "IGNORE";
  }
}
