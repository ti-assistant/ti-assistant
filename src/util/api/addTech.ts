import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    const handler = new AddTechHandler(storedGameData, data);

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

  DataManager.update((storedGameData) => {
    const handler = new RemoveTechHandler(storedGameData, data);

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
