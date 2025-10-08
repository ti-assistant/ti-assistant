import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const handler = new AssignStrategyCardHandler(storedGameData, data);

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
