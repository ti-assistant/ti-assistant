import DataManager from "../../context/DataManager";
import {
  HideObjectiveHandler,
  RevealObjectiveHandler,
} from "../model/revealObjective";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function revealObjective(gameId: string, objective: ObjectiveId) {
  const data: GameUpdateData = {
    action: "REVEAL_OBJECTIVE",
    event: {
      objective,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new RevealObjectiveHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateActionLog(storedGameData, handler, now);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}

export function hideObjective(gameId: string, objective: ObjectiveId) {
  const data: GameUpdateData = {
    action: "HIDE_OBJECTIVE",
    event: {
      objective,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new HideObjectiveHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateActionLog(storedGameData, handler, now);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
