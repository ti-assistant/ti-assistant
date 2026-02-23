import { use } from "react";
import { DatabaseFnsContext } from "../../context/contexts";
import { poster } from "./util";

interface SetPauseData {
  paused: boolean;
}

export function useSetGlobalPause() {
  const databaseFns = use(DatabaseFnsContext);
  return async (gameId: string, paused: boolean) => {
    const data: SetPauseData = {
      paused,
    };

    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const updatePromise = poster(
      `/api/${gameId}/setPause`,
      data,
      now,
      gameTime,
    );

    databaseFns.update((storedGameData) => {
      const timers = storedGameData.timers ?? {};
      timers.paused = paused;
      storedGameData.timers = timers;

      return storedGameData;
    }, "CLIENT");

    try {
      return await updatePromise;
    } catch (_) {
      databaseFns.reset();
    }
  };
}
