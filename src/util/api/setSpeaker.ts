import DataManager from "../../context/DataManager";
import { SetSpeakerHandler } from "../model/setSpeaker";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function setSpeaker(gameId: string, newSpeaker: FactionId) {
  const data: GameUpdateData = {
    action: "SET_SPEAKER",
    event: {
      newSpeaker,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new SetSpeakerHandler(storedGameData, data);

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
