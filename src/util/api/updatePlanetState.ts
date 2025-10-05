import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
import { UpdatePlanetStateHandler } from "../model/updatePlanetState";
import { updateGameData, updateTimers } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function updatePlanetState(
  gameId: string,
  planet: PlanetId,
  state: PlanetState
) {
  const data: GameUpdateData = {
    action: "UPDATE_PLANET_STATE",
    event: {
      planet,
      state,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new UpdatePlanetStateHandler(storedGameData, data);

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
