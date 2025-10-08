import { DataStore } from "../../context/dataStore";
import { ManualVPUpdateHandler } from "../model/manualVPUpdate";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function manualVPUpdate(
  gameId: string,
  faction: FactionId,
  vps: number
) {
  const data: GameUpdateData = {
    action: "MANUAL_VP_UPDATE",
    event: {
      faction,
      vps,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new ManualVPUpdateHandler(storedGameData, data);

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
