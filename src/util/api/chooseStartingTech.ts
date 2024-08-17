import DataManager from "../../context/DataManager";
import {
  ChooseStartingTechHandler,
  RemoveStartingTechHandler,
} from "../model/chooseStartingTech";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function chooseStartingTech(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const data: GameUpdateData = {
    action: "CHOOSE_STARTING_TECH",
    event: {
      faction,
      tech: techId,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new ChooseStartingTechHandler(storedGameData, data);

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

export function removeStartingTech(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const data: GameUpdateData = {
    action: "REMOVE_STARTING_TECH",
    event: {
      faction,
      tech: techId,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new RemoveStartingTechHandler(storedGameData, data);

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
