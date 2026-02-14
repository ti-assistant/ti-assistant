import { createIntl, createIntlCache } from "react-intl";
import {
  buildFactions,
  buildLeaders,
  buildObjectives,
} from "../../data/GameData";
import { arrayRemove, arrayUnion } from "../api/util";
import { UpdateLeaderStateHandler } from "./updateLeaderState";

export class ScoreObjectiveHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: ScoreObjectiveData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const objective = buildObjectives(this.gameData, intl)[
      this.data.event.objective
    ];

    let scorers = objective?.scorers ?? [];

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    let tokenCost = 0;
    switch (this.data.event.objective) {
      case "Lead from the Front":
        tokenCost = 3;
        break;
      case "Galvanize the People":
        tokenCost = 6;
        break;
    }
    if (tokenCost > 0) {
      const tokens =
        this.gameData.factions[this.data.event.faction]?.commandCounters;
      if (tokens != undefined) {
        updates[`factions.${this.data.event.faction}.commandCounters`] =
          Math.max(0, tokens - tokenCost);
      }
    }

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
    const numScored = Object.values(
      buildObjectives(this.gameData, intl),
    ).filter((objective) => {
      return (
        objective.type !== "OTHER" &&
        ((objective.scorers ?? []).includes(this.data.event.faction) ||
          objective.id === this.data.event.objective)
      );
    }).length;
    if (numScored >= 3) {
      const leaders = buildLeaders(this.gameData, intl);
      const heroes = Object.values(leaders).filter(
        (leader) =>
          leader.faction === this.data.event.faction && leader.type === "HERO",
      );
      for (const hero of heroes) {
        if (!hero.state || hero.state === "locked") {
          const handler = new UpdateLeaderStateHandler(this.gameData, {
            action: "UPDATE_LEADER_STATE",
            event: { leaderId: hero.id, state: "readied" },
          });
          updates = {
            ...updates,
            ...handler.getUpdates(),
          };
        }
      }
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
    public data: UnscoreObjectiveData,
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const objective = buildObjectives(this.gameData, intl)[
      this.data.event.objective
    ];

    let scorers = objective?.scorers ?? [];

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    let tokenCost = 0;
    switch (this.data.event.objective) {
      case "Lead from the Front":
        tokenCost = 3;
        break;
      case "Galvanize the People":
        tokenCost = 6;
        break;
    }
    if (tokenCost > 0) {
      const tokens =
        this.gameData.factions[this.data.event.faction]?.commandCounters;
      if (tokens != undefined) {
        updates[`factions.${this.data.event.faction}.commandCounters`] =
          Math.min(16, tokens + tokenCost);
      }
    }

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

    const numScored = Object.values(
      buildObjectives(this.gameData, intl),
    ).filter((objective) => {
      return (
        objective.type !== "OTHER" &&
        (objective.scorers ?? []).includes(this.data.event.faction) &&
        objective.id !== this.data.event.objective
      );
    }).length;
    if (numScored < 3) {
      const leaders = buildLeaders(this.gameData, intl);
      const heroes = Object.values(leaders).filter(
        (leader) =>
          leader.faction === this.data.event.faction && leader.type === "HERO",
      );
      for (const hero of heroes) {
        if (hero.state === "readied") {
          const handler = new UpdateLeaderStateHandler(this.gameData, {
            action: "UPDATE_LEADER_STATE",
            event: { leaderId: hero.id, state: "locked" },
          });
          updates = {
            ...updates,
            ...handler.getUpdates(),
          };
        }
      }
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
