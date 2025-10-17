import { createIntl, createIntlCache } from "react-intl";
import { buildFactions, buildStrategyCards } from "../../data/GameData";
import { Optional } from "../types/types";
import { objectEntries } from "../util";

export class AdvancePhaseHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: AdvancePhaseData) {
    this.data.event.factions = structuredClone(gameData.factions);
    this.data.event.state = structuredClone(gameData.state);
    this.data.event.strategycards = structuredClone(
      gameData.strategycards ?? {}
    );
  }

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    switch (this.gameData.state.phase) {
      case "STRATEGY": {
        const strategyCards = buildStrategyCards(this.gameData, intl);
        const factions = buildFactions(this.gameData, intl);
        const numFactions = Object.keys(factions).length;
        const numPickedCards = Object.values(strategyCards).reduce(
          (numCards, card) => {
            if (card.faction) {
              return numCards + 1;
            }
            return numCards;
          },
          0
        );
        if (numFactions < 5) {
          return numFactions * 2 === numPickedCards;
        }
        return numFactions === numPickedCards;
      }
    }
    // TODO: Pass lock value so that this can be validated.
    return true;
  }

  getUpdates(): Record<string, any> {
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`state.votingStarted`]: "DELETE",
    };
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    switch (this.gameData.state.phase) {
      case "SETUP": {
        updates[`state.phase`] = "STRATEGY";
        updates[`state.activeplayer`] = this.gameData.state.speaker;
        break;
      }
      case "STRATEGY": {
        updates[`state.phase`] = "ACTION";
        let minCard = Number.MAX_SAFE_INTEGER;
        let minFaction: Optional<string>;
        const strategyCards = buildStrategyCards(this.gameData, intl);
        for (const strategyCard of Object.values(strategyCards)) {
          if (strategyCard.faction && strategyCard.order < minCard) {
            minCard = strategyCard.order;
            minFaction = strategyCard.faction;
          }
          if (strategyCard.faction) {
            updates[`strategycards.${strategyCard.id}.tradeGoods`] = "DELETE";
          } else {
            updates[`strategycards.${strategyCard.id}.tradeGoods`] =
              "INCREMENT";
          }
        }
        updates[`state.activeplayer`] = minFaction;
        break;
      }
      case "ACTION": {
        updates[`state.phase`] = "STATUS";
        let minCard = Number.MAX_SAFE_INTEGER;
        let minFaction: Optional<string>;
        const strategyCards = buildStrategyCards(this.gameData, intl);
        for (const strategyCard of Object.values(strategyCards)) {
          updates[`strategycards.${strategyCard.id}.used`] = "DELETE";
          if (strategyCard.faction && strategyCard.order < minCard) {
            minCard = strategyCard.order;
            minFaction = strategyCard.faction;
          }
        }
        if (minFaction) {
          updates[`state.activeplayer`] = minFaction;
        } else {
          updates[`state.activeplayer`] = this.gameData.state.speaker;
        }
        break;
      }
      case "STATUS": {
        updates[`state.activeplayer`] = this.gameData.state.speaker;
        const strategyCards = buildStrategyCards(this.gameData, intl);
        const factions = buildFactions(this.gameData, intl);
        for (const strategyCard of Object.values(strategyCards)) {
          updates[`strategycards.${strategyCard.id}.faction`] = "DELETE";
          updates[`strategycards.${strategyCard.id}.order`] = "DELETE";
          updates[`strategycards.${strategyCard.id}.used`] = "DELETE";
        }
        for (const [componentId, component] of Object.entries(
          this.gameData.components ?? {}
        )) {
          if (component.state === "exhausted") {
            updates[`components.${componentId}.state`] = "DELETE";
          }
        }
        for (const [factionId, faction] of objectEntries(factions ?? {})) {
          for (const [techId, tech] of objectEntries(faction.techs ?? {})) {
            if (tech.shareKnowledge) {
              updates[`factions.${factionId}.techs.${techId}`] = "DELETE";
              continue;
            }
            if (tech.state === "exhausted") {
              updates[`factions.${factionId}.techs.${techId}.state`] = "ready";
            }
            if (!tech.ready) {
              updates[`factions.${factionId}.techs.${techId}.ready`] = true;
            }
          }
          if (faction.breakthrough.state === "exhausted") {
            updates[`factions.${factionId}.breakthrough.state`] = "readied";
          }
        }
        for (const [leaderId, leader] of Object.entries(
          this.gameData.leaders ?? {}
        )) {
          if (leader.state === "exhausted") {
            updates[`leaders.${leaderId}.state`] = "DELETE";
          }
        }
        if (this.data.event.skipAgenda) {
          updates[`state.phase`] = "STRATEGY";
          updates[`state.round`] = this.gameData.state.round + 1;
        } else {
          updates[`state.phase`] = "AGENDA";
          updates[`state.agendaNum`] = 1;
          updates[`state.agendaUnlocked`] = true;
        }
        break;
      }
      case "AGENDA": {
        updates[`state.phase`] = "STRATEGY";
        updates[`state.round`] = this.gameData.state.round + 1;
        updates[`state.activeplayer`] = this.gameData.state.speaker;
        updates[`state.agendaNum`] = 1;
        updates[`timers.firstAgenda`] = "DELETE";
        updates[`timers.secondAgenda`] = "DELETE";
        break;
      }
    }

    for (const name of Object.keys(this.gameData.factions)) {
      updates[`factions.${name}.passed`] = "DELETE";
      updates[`factions.${name}.castVotes`] = "DELETE";
    }

    return updates;
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(_: ActionLogEntry<GameUpdateData>): ActionLogAction {
    // Should never be possible to put a
    return "IGNORE";
  }
}

export class RewindPhaseHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: RewindPhaseData) {}

  validate(): boolean {
    // TODO: Pass lock value so that this can be validated.
    return true;
  }

  getUpdates(): Record<string, any> {
    const state = this.data.event.state as GameState;
    state.paused = false;
    return {
      [`sequenceNum`]: "INCREMENT",
      [`factions`]: this.data.event.factions,
      [`state`]: state,
      [`strategycards`]: this.data.event.strategycards,
      [`timers.firstAgenda`]: this.data.event.timers?.firstAgenda ?? 0,
      [`timers.secondAgenda`]: this.data.event.timers?.secondAgenda ?? 0,
    };
  }

  getLogEntry(): ActionLogEntry<GameUpdateData> {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction {
    if (entry.data.action === "ADVANCE_PHASE") {
      return "DELETE";
    }
    return "IGNORE";
  }
}
