import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
import { UpdateLeaderStateHandler } from "../model/updateLeaderState";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function updateLeaderState(
  gameId: string,
  leaderId: LeaderId,
  state: LeaderState
) {
  const data: GameUpdateData = {
    action: "UPDATE_LEADER_STATE",
    event: {
      leaderId,
      state,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new UpdateLeaderStateHandler(storedGameData, data);

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
