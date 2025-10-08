import { DataStore } from "../../context/dataStore";
import { SwapStrategyCardsHandler } from "../model/swapStrategyCards";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function swapStrategyCards(
  gameId: string,
  cardOne: StrategyCardId,
  cardTwo: StrategyCardId,
  imperialArbiter?: boolean
) {
  const data: GameUpdateData = {
    action: "SWAP_STRATEGY_CARDS",
    event: {
      cardOne,
      cardTwo,
      imperialArbiter,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new SwapStrategyCardsHandler(storedGameData, data);

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
