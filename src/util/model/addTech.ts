import { createIntl, createIntlCache } from "react-intl";
import { buildFactions, buildTechs } from "../../data/GameData";
import { hasTech } from "../api/techs";

export class AddTechHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: AddTechData) {}

  validate(): boolean {
    const techs = buildTechs(this.gameData);
    const tech = techs[this.data.event.tech];

    // Translations not needed, so just create an english one.
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const factions = buildFactions(this.gameData, intl);
    const faction = factions[this.data.event.faction];
    if (!faction || !tech) {
      return false;
    }
    if (hasTech(faction, this.data.event.tech)) {
      return false;
    }

    if (tech.faction && this.data.event.faction === "Nekro Virus") {
      return !!factions[tech.faction];
    }

    if (tech.faction && tech.faction !== this.data.event.faction) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`factions.${this.data.event.faction}.techs.${this.data.event.tech}.ready`]:
        true,
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
      entry.data.action === "REMOVE_TECH" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.tech === this.data.event.tech
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class RemoveTechHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: RemoveTechData) {}

  validate(): boolean {
    const techs = buildTechs(this.gameData);
    const tech = techs[this.data.event.tech];
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const factions = buildFactions(this.gameData, intl);
    const faction = factions[this.data.event.faction];
    if (!faction || !tech) {
      return false;
    }
    if (!hasTech(faction, this.data.event.tech)) {
      return false;
    }

    if (tech.faction && this.data.event.faction === "Nekro Virus") {
      return !!factions[tech.faction];
    }

    if (tech.faction && tech.faction !== this.data.event.faction) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`factions.${this.data.event.faction}.techs.${this.data.event.tech}`]:
        "DELETE",
    };

    if (this.data.event.tech === "IIHQ Modernization") {
      updates[`planets.Custodia Vigilia.owner`] = "DELETE";
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: {
        action: "REMOVE_TECH",
        event: this.data.event,
      },
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (
      entry.data.action === "ADD_TECH" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.tech === this.data.event.tech
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
