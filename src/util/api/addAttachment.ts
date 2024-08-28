import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    const handler = new AddAttachmentHandler(storedGameData, data);

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

  DataManager.update((storedGameData) => {
    const handler = new RemoveAttachmentHandler(storedGameData, data);

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
