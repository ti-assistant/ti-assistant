import { DataStore } from "../../context/dataStore";
import {
  PlayAdjudicatorBaalHandler,
  UndoAdjudicatorBaalHandler,
} from "../model/playAdjudicatorBaal";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function playAdjudicatorBaal(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "PLAY_ADJUDICATOR_BAAL",
    event: {
      systemId,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new PlayAdjudicatorBaalHandler(storedGameData, data);

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

export function undoAdjudicatorBaal(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "UNDO_ADJUDICATOR_BAAL",
    event: {
      systemId,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new UndoAdjudicatorBaalHandler(storedGameData, data);

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
