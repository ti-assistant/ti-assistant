import { DataStore } from "../../context/dataStore";
import { SelectEligibleOutcomesHandler } from "../model/selectEligibleOutcomes";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function selectEligibleOutcomes(
  gameId: string,
  outcomes: OutcomeType | "None"
) {
  const data: GameUpdateData = {
    action: "SELECT_ELIGIBLE_OUTCOMES",
    event: {
      outcomes,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new SelectEligibleOutcomesHandler(storedGameData, data);

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
