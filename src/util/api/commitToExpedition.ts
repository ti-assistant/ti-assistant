import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    const handler = new CommitToExpeditionHandler(storedGameData, data);

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
