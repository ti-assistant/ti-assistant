import DataManager from "../../context/DataManager";
import { PlayRiderHandler, UnplayRiderHandler } from "../model/playRider";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function playRider(
  gameId: string,
  rider: string,
  faction?: FactionId,
  outcome?: string
) {
  const data: GameUpdateData = {
    action: "PLAY_RIDER",
    event: {
      rider,
      faction,
      outcome,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new PlayRiderHandler(storedGameData, data);

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

export function unplayRider(gameId: string, rider: string) {
  const data: GameUpdateData = {
    action: "UNPLAY_RIDER",
    event: {
      rider,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new UnplayRiderHandler(storedGameData, data);

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
