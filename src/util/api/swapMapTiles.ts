import { SwapMapTilesHandler } from "../model/swapMapTiles";
import dataUpdate from "./dataUpdate";

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

  return dataUpdate(gameId, data, SwapMapTilesHandler);
}
