import DataManager from "../../context/DataManager";
import { SelectFactionHandler } from "../model/selectFaction";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function selectFaction(gameId: string, faction: FactionId | "None") {
  const data: GameUpdateData = {
    action: "SELECT_FACTION",
    event: {
      faction,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new SelectFactionHandler(storedGameData, data);

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
