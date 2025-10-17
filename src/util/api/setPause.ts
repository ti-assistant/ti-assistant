import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const timers = storedGameData.timers ?? {};
    timers.paused = paused;
    storedGameData.timers = timers;

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
