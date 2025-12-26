import { createIntl, createIntlCache } from "react-intl";
import { getFactions } from "../../../server/data/factions";
import { buildFactions, buildTechs } from "../../data/GameData";
import { hasTech } from "../api/techs";
import { arrayRemove } from "../api/util";
import { objectEntries } from "../util";

export class ChooseTFFactionHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ChooseTFFactionData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const baseFactions = getFactions(intl);
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const factionId = this.data.event.factionId;

    switch (this.data.event.type) {
      case "Planet":
        for (const [id, planet] of objectEntries(this.gameData.planets)) {
          if (planet.owner === factionId) {
            updates[`planets.${id}.owner`] = "DELETE";
          }
        }
        updates[`factions.${factionId}.startswith.planetFaction`] =
          this.data.event.subFaction ?? "DELETE";
        if (this.data.event.subFaction) {
          const startingPlanets =
            baseFactions[this.data.event.subFaction].startswith?.planets ?? [];
          for (const planetId of startingPlanets) {
            updates[`planets.${planetId}.owner`] = factionId;
          }
          updates[`factions.${factionId}.startswith.planets`] = startingPlanets;
        } else {
          updates[`factions.${factionId}.startswith.planets`] = [];
        }
        break;
      case "Unit":
        updates[`factions.${factionId}.startswith.unitFaction`] =
          this.data.event.subFaction ?? "DELETE";
        if (this.data.event.subFaction) {
          const startingUnits =
            baseFactions[this.data.event.subFaction].startswith?.units ?? {};
          updates[`factions.${factionId}.startswith.units`] = startingUnits;
        } else {
          updates[`factions.${factionId}.startswith.units`] = {};
        }
        break;
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
      entry.data.action === "CHOOSE_TF_FACTION" &&
      entry.data.event.factionId === this.data.event.factionId &&
      entry.data.event.type === this.data.event.type
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
    if (!hasTech(faction, tech)) {
      return false;
    }

    if (
      !faction.startswith?.techs ||
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
        ?.techs ?? [];
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
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

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
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
