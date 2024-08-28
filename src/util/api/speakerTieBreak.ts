import DataManager from "../../context/DataManager";
import { SpeakerTieBreakHandler } from "../model/speakerTieBreak";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function speakerTieBreak(gameId: string, tieBreak: string) {
  const data: GameUpdateData = {
    action: "SPEAKER_TIE_BREAK",
    event: {
      tieBreak,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataManager.update((storedGameData) => {
    const handler = new SpeakerTieBreakHandler(storedGameData, data);

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
