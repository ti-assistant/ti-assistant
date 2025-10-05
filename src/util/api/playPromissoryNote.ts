import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
import {
  PlayPromissoryNoteHandler,
  UnplayPromissoryNoteHandler,
} from "../model/playPromissoryNote";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function playPromissoryNote(
  gameId: string,
  card: string,
  target: FactionId
) {
  const data: GameUpdateData = {
    action: "PLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new PlayPromissoryNoteHandler(storedGameData, data);

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

export function unplayPromissoryNote(
  gameId: string,
  card: string,
  target: FactionId
) {
  const data: GameUpdateData = {
    action: "UNPLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new UnplayPromissoryNoteHandler(storedGameData, data);

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
