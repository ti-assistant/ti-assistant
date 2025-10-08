import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const handler = new UpdateLeaderStateHandler(storedGameData, data);

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
