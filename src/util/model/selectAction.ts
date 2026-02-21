import { getCurrentTurnLogEntries } from "../api/actionLog";
import { Optional } from "../types/types";

export class SelectActionHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SelectActionData,
  ) {}

  validate(): boolean {
    return !!this.data.event.action;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };
    let tokens: Optional<number>;
    const activePlayer = this.gameData.state.activeplayer;
    if (activePlayer && activePlayer !== "None") {
      tokens = this.gameData.factions[activePlayer]?.commandCounters;
    }
    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      if (
        entry.data.action === "SELECT_ACTION" &&
        (entry.data.event.action === "Imperial" ||
          entry.data.event.action === "Aeterna") &&
        this.data.event.action !== "Imperial" &&
        this.data.event.action !== "Aeterna"
      ) {
        const mecatol = this.gameData.planets["Mecatol Rex"];
        if (
          mecatol &&
          this.gameData.state.activeplayer &&
          mecatol.owner === this.gameData.state.activeplayer
        ) {
          const mecatolScorers =
            (this.gameData.objectives ?? {})["Imperial Point"]?.scorers ?? [];
          const lastIndex = mecatolScorers.lastIndexOf(
            this.gameData.state.activeplayer,
          );
          mecatolScorers.splice(lastIndex, 1);
          updates[`objectives.Imperial Point.scorers`] = mecatolScorers;
        }
      }
      if (
        entry.data.action === "SELECT_ACTION" &&
        (entry.data.event.action === "Lux" ||
          entry.data.event.action === "Leadership") &&
        this.data.event.action !== "Lux" &&
        this.data.event.action !== "Leadership"
      ) {
        if (tokens != undefined) {
          tokens -= 3;
        }
      }
      if (
        entry.data.action === "SELECT_ACTION" &&
        entry.data.event.action === "Tactical" &&
        this.data.event.action !== "Tactical"
      ) {
        if (tokens != undefined) {
          tokens += 1;
        }
      }
    }

    if (
      this.data.event.action === "Imperial" ||
      this.data.event.action === "Aeterna"
    ) {
      const mecatol = this.gameData.planets["Mecatol Rex"];
      if (
        mecatol &&
        this.gameData.state.activeplayer &&
        mecatol.owner === this.gameData.state.activeplayer
      ) {
        const mecatolScorers =
          (this.gameData.objectives ?? {})["Imperial Point"]?.scorers ?? [];
        mecatolScorers.push(this.gameData.state.activeplayer);
        updates[`objectives.Imperial Point.scorers`] = mecatolScorers;
      }
    }

    if (
      this.data.event.action === "Leadership" ||
      this.data.event.action === "Lux"
    ) {
      if (tokens != undefined) {
        tokens += 3;
      }
    }

    if (this.data.event.action === "Tactical") {
      if (tokens != undefined) {
        tokens -= 1;
      }
    }

    if (tokens != undefined) {
      updates[`factions.${activePlayer}.commandCounters`] = Math.max(
        0,
        Math.min(tokens, 16),
      );
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
      entry.data.action === "SELECT_ACTION" &&
      entry.data.event.action !== this.data.event.action
    ) {
      return "REWIND_AND_REPLACE";
    }

    return "IGNORE";
  }
}

export class UnselectActionHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnselectActionData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    let tokens: Optional<number>;
    const activePlayer = this.gameData.state.activeplayer;
    if (activePlayer && activePlayer !== "None") {
      tokens = this.gameData.factions[activePlayer]?.commandCounters;
    }
    if (
      this.data.event.action === "Imperial" ||
      this.data.event.action === "Aeterna"
    ) {
      const mecatol = this.gameData.planets["Mecatol Rex"];
      if (
        mecatol &&
        this.gameData.state.activeplayer &&
        mecatol.owner === this.gameData.state.activeplayer
      ) {
        const mecatolScorers =
          (this.gameData.objectives ?? {})["Imperial Point"]?.scorers ?? [];
        const lastIndex = mecatolScorers.lastIndexOf(
          this.gameData.state.activeplayer,
        );
        mecatolScorers.splice(lastIndex, 1);
        updates[`objectives.Imperial Point.scorers`] = mecatolScorers;
      }
    }

    if (
      this.data.event.action === "Lux" ||
      this.data.event.action === "Leadership"
    ) {
      if (tokens != undefined) {
        tokens -= 3;
      }
    }

    if (this.data.event.action === "Tactical") {
      if (tokens != undefined) {
        tokens += 1;
      }
    }

    if (tokens != undefined) {
      updates[`factions.${activePlayer}.commandCounters`] = Math.max(
        0,
        Math.min(tokens, 16),
      );
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
      entry.data.action === "SELECT_ACTION" &&
      entry.data.event.action === entry.data.event.action
    ) {
      return "REWIND_AND_DELETE";
    }

    return "IGNORE";
  }
}
