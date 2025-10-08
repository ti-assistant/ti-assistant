import { DataStore } from "../../context/dataStore";
import {
  AddAttachmentHandler,
  RemoveAttachmentHandler,
} from "../model/addAttachment";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

// TODO: Determine whether planet treatment is necessary.
export function addAttachment(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
) {
  const data: GameUpdateData = {
    action: "ADD_ATTACHMENT",
    event: {
      attachment,
      planet,
    },
  };
  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new AddAttachmentHandler(storedGameData, data);

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

export function removeAttachment(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
) {
  const data: GameUpdateData = {
    action: "REMOVE_ATTACHMENT",
    event: {
      attachment,
      planet,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new RemoveAttachmentHandler(storedGameData, data);

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
