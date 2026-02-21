import { use } from "react";
import { DatabaseFnsContext } from "../../context/contexts";
import {
  PlayComponentHandler,
  UnplayComponentHandler,
} from "../model/playComponent";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

// Requires custom logic to update timers.
export function usePlayComponent() {
  const databaseFns = use(DatabaseFnsContext);

  return async (name: string, factionId: FactionId) => {
    const data: GameUpdateData = {
      action: "PLAY_COMPONENT",
      event: {
        name,
        factionId,
      },
    };

    const gameId = databaseFns.getValue("gameId");
    if (!gameId) {
      return;
    }
    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const updatePromise = poster(
      `/api/${gameId}/dataUpdate`,
      data,
      now,
      gameTime,
    );

    databaseFns.update((storedGameData) => {
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

    try {
      return await updatePromise;
    } catch (_) {
      databaseFns.reset();
    }
  };
}

export function useUnplayComponent() {
  const databaseFns = use(DatabaseFnsContext);

  return async (name: string, factionId: FactionId) => {
    const data: GameUpdateData = {
      action: "UNPLAY_COMPONENT",
      event: {
        name,
        factionId,
      },
    };

    const gameId = databaseFns.getValue("gameId");
    if (!gameId) {
      return;
    }
    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const updatePromise = poster(
      `/api/${gameId}/dataUpdate`,
      data,
      now,
      gameTime,
    );

    databaseFns.update((storedGameData) => {
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

    try {
      return await updatePromise;
    } catch (_) {
      databaseFns.reset();
    }
  };
}
