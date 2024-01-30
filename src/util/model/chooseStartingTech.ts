import { createIntl, createIntlCache } from "react-intl";
import { buildFactions, buildTechs } from "../../data/GameData";
import { hasTech } from "../api/techs";
import { arrayRemove, arrayUnion } from "../api/util";

export class ChooseStartingTechHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ChooseStartingTechData
  ) {}

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const techs = buildTechs(this.gameData, intl);
    const tech = techs[this.data.event.tech];
    const factions = buildFactions(this.gameData, intl);
    const faction = factions[this.data.event.faction];
    if (!faction || !tech) {
      return false;
    }
    if (hasTech(faction, this.data.event.tech)) {
      return false;
    }

    if (
      !faction.startswith.choice ||
      !faction.startswith.choice.options.includes(this.data.event.tech)
    ) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const startingTechs =
      buildFactions(this.gameData, intl)[this.data.event.faction]?.startswith
        .techs ?? [];
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`factions.${this.data.event.faction}.techs.${this.data.event.tech}.ready`]:
        true,
      [`factions.${this.data.event.faction}.startswith.techs`]: arrayUnion(
        startingTechs,
        this.data.event.tech
      ),
    };

    if (this.data.event.tech === "IIHQ Modernization") {
      updates[`planets.Custodia Vigilia.owner`] = "Council Keleres";
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
      entry.data.action === "REMOVE_STARTING_TECH" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.tech === this.data.event.tech
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class RemoveStartingTechHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: RemoveStartingTechData
  ) {}

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const techs = buildTechs(this.gameData, intl);
    const tech = techs[this.data.event.tech];
    const factions = buildFactions(this.gameData, intl);
    const faction = factions[this.data.event.faction];
    if (!faction || !tech) {
      return false;
    }
    if (!hasTech(faction, this.data.event.tech)) {
      return false;
    }

    if (
      !faction.startswith.techs ||
      !faction.startswith.techs.includes(this.data.event.tech)
    ) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const startingTechs =
      buildFactions(this.gameData, intl)[this.data.event.faction]?.startswith
        .techs ?? [];
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`factions.${this.data.event.faction}.techs.${this.data.event.tech}`]:
        "DELETE",
      [`factions.${this.data.event.faction}.startswith.techs`]: arrayRemove(
        startingTechs,
        this.data.event.tech
      ),
    };

    if (this.data.event.tech === "IIHQ Modernization") {
      updates[`planets.Custodia Vigilia.owner`] = "DELETE";
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
      entry.data.action === "CHOOSE_STARTING_TECH" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.tech === this.data.event.tech
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
