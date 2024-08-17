import { createIntl, createIntlCache } from "react-intl";
import { buildFactions, buildStrategyCards } from "../../data/GameData";
import { getSelectedAction } from "../api/data";
import { getOnDeckFaction } from "../helpers";

export class EndTurnHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: EndTurnData) {
    this.data.event.prevFaction = gameData.state.activeplayer;
    this.data.event.selectedAction = getSelectedAction(gameData);
    const secondaries: Record<string, Secondary> = {};
    for (const faction of Object.values(gameData.factions)) {
      secondaries[faction.id] = faction.secondary ?? "PENDING";
    }
    this.data.event.secondaries = secondaries;
  }

  validate(): boolean {
    if (
      this.data.event.selectedAction === "Pass" &&
      this.data.event.samePlayer
    ) {
      return false;
    }
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const onDeckFaction = getOnDeckFaction(
      this.gameData.state,
      buildFactions(this.gameData, intl),
      buildStrategyCards(this.gameData, intl)
    );

    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };
    if (!this.data.event.samePlayer) {
      updates[`state.activeplayer`] = onDeckFaction ? onDeckFaction.id : "None";
    }

    for (const factionId of Object.keys(this.gameData.factions)) {
      updates[`factions.${factionId}.secondary`] = "DELETE";
    }

    switch (this.data.event.selectedAction) {
      case "Pass": {
        updates[`factions.${this.data.event.prevFaction}.passed`] = true;
        break;
      }
      case "Leadership":
      case "Diplomacy":
      case "Politics":
      case "Construction":
      case "Trade":
      case "Warfare":
      case "Technology":
      case "Imperial": {
        updates[`strategycards.${this.data.event.selectedAction}.used`] = true;
        break;
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
    return "IGNORE";
  }
}

export class UnendTurnHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: UnendTurnData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`state.activeplayer`]: this.data.event.prevFaction,
    };

    for (const factionId of Object.keys(this.gameData.factions)) {
      const secondary = (this.data.event.secondaries ?? {})[factionId];
      if (secondary) {
        updates[`factions.${factionId}.secondary`] = secondary;
      }
    }

    switch (this.data.event.selectedAction) {
      case "Pass": {
        updates[`factions.${this.data.event.prevFaction}.passed`] = "DELETE";
        break;
      }
      case "Leadership":
      case "Diplomacy":
      case "Politics":
      case "Construction":
      case "Trade":
      case "Warfare":
      case "Technology":
      case "Imperial": {
        updates[`strategycards.${this.data.event.selectedAction}.used`] =
          "DELETE";
        break;
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
    if (entry.data.action === "END_TURN") {
      return "DELETE";
    }
    return "IGNORE";
  }
}
