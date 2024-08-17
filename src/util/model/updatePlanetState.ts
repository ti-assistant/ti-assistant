// Note: This doesn't handle exhausted planets.
export class UpdatePlanetStateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UpdatePlanetStateData
  ) {
    const planet = (gameData.planets ?? {})[data.event.planet];
    if (planet) {
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
      [`planets.${this.data.event.planet}.state`]: this.data.event.state,
    };

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
