import { createIntl, createIntlCache } from "react-intl";
import { buildObjectives, buildPlanets } from "../../data/GameData";
import { getSelectedAction } from "../api/data";

export class SelectActionHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: SelectActionData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);

    const selectedAction = getSelectedAction(this.gameData);

    if (selectedAction === "Imperial") {
      const mecatol = buildPlanets(this.gameData)["Mecatol Rex"];
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

    if (this.data.event.action === "Imperial") {
      const mecatol = buildPlanets(this.gameData)["Mecatol Rex"];
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

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
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
    };
    if (this.data.event.action === "Imperial") {
      const mecatol = buildPlanets(this.gameData)["Mecatol Rex"];
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

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "SELECT_ACTION" &&
      entry.data.event.action === entry.data.event.action
    ) {
      return "REWIND_AND_DELETE";
    }

    return "IGNORE";
  }
}
