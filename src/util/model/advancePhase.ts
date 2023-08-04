import { buildFactions, buildStrategyCards } from "../../data/GameData";
import { GameStrategyCard } from "../api/cards";
import { ActionLogAction, Handler } from "../api/data";
import { GameFaction } from "../api/factions";
import { GameState } from "../api/state";
import { Timers } from "../api/timers";
import { ActionLogEntry, StoredGameData } from "../api/util";

export interface AdvancePhaseEvent {
  skipAgenda: boolean;
  // Set by server, used for Undo.
  factions?: Record<string, GameFaction>;
  state?: GameState;
  strategycards?: Record<string, GameStrategyCard>;
  timers?: Timers;
}

export interface AdvancePhaseData {
  action: "ADVANCE_PHASE";
  event: AdvancePhaseEvent;
}

export interface RewindPhaseData {
  action: "REWIND_PHASE";
  event: AdvancePhaseEvent;
}

export class AdvancePhaseHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: AdvancePhaseData) {}

  validate(): boolean {
    switch (this.gameData.state.phase) {
      case "STRATEGY": {
        const strategyCards = buildStrategyCards(this.gameData);
        const factions = buildFactions(this.gameData);
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
    };
    switch (this.gameData.state.phase) {
      case "SETUP": {
        updates[`state.phase`] = "STRATEGY";
        updates[`state.activeplayer`] = this.gameData.state.speaker;
        break;
      }
      case "STRATEGY": {
        updates[`state.phase`] = "ACTION";
        let minCard = Number.MAX_SAFE_INTEGER;
        let minFaction: string | undefined;
        const strategyCards = buildStrategyCards(this.gameData);
        for (const strategyCard of Object.values(strategyCards)) {
          if (strategyCard.faction && strategyCard.order < minCard) {
            minCard = strategyCard.order;
            minFaction = strategyCard.faction;
          }
          if (strategyCard.faction) {
            updates[`strategycards.${strategyCard.name}.tradeGoods`] = "DELETE";
          } else {
            updates[`strategycards.${strategyCard.name}.tradeGoods`] =
              "INCREMENT";
          }
        }
        updates[`state.activeplayer`] = minFaction;
        break;
      }
      case "ACTION": {
        updates[`state.phase`] = "STATUS";
        let minCard = Number.MAX_SAFE_INTEGER;
        let minFaction: string | undefined;
        const strategyCards = buildStrategyCards(this.gameData);
        for (const strategyCard of Object.values(strategyCards)) {
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
        const strategyCards = buildStrategyCards(this.gameData);
        for (const strategyCard of Object.values(strategyCards)) {
          updates[`strategycards.${strategyCard.name}.faction`] = "DELETE";
          updates[`strategycards.${strategyCard.name}.order`] = "DELETE";
          updates[`strategycards.${strategyCard.name}.used`] = "DELETE";
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

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(_: ActionLogEntry): ActionLogAction {
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
      [`factions`]: this.data.event.factions,
      [`state`]: state,
      [`strategycards`]: this.data.event.strategycards,
      [`timers.firstAgenda`]: this.data.event.timers?.firstAgenda ?? 0,
      [`timers.secondAgenda`]: this.data.event.timers?.secondAgenda ?? 0,
    };
  }

  getLogEntry(): ActionLogEntry {
    return {
      timestampMillis: Date.now(),
      data: this.data,
    };
  }

  getActionLogAction(entry: ActionLogEntry): ActionLogAction {
    if (entry.data.action === "ADVANCE_PHASE") {
      return "DELETE";
    }
    return "IGNORE";
  }
}
