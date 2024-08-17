import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    const handler = new SwapMapTilesHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateActionLog(storedGameData, handler, now);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise;
}
