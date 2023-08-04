import { Handler, ActionLogAction } from "../api/data";
import {
  ActionLogEntry,
  StoredGameData,
  arrayRemove,
  arrayUnion,
} from "../api/util";
import { buildObjectives } from "../../data/GameData";

export interface ScoreObjectiveEvent {
  faction: string;
  objective: string;
  key?: string;
}

export interface ScoreObjectiveData {
  action: "SCORE_OBJECTIVE";
  event: ScoreObjectiveEvent;
}

export interface UnscoreObjectiveData {
  action: "UNSCORE_OBJECTIVE";
  event: ScoreObjectiveEvent;
}

export class ScoreObjectiveHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ScoreObjectiveData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const objective = buildObjectives(this.gameData)[this.data.event.objective];

    let scorers = objective?.scorers ?? [];

    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    if (objective?.repeatable) {
      scorers.push(this.data.event.faction);
    } else {
      scorers = arrayUnion(scorers, this.data.event.faction);
    }
    updates[`objectives.${this.data.event.objective}.scorers`] = scorers;

    if (this.data.event.key) {
      let keyedScorers =
        (objective?.keyedScorers ?? {})[this.data.event.key] ?? [];
      if (objective?.repeatable) {
        keyedScorers.push(this.data.event.faction);
      } else {
        keyedScorers = arrayUnion(keyedScorers, this.data.event.faction);
      }
      updates[
        `objectives.${this.data.event.objective}.keyedScorers.${this.data.event.key}`
      ] = keyedScorers;
    }

    const faction = this.gameData.factions[this.data.event.faction];
    if (faction && faction.hero === "locked") {
      const numScored = Object.values(buildObjectives(this.gameData)).filter(
        (objective) => {
          return (
            objective.type !== "OTHER" &&
            ((objective.scorers ?? []).includes(this.data.event.faction) ||
              objective.name === this.data.event.objective)
          );
        }
      ).length;
      if (numScored >= 3) {
        updates[`factions.${this.data.event.faction}.hero`] = "unlocked";
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
      entry.data.action === "UNSCORE_OBJECTIVE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.objective === this.data.event.objective &&
      entry.data.event.key === this.data.event.key
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class UnscoreObjectiveHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnscoreObjectiveData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const objective = buildObjectives(this.gameData)[this.data.event.objective];

    let scorers = objective?.scorers ?? [];

    const updates: Record<string, any> = {
      [`state.paused`]: false,
    };

    if (objective?.repeatable) {
      const index = scorers.lastIndexOf(this.data.event.faction);
      scorers.splice(index, 1);
    } else {
      scorers = arrayRemove(scorers, this.data.event.faction);
    }
    updates[`objectives.${this.data.event.objective}.scorers`] = scorers;

    if (this.data.event.key) {
      let keyedScorers =
        (objective?.keyedScorers ?? {})[this.data.event.key] ?? [];
      if (objective?.repeatable) {
        const index = keyedScorers.lastIndexOf(this.data.event.faction);
        keyedScorers.splice(index, 1);
      } else {
        keyedScorers = arrayUnion(keyedScorers, this.data.event.faction);
      }
      updates[
        `objectives.${this.data.event.objective}.keyedScorers.${this.data.event.key}`
      ] = keyedScorers;
    }

    const faction = this.gameData.factions[this.data.event.faction];
    if (faction && faction.hero === "unlocked") {
      const numScored = Object.values(buildObjectives(this.gameData)).filter(
        (objective) => {
          return (
            objective.type !== "OTHER" &&
            (objective.scorers ?? []).includes(this.data.event.faction) &&
            objective.name !== this.data.event.objective
          );
        }
      ).length;
      if (numScored < 3) {
        updates[`factions.${this.data.event.faction}.hero`] = "locked";
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
      entry.data.action === "SCORE_OBJECTIVE" &&
      entry.data.event.faction === this.data.event.faction &&
      entry.data.event.objective === this.data.event.objective &&
      entry.data.event.key === this.data.event.key
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
