import TimerManager from "../../context/TimerManager";
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

  TimerManager.update((storedTimers) => {
    storedTimers.paused = paused;

    return storedTimers;
  });

  return updatePromise.catch((_) => {
    TimerManager.reset();
  });
}
