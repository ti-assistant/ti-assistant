import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
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

  DataManager.update((storedGameData) => {
    const handler = new SelectEligibleOutcomesHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    const gameTimer = TimerManager.getValue<number>("game");
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });
  TimerManager.update((timers) => {
    timers.paused = false;
    return timers;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
