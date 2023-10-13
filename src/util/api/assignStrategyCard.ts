import { mutate } from "swr";
import { AssignStrategyCardHandler } from "../model/assignStrategyCard";
import { poster } from "./util";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function assignStrategyCard(
  gameId: string,
  assignedTo: FactionId,
  cardId: StrategyCardId,
  pickedBy: FactionId
) {
  const data: GameUpdateData = {
    action: "ASSIGN_STRATEGY_CARD",
    event: {
      assignedTo,
      id: cardId,
      pickedBy,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new AssignStrategyCardHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        updateGameData(currentData, handler.getUpdates());

        updateActionLog(currentData, handler);

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}
