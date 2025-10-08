import { DataStore } from "../../context/dataStore";
import { UpdatePlanetStateHandler } from "../model/updatePlanetState";
import { updateGameData } from "./handler";
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

  DataStore.update((storedGameData) => {
    const handler = new UpdatePlanetStateHandler(storedGameData, data);

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
