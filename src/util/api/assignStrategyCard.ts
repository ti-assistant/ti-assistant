import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
import { AssignStrategyCardHandler } from "../model/assignStrategyCard";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function assignStrategyCard(
  gameId: string,
  assignedTo: FactionId,
  cardId: StrategyCardId,
  pickedBy: FactionId
) {
  const data: AssignStrategyCardData = {
    action: "ASSIGN_STRATEGY_CARD",
    event: {
      assignedTo,
      id: cardId,
      pickedBy,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new AssignStrategyCardHandler(storedGameData, data);

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
