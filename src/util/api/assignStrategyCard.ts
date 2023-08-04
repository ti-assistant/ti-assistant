import { mutate } from "swr";
import { AssignStrategyCardHandler } from "../model/assignStrategyCard";
import { updateGameData, updateActionLog } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { StrategyCardName } from "./cards";

export function assignStrategyCard(
  gameId: string,
  assignedTo: string,
  cardName: StrategyCardName,
  pickedBy: string
) {
  const data: GameUpdateData = {
    action: "ASSIGN_STRATEGY_CARD",
    event: {
      assignedTo,
      name: cardName,
      pickedBy,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new AssignStrategyCardHandler(storedGameData, data);

        if (!handler.validate()) {
          return storedGameData;
        }

        updateGameData(storedGameData, handler.getUpdates());

        updateActionLog(storedGameData, handler);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}
