import { use } from "react";
import { DatabaseFnsContext } from "../../context/contexts";
import { Optional } from "../types/types";
import { poster } from "./util";

interface UpdateFactionData {
  factionId: FactionId;
  playerName?: string;
  color?: FactionColor;
}

export function useUpdateFaction() {
  const databaseFns = use(DatabaseFnsContext);

  return async (
    gameId: string,
    factionId: FactionId,
    { playerName, color }: { playerName?: string; color?: FactionColor },
  ) => {
    const data: UpdateFactionData = {
      factionId,
      playerName,
      color,
    };

    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const updatePromise = poster(
      `/api/${gameId}/updateFaction`,
      data,
      now,
      gameTime,
    );

    databaseFns.update((storedGameData) => {
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

    try {
      return await updatePromise;
    } catch (_) {
      databaseFns.reset();
    }
  };
}
