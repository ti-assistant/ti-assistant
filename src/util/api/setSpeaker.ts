import { DataStore } from "../../context/dataStore";
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

  DataStore.update((storedGameData) => {
    const handler = new SetSpeakerHandler(storedGameData, data);

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
