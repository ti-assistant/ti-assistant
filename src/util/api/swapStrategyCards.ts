import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
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

  DataManager.update((storedGameData) => {
    const handler = new SwapStrategyCardsHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    const gameTimer = TimerManager.getValue<number>("game");
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

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
