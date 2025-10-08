import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const handler = new SetObjectivePointsHandler(storedGameData, data);

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
