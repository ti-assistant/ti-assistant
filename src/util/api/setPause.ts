import DataManager from "../../context/DataManager";
import { poster } from "./util";

interface SetPauseData {
  paused: boolean;
}

export function setGlobalPause(gameId: string, paused: boolean) {
  const data: SetPauseData = {
    paused,
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/setPause`, data, now);

  DataManager.update((storedGameData) => {
    storedGameData.state.paused = paused;
    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
