import { createIntl, createIntlCache } from "react-intl";
import { buildFactions, buildPlanets } from "../../data/GameData";

export class ChooseSubFactionHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ChooseSubFactionData
  ) {}

  validate(): boolean {
    return this.data.event.faction === "Council Keleres";
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const faction = buildFactions(this.gameData, intl)[this.data.event.faction];
    if (!faction) {
      return {};
    }
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const undoing = faction.startswith.faction === this.data.event.subFaction;
    updates[`factions.${this.data.event.faction}.startswith.faction`] = undoing
      ? "DELETE"
      : this.data.event.subFaction;

    const planets = buildPlanets(this.gameData, intl);
    for (const [planetId, planet] of Object.entries(planets ?? {})) {
      if (planet.owner === this.data.event.faction) {
        updates[`planets.${planetId}`] = "DELETE";
      }
    }

    if (!undoing) {
      switch (this.data.event.subFaction) {
        case "Argent Flight": {
          updates[`planets.Avar Keleres.owner`] = this.data.event.faction;
          updates[`planets.Valk Keleres.owner`] = this.data.event.faction;
          updates[`planets.Ylir Keleres.owner`] = this.data.event.faction;
          updates[`factions.${this.data.event.faction}.startswith.planets`] = [
            "Avar Keleres",
            "Valk Keleres",
            "Ylir Keleres",
          ];
          break;
        }
        case "Mentak Coalition": {
          updates[`planets.Moll Primus Keleres.owner`] =
            this.data.event.faction;
          updates[`factions.${this.data.event.faction}.startswith.planets`] = [
            "Moll Primus Keleres",
          ];
          break;
        }
        case "Xxcha Kingdom": {
          updates[`planets.Archon Ren Keleres.owner`] = this.data.event.faction;
          updates[`planets.Archon Tau Keleres.owner`] = this.data.event.faction;
          updates[`factions.${this.data.event.faction}.startswith.planets`] = [
            "Archon Ren Keleres",
            "Archon Tau Keleres",
          ];
          break;
        }
      }
    } else {
      updates[`factions.${this.data.event.faction}.startswith.planets`] =
        "DELETE";
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
      entry.data.action === "CHOOSE_SUB_FACTION" &&
      entry.data.event.faction === this.data.event.faction
    ) {
      if (entry.data.event.subFaction === this.data.event.subFaction) {
        return "DELETE";
      }
      return "REPLACE";
    }

    return "IGNORE";
  }
}
