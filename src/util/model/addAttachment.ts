import { buildPlanets } from "../../data/GameData";
import { arrayRemove, arrayUnion } from "../api/util";

export class AddAttachmentHandler implements Handler {
  constructor(public gameData: StoredGameData, public data: AddAttachmentData) {
    for (const [planetId, planet] of Object.entries(gameData.planets)) {
      if ((planet.attachments ?? []).includes(data.event.attachment)) {
        this.data.event.prevPlanet = planetId as PlanetId;
        break;
      }
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const planetAttachments =
      this.gameData.planets[this.data.event.planet]?.attachments ?? [];
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`planets.${this.data.event.planet}.attachments`]: arrayUnion(
        planetAttachments,
        this.data.event.attachment
      ),
    };

    if (this.data.event.prevPlanet) {
      const prevPlanetAttachments =
        this.gameData.planets[this.data.event.prevPlanet]?.attachments ?? [];
      updates[`planets.${this.data.event.prevPlanet}.attachments`] =
        arrayRemove(prevPlanetAttachments, this.data.event.attachment);
    }

    // TODO: Check for Xxcha commander unlock

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
      entry.data.action === "REMOVE_ATTACHMENT" &&
      entry.data.event.planet === this.data.event.planet &&
      entry.data.event.attachment === this.data.event.attachment
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}

export class RemoveAttachmentHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: RemoveAttachmentData
  ) {}

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    const planets = buildPlanets(this.gameData);
    const planetAttachments =
      planets[this.data.event.planet]?.attachments ?? [];
    const updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`planets.${this.data.event.planet}.attachments`]: arrayRemove(
        planetAttachments,
        this.data.event.attachment
      ),
    };

    if (this.data.event.prevPlanet) {
      const prevPlanetAttachments =
        planets[this.data.event.prevPlanet]?.attachments ?? [];
      updates[`planets.${this.data.event.prevPlanet}.attachments`] = arrayUnion(
        prevPlanetAttachments,
        this.data.event.attachment
      );
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
      entry.data.action === "ADD_ATTACHMENT" &&
      entry.data.event.planet === this.data.event.planet &&
      entry.data.event.attachment === this.data.event.attachment
    ) {
      return "DELETE";
    }

    return "IGNORE";
  }
}
