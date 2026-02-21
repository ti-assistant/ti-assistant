import { use } from "react";
import { DatabaseFnsContext } from "../../context/contexts";
import { poster } from "./util";

interface ChangeOptionData {
  option: string;
  value: any;
}

export function useChangeOption() {
  const databaseFns = use(DatabaseFnsContext);
  return async (gameId: string, option: string, value: any) => {
    const data: ChangeOptionData = {
      option,
      value,
    };

    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const updatePromise = poster(
      `/api/${gameId}/changeOption`,
      data,
      now,
      gameTime,
    );

    databaseFns.update((storedGameData) => {
      storedGameData.options[option] = value;
      if (storedGameData.timers) {
        storedGameData.timers.paused = false;
      }

      return storedGameData;
    }, "CLIENT");

    try {
      return await updatePromise;
    } catch (_) {
      databaseFns.reset();
    }
  };
}
