import { createIntl, createIntlCache } from "react-intl";
import { buildRelics } from "../../data/GameData";
import { AddTechHandler, RemoveTechHandler } from "./addTech";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "./scoreObjective";

export class PlayRelicHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: PlayRelicData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const relic = buildRelics(this.gameData, intl)[this.data.event.relic];

    if (!relic) {
      return {};
    }

    if (!relic.owner) {
      return {};
    }

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`relics.${this.data.event.relic}.state`]: "purged",
    };

    switch (this.data.event.relic) {
      case "Maw of Worlds": {
        const gainTechHandler = new AddTechHandler(this.gameData, {
          action: "ADD_TECH",
          event: {
            faction: relic.owner,
            tech: this.data.event.tech,
          },
        });
        updates = {
          ...updates,
          ...gainTechHandler.getUpdates(),
        };
        break;
      }
      case "The Crown of Emphidia": {
        const scoreObjectiveHandler = new ScoreObjectiveHandler(this.gameData, {
          action: "SCORE_OBJECTIVE",
          event: {
            faction: relic.owner,
            objective: "Tomb + Crown of Emphidia",
          },
        });
        updates = {
          ...updates,
          ...scoreObjectiveHandler.getUpdates(),
        };
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
    if (
      entry.data.action === "UNPLAY_RELIC" &&
      entry.data.event.relic === this.data.event.relic
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class UnplayRelicHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: UnplayRelicData) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const relic = buildRelics(this.gameData, intl)[this.data.event.relic];

    if (!relic) {
      return {};
    }

    if (!relic.owner) {
      return {};
    }

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`relics.${this.data.event.relic}.state`]: "DELETE",
    };

    switch (this.data.event.relic) {
      case "Maw of Worlds": {
        const removeTechHandler = new RemoveTechHandler(this.gameData, {
          action: "REMOVE_TECH",
          event: {
            faction: relic.owner,
            tech: this.data.event.tech,
          },
        });
        updates = {
          ...updates,
          ...removeTechHandler.getUpdates(),
        };
        break;
      }
      case "The Crown of Emphidia": {
        const unscoreObjectiveHandler = new UnscoreObjectiveHandler(
          this.gameData,
          {
            action: "UNSCORE_OBJECTIVE",
            event: {
              faction: relic.owner,
              objective: "Tomb + Crown of Emphidia",
            },
          }
        );
        updates = {
          ...updates,
          ...unscoreObjectiveHandler.getUpdates(),
        };
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
    if (
      entry.data.action === "PLAY_RELIC" &&
      entry.data.event.relic === this.data.event.relic
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
