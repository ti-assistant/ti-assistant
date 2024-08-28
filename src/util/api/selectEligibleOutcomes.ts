import DataManager from "../../context/DataManager";
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

    updateActionLog(storedGameData, handler, now);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
