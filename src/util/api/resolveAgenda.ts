import DataManager from "../../context/DataManager";
import {
  RepealAgendaHandler,
  ResolveAgendaHandler,
} from "../model/resolveAgenda";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function resolveAgenda(
  gameId: string,
  agenda: AgendaId,
  target: string
) {
  const data: GameUpdateData = {
    action: "RESOLVE_AGENDA",
    event: {
      agenda,
      target,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new ResolveAgendaHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    updateActionLog(storedGameData, handler, now, storedGameData.timers.game);

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}

export function repealAgenda(gameId: string, agenda: AgendaId, target: string) {
  const data: GameUpdateData = {
    action: "REPEAL_AGENDA",
    event: {
      agenda,
      target,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new RepealAgendaHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    updateActionLog(storedGameData, handler, now, storedGameData.timers.game);

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
