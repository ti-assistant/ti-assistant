import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    const handler = new UpdateBreakthroughStateHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateActionLog(storedGameData, handler, now, storedGameData.timers.game);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
