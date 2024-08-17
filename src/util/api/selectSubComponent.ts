import DataManager from "../../context/DataManager";
import { SelectSubComponentHandler } from "../model/selectSubComponent";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function selectSubComponent(gameId: string, subComponent: string) {
  const data: GameUpdateData = {
    action: "SELECT_SUB_COMPONENT",
    event: {
      subComponent,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new SelectSubComponentHandler(storedGameData, data);

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
