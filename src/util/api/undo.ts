import { use } from "react";
import { DatabaseFnsContext } from "../../context/contexts";
import { updateGameData } from "./handler";
import { getOppositeHandler } from "./opposite";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function useUndo() {
  const databaseFns = use(DatabaseFnsContext);
  return async (gameId: string) => {
    const data: GameUpdateData = {
      action: "UNDO",
    };

    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const updatePromise = poster(
      `/api/${gameId}/dataUpdate`,
      data,
      now,
      gameTime,
    );

    databaseFns.update((storedGameData) => {
      const actionLog = storedGameData.actionLog ?? [];
      let actionToUndo = actionLog[0];
      if (!actionToUndo) {
        return storedGameData;
      }

      const handler = getOppositeHandler(storedGameData, actionToUndo.data);
      if (!handler) {
        return storedGameData;
      }

      if (!handler.validate()) {
        return storedGameData;
      }

      const gameTimer = storedGameData.timers?.game;

      updateGameData(storedGameData, handler.getUpdates());
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
