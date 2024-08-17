import DataManager from "../../context/DataManager";
import { AdvancePhaseHandler } from "../model/advancePhase";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function advancePhase(gameId: string, skipAgenda: boolean = false) {
  const data: GameUpdateData = {
    action: "ADVANCE_PHASE",
    event: {
      skipAgenda,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new AdvancePhaseHandler(storedGameData, data);

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
