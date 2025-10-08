import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const handler = new PlayComponentHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
      if (data.event.name === "Puppets of the Blade") {
        storedGameData.timers.Obsidian = storedGameData.timers.Firmament ?? 0;
        delete storedGameData.timers.Firmament;
      }
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
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

  DataStore.update((storedGameData) => {
    const handler = new UnplayComponentHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);
    updateGameData(storedGameData, handler.getUpdates());

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
      if (data.event.name === "Puppets of the Blade") {
        storedGameData.timers.Firmament = storedGameData.timers.Obsidian ?? 0;
        delete storedGameData.timers.Obsidian;
      }
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
