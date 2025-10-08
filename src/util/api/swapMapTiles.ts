import { DataStore } from "../../context/dataStore";
import { SwapMapTilesHandler } from "../model/swapMapTiles";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function swapMapTiles(
  gameId: string,
  oldItem: {
    systemNumber: string;
    index: number;
  },
  newItem: {
    systemNumber: string;
    index: number;
  }
) {
  const data: GameUpdateData = {
    action: "SWAP_MAP_TILES",
    event: {
      oldItem,
      newItem,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new SwapMapTilesHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);
    updateGameData(storedGameData, handler.getUpdates());

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
