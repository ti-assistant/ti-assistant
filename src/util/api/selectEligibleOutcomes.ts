import { mutate } from "swr";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { SelectEligibleOutcomesHandler } from "../model/selectEligibleOutcomes";
import { OutcomeType } from "./agendas";

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

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new SelectEligibleOutcomesHandler(storedGameData, data);

        if (!handler.validate()) {
          return storedGameData;
        }

        const updates = handler.getUpdates();

        updateActionLog(storedGameData, handler);

        updateGameData(storedGameData, updates);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}
