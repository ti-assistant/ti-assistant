import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    const handler = new UpdatePlanetStateHandler(storedGameData, data);

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
