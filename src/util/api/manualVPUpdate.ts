import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    const handler = new ManualVPUpdateHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateActionLog(storedGameData, handler, now);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise;
}
