import DataManager from "../../context/DataManager";
import {
  PlayActionCardHandler,
  UnplayActionCardHandler,
} from "../model/playActionCard";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function playActionCard(
  gameId: string,
  card: string,
  target: FactionId | "None"
) {
  const data: GameUpdateData = {
    action: "PLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new PlayActionCardHandler(storedGameData, data);

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

export function unplayActionCard(
  gameId: string,
  card: string,
  target: FactionId | "None"
) {
  const data: GameUpdateData = {
    action: "UNPLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new UnplayActionCardHandler(storedGameData, data);

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
