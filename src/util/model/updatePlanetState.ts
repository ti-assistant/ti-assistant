// Note: This doesn't handle exhausted planets.
export class UpdatePlanetStateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UpdatePlanetStateData
  ) {
    const planet = gameData.planets[data.event.planet];
    if (planet && planet.state) {
      this.data.event.prevState = planet.state;
    } else {
      this.data.event.prevState = "READIED";
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`planets.${this.data.event.planet}.state`]: this.data.event.state,
    };

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
      entry.data.action === "UPDATE_PLANET_STATE" &&
      entry.data.event.planet === this.data.event.planet
    ) {
      if (this.data.event.state === "READIED") {
        return "DELETE";
      }
      return "REPLACE";
    }
    return "IGNORE";
  }
}
