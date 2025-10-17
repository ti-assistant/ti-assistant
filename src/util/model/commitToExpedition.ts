import { Optional } from "../types/types";
import { objectEntries, objectKeys } from "../util";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "./claimPlanet";
import { UpdateBreakthroughStateHandler } from "./updateBreakthroughState";

function getExpeditionCountPerFaction(expedition: Expedition) {
  const factionCounts: Partial<Record<FactionId, number>> = {};
  for (const factionId of Object.values(expedition)) {
    let count = factionCounts[factionId] ?? 0;
    count++;
    factionCounts[factionId] = count;
  }
  return factionCounts;
}

function getPotentialOwners(expedition: Expedition) {
  const countsPerFaction: Partial<Record<FactionId, number>> = {};
  let max = 0;
  const owners = [];
  for (const factionId of Object.values(expedition)) {
    let count = countsPerFaction[factionId] ?? 0;
    count++;
    max = Math.max(count, max);
    countsPerFaction[factionId] = count;
  }

  return objectEntries(countsPerFaction)
    .filter(([_, count]) => count === max)
    .map(([factionId, _]) => factionId);
}

export class CommitToExpeditionHandler implements Handler {
  constructor(
    public gameData: StoredGameData,
    public data: CommitToExpeditionData
  ) {
    const expedition = gameData.expedition ?? {};
    const prevFaction = expedition[data.event.expedition];
    if (prevFaction) {
      this.data.event.prevFaction = expedition[data.event.expedition];
    }
  }

  validate(): boolean {
    return true;
  }

  getUpdates(): Record<string, any> {
    let updates: Record<string, any> = {
      [`state.paused`]: false,
      [`sequenceNum`]: "INCREMENT",
    };

    const expedition = this.gameData.expedition ?? {};
    const prevFaction = expedition[this.data.event.expedition];

    // This shouldn't happen, but checking just to be safe.
    if (prevFaction === this.data.event.factionId) {
      return updates;
    }

    if (this.data.event.factionId) {
      expedition[this.data.event.expedition] = this.data.event.factionId;
    } else if (this.data.event.prevFaction) {
      delete expedition[this.data.event.expedition];
    }

    const total = objectKeys(expedition).length;
    let topFaction: Optional<FactionId>;
    const potentialOwners = getPotentialOwners(expedition);
    if (potentialOwners.length === 1) {
      topFaction = potentialOwners[0];
    }

    const counts = getExpeditionCountPerFaction(expedition);

    // If the previous faction should no longer have their breakthrough, lock their breakthrough.
    if (prevFaction) {
      const count = counts[prevFaction];
      if (!count) {
        const handler = new UpdateBreakthroughStateHandler(this.gameData, {
          action: "UPDATE_BREAKTHROUGH_STATE",
          event: {
            factionId: prevFaction,
            state: "locked",
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
      }
    }

    const factionId = this.data.event.factionId;
    if (factionId) {
      updates[`expedition.${this.data.event.expedition}`] = factionId;

      // If this faction should now have their breakthrough, update accordingly.
      const count = counts[factionId];
      if (count === 1) {
        const handler = new UpdateBreakthroughStateHandler(this.gameData, {
          action: "UPDATE_BREAKTHROUGH_STATE",
          event: {
            factionId,
            state: "readied",
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
      }
      // TODO: If this was the 6th expedition, add ownership of Thunder's Edge based on rules.
      if (total >= 6 && topFaction) {
        const handler = new ClaimPlanetHandler(this.gameData, {
          action: "CLAIM_PLANET",
          event: {
            faction: topFaction,
            planet: "Thunder's Edge",
          },
        });
        updates = {
          ...updates,
          ...handler.getUpdates(),
        };
      }
    } else {
      updates[`expedition.${this.data.event.expedition}`] = "DELETE";
      // TODO: If this was the 6th expedition, remove ownership of Thunder's Edge.
      if (total >= 5) {
        const handler = new UnclaimPlanetHandler(this.gameData, {
          action: "UNCLAIM_PLANET",
          event: {
            faction: "Vuil'raith Cabal",
            planet: "Thunder's Edge",
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
      entry.data.action === "COMMIT_TO_EXPEDITION" &&
      entry.data.event.expedition === this.data.event.expedition
    ) {
      if (
        this.data.event.factionId === entry.data.event.prevFaction &&
        this.data.event.prevFaction === entry.data.event.factionId
      ) {
        return "DELETE";
      }
    }
    return "IGNORE";
  }
}
