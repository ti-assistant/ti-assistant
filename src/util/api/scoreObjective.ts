import { DataStore } from "../../context/dataStore";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "../model/scoreObjective";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function scoreObjective(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const data: GameUpdateData = {
    action: "SCORE_OBJECTIVE",
    event: {
      faction,
      objective,
      key,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new ScoreObjectiveHandler(storedGameData, data);

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

export function unscoreObjective(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const data: GameUpdateData = {
    action: "UNSCORE_OBJECTIVE",
    event: {
      faction,
      objective,
      key,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new UnscoreObjectiveHandler(storedGameData, data);

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
