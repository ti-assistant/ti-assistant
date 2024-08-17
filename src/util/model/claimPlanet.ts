import { buildPlanets } from "../../data/GameData";
import { getCurrentTurnLogEntries } from "../api/actionLog";

export class ClaimPlanetHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: ClaimPlanetData) {
    const planet = gameData.planets[data.event.planet];
    if (planet && planet.owner) {
      this.data.event.prevOwner = planet.owner;
    }
  }

  validate(): boolean {
    const planets = buildPlanets(this.gameData);
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

    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`planets.${this.data.event.planet}.owner`]: this.data.event.faction,
    };

    if (
      !this.data.event.prevOwner &&
      this.data.event.planet === "Mecatol Rex"
    ) {
      updates[`objectives.Custodians Token.scorers`] = [
        this.data.event.faction,
      ];
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
    const planets = buildPlanets(this.gameData);
    const planet = planets[this.data.event.planet];
    if (!planet) {
      return false;
    }

    if (planet.owner !== this.data.event.faction) {
      return false;
    }

    return true;
  }

  getUpdates(): Record<string, any> {
    // TODO: Figure out if [0.0.0] works.

    let prevOwner: string | undefined;
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
      [`planets.${this.data.event.planet}.owner`]: prevOwner ?? "DELETE",
    };

    if (
      claimedThisTurn &&
      !prevOwner &&
      this.data.event.planet === "Mecatol Rex"
    ) {
      updates[`objectives.Custodians Token.scorers`] = "DELETE";
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
      entry.data.action === "CLAIM_PLANET" &&
      entry.data.event.planet === this.data.event.planet &&
      entry.data.event.faction === this.data.event.faction
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
