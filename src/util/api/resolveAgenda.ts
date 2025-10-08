import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const handler = new ResolveAgendaHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
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

  DataStore.update((storedGameData) => {
    const handler = new RepealAgendaHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
