import { DataStore } from "../../context/dataStore";
import { StartVotingHandler } from "../model/startVoting";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function startVoting(gameId: string) {
  const data: GameUpdateData = {
    action: "START_VOTING",
    event: {},
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new StartVotingHandler(storedGameData, data);

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
