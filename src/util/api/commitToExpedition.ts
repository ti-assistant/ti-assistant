import { DataStore } from "../../context/dataStore";
import { CommitToExpeditionHandler } from "../model/commitToExpedition";
import { Optional } from "../types/types";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function commitToExpedition(
  gameId: string,
  expedition: keyof Expedition,
  factionId: Optional<FactionId>
) {
  const data: GameUpdateData = {
    action: "COMMIT_TO_EXPEDITION",
    event: {
      expedition,
      factionId,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new CommitToExpeditionHandler(storedGameData, data);

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
