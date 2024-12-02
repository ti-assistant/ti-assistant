import DataManager from "../../context/DataManager";
import { HideAgendaHandler, RevealAgendaHandler } from "../model/revealAgenda";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function revealAgenda(gameId: string, agenda: AgendaId) {
  const data: GameUpdateData = {
    action: "REVEAL_AGENDA",
    event: {
      agenda,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new RevealAgendaHandler(storedGameData, data);

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

export function hideAgenda(gameId: string, agenda: AgendaId, veto?: boolean) {
  const data: GameUpdateData = {
    action: "HIDE_AGENDA",
    event: {
      agenda,
      veto,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new HideAgendaHandler(storedGameData, data);

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
