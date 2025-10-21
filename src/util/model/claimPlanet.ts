import { createIntl, createIntlCache } from "react-intl";
import { buildPlanets } from "../../data/GameData";
import { getCurrentTurnLogEntries } from "../api/actionLog";
import { Optional } from "../types/types";
import { UpdateBreakthroughStateHandler } from "./updateBreakthroughState";

export class ClaimPlanetHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: ClaimPlanetData) {
    const planet = gameData.planets[data.event.planet];
    if (planet && planet.owner) {
      this.data.event.prevOwner = planet.owner;
    }
  }

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const planets = buildPlanets(this.gameData, intl);
    const planet = planets[this.data.event.planet];
    if (!planet) {
      return false;
    }

    if (planet.owner === this.data.event.faction) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    // TODO: Figure out if [0.0.0] works.
    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      const action = this.getActionLogAction(entry);
      if (action === "REPLACE") {
        this.data.event.prevOwner = (
          entry.data as UnclaimPlanetData
        ).event.faction;
      }
    }

    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`planets.${this.data.event.planet}.owner`]: this.data.event.faction,
      [`planets.${this.data.event.planet}.spaceDock`]: "DELETE",
    };

    if (
      !this.data.event.prevOwner &&
      this.data.event.planet === "Mecatol Rex"
    ) {
      updates[`objectives.Custodians Token.scorers`] = [
        this.data.event.faction,
      ];
    }

    if (this.data.event.planet === "Styx") {
      updates[`objectives.Styx.scorers`] = [this.data.event.faction];
    }

    if (this.data.event.planet === "Thunder's Edge") {
      const breakthroughState =
        this.gameData.factions[this.data.event.faction]?.breakthrough?.state;
      if (!breakthroughState || breakthroughState === "locked") {
        const handler = new UpdateBreakthroughStateHandler(this.gameData, {
          action: "UPDATE_BREAKTHROUGH_STATE",
          event: {
            factionId: this.data.event.faction,
            state: "readied",
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
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
      entry.data.action === "UNCLAIM_PLANET" &&
      entry.data.event.planet === this.data.event.planet
    ) {
      if (entry.data.event.faction === this.data.event.faction) {
        return "DELETE";
      } else {
        return "REPLACE";
      }
    }

    if (
      entry.data.action === "CLAIM_PLANET" &&
      entry.data.event.planet === this.data.event.planet
    ) {
      if (
        entry.data.event.faction === this.data.event.prevOwner &&
        entry.data.event.prevOwner === this.data.event.faction
      ) {
        return "DELETE";
      }
    }

    return "IGNORE";
  }
}

export class UnclaimPlanetHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UnclaimPlanetData
  ) {}

  validate(): boolean {
    const cache = createIntlCache();
    const intl = createIntl({ locale: "en" }, cache);
    const planets = buildPlanets(this.gameData, intl);
    const planet = planets[this.data.event.planet];
    if (!planet) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    // TODO: Figure out if [0.0.0] works.

    let prevOwner: Optional<string>;
    let claimedThisTurn: boolean = false;
    const currentTurn = getCurrentTurnLogEntries(this.gameData.actionLog ?? []);
    for (const entry of currentTurn) {
      const action = this.getActionLogAction(entry);
      if (action === "DELETE") {
        prevOwner = (entry.data as ClaimPlanetData).event.prevOwner;
        claimedThisTurn = true;
      }
    }

    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`planets.${this.data.event.planet}.owner`]: prevOwner ?? "DELETE",
      [`planets.${this.data.event.planet}.spaceDock`]: "DELETE",
    };

    if (
      claimedThisTurn &&
      !prevOwner &&
      this.data.event.planet === "Mecatol Rex"
    ) {
      updates[`objectives.Custodians Token.scorers`] = "DELETE";
    }

    if (this.data.event.planet === "Styx") {
      updates[`objectives.Styx.scorers`] = prevOwner ? [prevOwner] : "DELETE";
    }

    if (this.data.event.planet === "Thunder's Edge") {
      // TODO: Check if player should've unlocked their breakthrough.
      //   1st - Check expedition.
      //   2nd - Check log for previous control of Thunder's Edge.
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
      entry.data.action === "CLAIM_PLANET" &&
      entry.data.event.planet === this.data.event.planet &&
      entry.data.event.faction === this.data.event.faction
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
