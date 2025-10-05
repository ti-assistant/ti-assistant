import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
import {
  PlayComponentHandler,
  UnplayComponentHandler,
} from "../model/playComponent";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function playComponent(
  gameId: string,
  name: string,
  factionId: FactionId
) {
  const data: GameUpdateData = {
    action: "PLAY_COMPONENT",
    event: {
      name,
      factionId,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new PlayComponentHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    const gameTimer = TimerManager.getValue<number>("game");
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

    storedGameData.lastUpdate = now;

    return storedGameData;
  });
  TimerManager.update((timers) => {
    timers.paused = false;
    return timers;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}

export function unplayComponent(
  gameId: string,
  name: string,
  factionId: FactionId
) {
  const data: GameUpdateData = {
    action: "UNPLAY_COMPONENT",
    event: {
      name,
      factionId,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new UnplayComponentHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    const gameTimer = TimerManager.getValue<number>("game");
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });
  TimerManager.update((timers) => {
    timers.paused = false;
    return timers;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
