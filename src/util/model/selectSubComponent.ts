import { getCurrentTurnLogEntries } from "../api/actionLog";

export class SelectSubComponentHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: SelectSubComponentData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    let componentName = currentTurn
      .filter((logEntry) => logEntry.data.action === "PLAY_COMPONENT")
      .map((logEntry) => (logEntry.data as PlayComponentData).event.name)[0];

    switch (componentName) {
      case "Mathis Mathinus":
      case "Overrule":
      case "Sins of the Father": {
        for (const entry of currentTurn) {
          if (
            entry.data.action === "SELECT_SUB_COMPONENT" &&
            (entry.data.event.subComponent === "Imperial" ||
              entry.data.event.subComponent === "Aeterna") &&
            this.data.event.subComponent !== "Imperial" &&
            this.data.event.subComponent !== "Aeterna"
          ) {
            const mecatol = this.gameData.planets["Mecatol Rex"];
            if (
              mecatol &&
              this.gameData.state.activeplayer &&
              mecatol.owner === this.gameData.state.activeplayer
            ) {
              const mecatolScorers =
                (this.gameData.objectives ?? {})["Imperial Point"]?.scorers ??
                [];
              const lastIndex = mecatolScorers.lastIndexOf(
                this.gameData.state.activeplayer,
              );
              mecatolScorers.splice(lastIndex, 1);
              updates[`objectives.Imperial Point.scorers`] = mecatolScorers;
            }
          }
        }
        if (
          this.data.event.subComponent === "Imperial" ||
          this.data.event.subComponent === "Aeterna"
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
      }
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
    if (entry.data.action === "SELECT_SUB_COMPONENT") {
      if (this.data.event.subComponent === "None") {
        return "REWIND_AND_DELETE";
      }
      return "REWIND_AND_REPLACE";
    }
    return "IGNORE";
  }
}
