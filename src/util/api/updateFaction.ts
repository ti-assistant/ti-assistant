import { DataStore } from "../../context/dataStore";
import { Optional } from "../types/types";
import dataUpdate from "./dataUpdate";
import { poster } from "./util";

interface UpdateFactionData {
  factionId: FactionId;
  playerName?: string;
  color?: FactionColor;
}

export function updateFaction(
  gameId: string,
  factionId: FactionId,
  { playerName, color }: { playerName?: string; color?: FactionColor },
) {
  const data: UpdateFactionData = {
    factionId,
    playerName,
    color,
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/updateFaction`, data, now);

  DataStore.update((storedGameData) => {
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
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
