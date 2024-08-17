import DataManager from "../../context/DataManager";
import {
  SelectActionHandler,
  UnselectActionHandler,
} from "../model/selectAction";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function selectAction(gameId: string, action: Action) {
  const data: GameUpdateData = {
    action: "SELECT_ACTION",
    event: {
      action,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new SelectActionHandler(storedGameData, data);

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

export function unselectAction(gameId: string, action: Action) {
  const data: GameUpdateData = {
    action: "UNSELECT_ACTION",
    event: {
      action,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new UnselectActionHandler(storedGameData, data);

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
