import { Optional } from "../types/types";
import { objectEntries } from "../util";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "./claimPlanet";
import { UpdateBreakthroughStateHandler } from "./updateBreakthroughState";

function getExpeditionCountPerFaction(expedition: Optional<Expedition>) {
  if (!expedition) {
    return {};
  }
  const factionCounts: Partial<Record<FactionId, number>> = {};
  for (const factionId of Object.values(expedition)) {
    let count = factionCounts[factionId] ?? 0;
    count++;
    factionCounts[factionId] = count;
  }
  return factionCounts;
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

    // TODO: Account for tie-breaker.
    let addedFaction = !this.data.event.factionId;
    let removedFaction = !this.data.event.prevFaction;
    const counts = getExpeditionCountPerFaction(expedition);
    let { total, max, topFaction } = objectEntries(counts).reduce(
      (
        runningTally: { total: number; max: number; topFaction?: FactionId },
        [factionId, count]
      ) => {
        const updated = { ...runningTally };
        let localCount = count;
        if (factionId === this.data.event.factionId) {
          localCount++;
          addedFaction = true;
        }
        if (factionId === this.data.event.prevFaction) {
          localCount--;
          removedFaction = true;
        }
        updated.total += localCount;
        if (localCount > updated.max) {
          updated.max = localCount;
          updated.topFaction = factionId;
        }
        return updated;
      },
      { total: 0, max: 0, topFaction: undefined }
    );

    if (!addedFaction) {
      total++;
      if (max === 1) {
        // TODO: Handle tie-break including current player.
      }
    }

    console.log("Total", total);
    console.log("Top", topFaction);

    // If the previous faction should no longer have their breakthrough, lock their breakthrough.
    if (prevFaction) {
      const count = counts[prevFaction];
      if (count && count <= 1) {
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
      if (!count) {
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
      if (total >= 5 && topFaction) {
        const handler = new UnclaimPlanetHandler(this.gameData, {
          action: "UNCLAIM_PLANET",
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
