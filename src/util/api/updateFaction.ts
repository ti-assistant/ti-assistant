import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
import { Optional } from "../types/types";
import { poster } from "./util";

interface UpdateFactionData {
  factionId: FactionId;
  playerName?: string;
  color?: string;
}

export function updateFaction(
  gameId: string,
  factionId: FactionId,
  { playerName, color }: { playerName?: string; color?: string }
) {
  const data: UpdateFactionData = {
    factionId,
    playerName,
    color,
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/updateFaction`, data, now);

  DataManager.update((storedGameData) => {
    const faction = storedGameData.factions[factionId];
    if (!faction) {
      return storedGameData;
    }
    if (playerName) {
      faction.playerName = playerName;
    }
    if (color) {
      let factionToSwap: Optional<FactionId>;
      for (const otherFaction of Object.values(storedGameData.factions)) {
        if (otherFaction.color === color) {
          factionToSwap = otherFaction.id;
          break;
        }
      }
      if (factionToSwap) {
        const otherFaction = storedGameData.factions[factionToSwap];
        if (!otherFaction) {
          return storedGameData;
        }
        otherFaction.color = faction.color;
        storedGameData.factions[factionToSwap] = otherFaction;
      }
      faction.color = color;
      storedGameData.factions[factionId] = faction;
    }

    return storedGameData;
  });
  TimerManager.update((timers) => {
    timers.paused = false;
    return timers;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
