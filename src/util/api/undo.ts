import { mutate } from "swr";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { poster } from "./util";
import { getOppositeHandler } from "./opposite";
import { updateActionLog } from "./update";

export function undo(gameId: string) {
  const data: GameUpdateData = {
    action: "UNDO",
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const actionLog = currentData.actionLog ?? [];
        let actionToUndo = actionLog[0];
        if (!actionToUndo) {
          return currentData;
        }

        const handler = getOppositeHandler(currentData, actionToUndo.data);
        if (!handler) {
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
