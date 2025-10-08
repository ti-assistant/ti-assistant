import { DataStore } from "../../context/dataStore";
import { UpdateBreakthroughStateHandler } from "../model/updateBreakthroughState";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function updateBreakthroughState(
  gameId: string,
  factionId: FactionId,
  state: ComponentState
) {
  const data: GameUpdateData = {
    action: "UPDATE_BREAKTHROUGH_STATE",
    event: {
      factionId,
      state,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new UpdateBreakthroughStateHandler(storedGameData, data);

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
