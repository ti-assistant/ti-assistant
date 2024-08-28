import DataManager from "../../context/DataManager";
import { ChooseSubFactionHandler } from "../model/chooseSubFaction";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function chooseSubFaction(
  gameId: string,
  faction: "Council Keleres",
  subFaction: SubFaction
) {
  const data: GameUpdateData = {
    action: "CHOOSE_SUB_FACTION",
    event: {
      faction,
      subFaction,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new ChooseSubFactionHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateActionLog(storedGameData, handler, now);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
