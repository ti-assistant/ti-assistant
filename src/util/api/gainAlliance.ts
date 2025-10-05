import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
import {
  GainAllianceHandler,
  LoseAllianceHandler,
} from "../model/gainAlliance";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function gainAlliance(
  gameId: string,
  faction: FactionId,
  fromFaction: FactionId
) {
  const data: GameUpdateData = {
    action: "GAIN_ALLIANCE",
    event: {
      faction,
      fromFaction,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new GainAllianceHandler(storedGameData, data);

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

export function loseAlliance(
  gameId: string,
  faction: FactionId,
  fromFaction: FactionId
) {
  const data: GameUpdateData = {
    action: "LOSE_ALLIANCE",
    event: {
      faction,
      fromFaction,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new LoseAllianceHandler(storedGameData, data);

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
