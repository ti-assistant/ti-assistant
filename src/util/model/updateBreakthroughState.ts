import { Optional } from "../types/types";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "./claimPlanet";

// Note: This doesn't handle exhausted breakthroughs.
export class UpdateBreakthroughStateHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: UpdateBreakthroughStateData
  ) {
    const faction = gameData.factions[data.event.factionId];
    const state = faction?.breakthrough?.state;
    if (state) {
      this.data.event.prevState = state;
    } else {
      this.data.event.prevState = "locked";
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
      [`factions.${this.data.event.factionId}.breakthrough.state`]:
        this.data.event.state === "locked" ? "DELETE" : this.data.event.state,
    };

    switch (this.data.event.factionId) {
      case "Council Keleres": {
        let handler: Optional<Handler>;
        switch (this.data.event.state) {
          case "locked":
            handler = new UnclaimPlanetHandler(this.gameData, {
              action: "UNCLAIM_PLANET",
              event: {
                planet: "Custodia Vigilia",
                faction: "Council Keleres",
              },
            });
            break;
          case "readied":
            handler = new ClaimPlanetHandler(this.gameData, {
              action: "CLAIM_PLANET",
              event: {
                planet: "Custodia Vigilia",
                faction: "Council Keleres",
              },
            });
            break;
        }
        if (handler) {
          updates = {
            ...updates,
            ...handler.getUpdates(),
          };
        }
        break;
      }
      case "Embers of Muaat": {
        let handler: Optional<Handler>;
        switch (this.data.event.state) {
          case "locked":
            handler = new UnclaimPlanetHandler(this.gameData, {
              action: "UNCLAIM_PLANET",
              event: {
                planet: "Avernus",
                faction: "Embers of Muaat",
              },
            });
            break;
          case "readied":
            handler = new ClaimPlanetHandler(this.gameData, {
              action: "CLAIM_PLANET",
              event: {
                planet: "Avernus",
                faction: "Embers of Muaat",
              },
            });
            break;
        }
        if (handler) {
          updates = {
            ...updates,
            ...handler.getUpdates(),
          };
        }
        break;
      }
    }
    if (this.data.event.factionId === "Embers of Muaat") {
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
      entry.data.action === "UPDATE_BREAKTHROUGH_STATE" &&
      entry.data.event.factionId === this.data.event.factionId
    ) {
      if (
        entry.data.event.prevState === this.data.event.state ||
        !entry.data.event.prevState
      ) {
        return "DELETE";
      }
      return "IGNORE";
    }
    return "IGNORE";
  }
}
