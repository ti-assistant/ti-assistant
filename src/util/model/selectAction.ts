import { createIntl, createIntlCache } from "react-intl";
import { buildObjectives, buildPlanets } from "../../data/GameData";
import { getCurrentTurnLogEntries } from "../api/actionLog";

export class SelectActionHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: SelectActionData) {}

  validate(): boolean {
    return !!this.data.event.action;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);

    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      if (
        entry.data.action === "SELECT_ACTION" &&
        (entry.data.event.action === "Imperial" ||
          entry.data.event.action === "Aeterna") &&
        this.data.event.action !== "Imperial" &&
        this.data.event.action !== "Aeterna"
      ) {
        const mecatol = buildPlanets(this.gameData, intl)["Mecatol Rex"];
        if (
          mecatol &&
          this.gameData.state.activeplayer &&
          mecatol.owner === this.gameData.state.activeplayer
        ) {
          const mecatolScorers =
            buildObjectives(this.gameData, intl)["Imperial Point"]?.scorers ??
            [];
          const lastIndex = mecatolScorers.lastIndexOf(
            this.gameData.state.activeplayer
          );
          mecatolScorers.splice(lastIndex, 1);
          updates[`objectives.Imperial Point.scorers`] = mecatolScorers;
        }
      }
    }

    if (
      this.data.event.action === "Imperial" ||
      this.data.event.action === "Aeterna"
    ) {
      const mecatol = buildPlanets(this.gameData, intl)["Mecatol Rex"];
      if (
        mecatol &&
        this.gameData.state.activeplayer &&
        mecatol.owner === this.gameData.state.activeplayer
      ) {
        const mecatolScorers =
          buildObjectives(this.gameData, intl)["Imperial Point"]?.scorers ?? [];
        mecatolScorers.push(this.gameData.state.activeplayer);
        updates[`objectives.Imperial Point.scorers`] = mecatolScorers;
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
    public data: UnselectActionData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };
    if (
      this.data.event.action === "Imperial" ||
      this.data.event.action === "Aeterna"
    ) {
      const mecatol = buildPlanets(this.gameData, intl)["Mecatol Rex"];
      if (
        mecatol &&
        this.gameData.state.activeplayer &&
        mecatol.owner === this.gameData.state.activeplayer
      ) {
        const mecatolScorers =
          buildObjectives(this.gameData, intl)["Imperial Point"]?.scorers ?? [];
        const lastIndex = mecatolScorers.lastIndexOf(
          this.gameData.state.activeplayer
        );
        mecatolScorers.splice(lastIndex, 1);
        updates[`objectives.Imperial Point.scorers`] = mecatolScorers;
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
    if (
      entry.data.action === "SELECT_ACTION" &&
      entry.data.event.action === entry.data.event.action
    ) {
      return "REWIND_AND_DELETE";
    }

    return "IGNORE";
  }
}
