import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
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

  DataManager.update((storedGameData) => {
    const handler = new ScoreObjectiveHandler(storedGameData, data);

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

  DataManager.update((storedGameData) => {
    const handler = new UnscoreObjectiveHandler(storedGameData, data);

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
