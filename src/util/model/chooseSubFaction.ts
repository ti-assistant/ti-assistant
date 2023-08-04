import { buildFactions, buildPlanets, buildTechs } from "../../data/GameData";
import { ActionLogAction, Handler } from "../api/data";
import { hasTech } from "../api/techs";
import {
  ActionLogEntry,
  StoredGameData,
  arrayRemove,
  arrayUnion,
} from "../api/util";

export interface ChooseSubFactionEvent {
  faction: string;
  subFaction: string;
}

export interface ChooseSubFactionData {
  action: "CHOOSE_SUB_FACTION";
  event: ChooseSubFactionEvent;
}

export class ChooseSubFactionHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ChooseSubFactionData
  ) {}

  validate(): boolean {
    return this.data.event.faction === "Council Keleres";
  }

  getUpdates(): Record<string, any> {
    const faction = buildFactions(this.gameData)[this.data.event.faction];
    if (!faction) {
      return {};
    }
    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    const undoing = faction.startswith.faction === this.data.event.subFaction;
    updates[`factions.${this.data.event.faction}.startswith.faction`] = undoing
      ? "DELETE"
      : this.data.event.subFaction;

    const planets = buildPlanets(this.gameData);
    for (const [planetId, planet] of Object.entries(planets)) {
      if (planet.owner === this.data.event.faction) {
        updates[`planets.${planetId}`] = "DELETE";
      }
    }

    if (!undoing) {
      switch (this.data.event.subFaction) {
        case "Argent Flight": {
          updates[`planets.Avar.owner`] = this.data.event.faction;
          updates[`planets.Valk.owner`] = this.data.event.faction;
          updates[`planets.Ylir.owner`] = this.data.event.faction;
          updates[`factions.${this.data.event.faction}.startswith.planets`] = [
            "Avar",
            "Valk",
            "Ylir",
          ];
          break;
        }
        case "Mentak Coalition": {
          updates[`planets.Moll Primus.owner`] = this.data.event.faction;
          updates[`factions.${this.data.event.faction}.startswith.planets`] = [
            "Moll Primus",
          ];
          break;
        }
        case "Xxcha Kingdom": {
          updates[`planets.Archon Ren.owner`] = this.data.event.faction;
          updates[`planets.Archon Tau.owner`] = this.data.event.faction;
          updates[`factions.${this.data.event.faction}.startswith.planets`] = [
            "Archon Ren",
            "Archon Tau",
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

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
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
