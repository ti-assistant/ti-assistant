import DataManager from "../../context/DataManager";
import { SelectSubAgendaHandler } from "../model/selectSubAgenda";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function selectSubAgenda(gameId: string, subAgenda: AgendaId | "None") {
  const data: GameUpdateData = {
    action: "SELECT_SUB_AGENDA",
    event: {
      subAgenda,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new SelectSubAgendaHandler(storedGameData, data);

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
