import { DataStore } from "../../context/dataStore";
import { AddTechHandler, RemoveTechHandler } from "../model/addTech";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function addTech(
  gameId: string,
  faction: FactionId,
  techId: TechId,
  additionalFactions?: FactionId[],
  researchAgreement?: boolean,
  shareKnowledge?: boolean
) {
  const data: GameUpdateData = {
    action: "ADD_TECH",
    event: {
      faction,
      additionalFactions,
      tech: techId,
      researchAgreement,
      shareKnowledge,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new AddTechHandler(storedGameData, data);

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

export function removeTech(
  gameId: string,
  faction: FactionId,
  techId: TechId,
  additionalFactions?: FactionId[]
) {
  const data: GameUpdateData = {
    action: "REMOVE_TECH",
    event: {
      faction,
      tech: techId,
      additionalFactions,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new RemoveTechHandler(storedGameData, data);

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
