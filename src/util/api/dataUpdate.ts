import { use } from "react";
import { DatabaseFnsContext } from "../../context/contexts";
import { getHandler } from "./gameLog";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function useDataUpdate() {
  const databaseFns = use(DatabaseFnsContext);

  return async <DataType extends GameUpdateData>(data: DataType) => {
    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const gameId = databaseFns.getValue("gameId");
    const viewOnly = databaseFns.getValue("viewOnly");

    if (!gameId || viewOnly) {
      return;
    }

    const updatePromise = poster(
      `/api/${gameId}/dataUpdate`,
      data,
      now,
      gameTime,
    );

    databaseFns.update((storedGameData) => {
      const handler = getHandler(storedGameData, data);

      if (!handler || !handler.validate()) {
        return storedGameData;
      }

      updateGameData(storedGameData, handler.getUpdates());
      const gameTimer = storedGameData.timers?.game;
      updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

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
