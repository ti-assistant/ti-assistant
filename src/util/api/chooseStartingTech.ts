import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const handler = new ChooseStartingTechHandler(storedGameData, data);

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

  DataStore.update((storedGameData) => {
    const handler = new RemoveStartingTechHandler(storedGameData, data);

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
