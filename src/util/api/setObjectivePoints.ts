import DataManager from "../../context/DataManager";
import { SetObjectivePointsHandler } from "../model/setObjectivePoints";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function setObjectivePoints(
  gameId: string,
  objective: string,
  points: number
) {
  const data: GameUpdateData = {
    action: "SET_OBJECTIVE_POINTS",
    event: {
      objective,
      points,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new SetObjectivePointsHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateActionLog(storedGameData, handler, now, storedGameData.timers.game);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
