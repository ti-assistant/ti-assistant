import DataManager from "../../context/DataManager";
import { updateGameData } from "./handler";
import { getOppositeHandler } from "./opposite";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function undo(gameId: string) {
  const data: GameUpdateData = {
    action: "UNDO",
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const actionLog = storedGameData.actionLog ?? [];
    let actionToUndo = actionLog[0];
    if (!actionToUndo) {
      return storedGameData;
    }

    const handler = getOppositeHandler(storedGameData, actionToUndo.data);
    if (!handler) {
      return storedGameData;
    }

    if (!handler.validate()) {
      return storedGameData;
    }

    updateGameData(storedGameData, handler.getUpdates());
    updateActionLog(storedGameData, handler, now, storedGameData.timers.game);

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
