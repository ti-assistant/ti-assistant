import { mutate } from "swr";
import { poster } from "./util";
import { SelectSubComponentHandler } from "../model/selectSubComponent";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function selectSubComponent(gameId: string, subComponent: string) {
  const data: GameUpdateData = {
    action: "SELECT_SUB_COMPONENT",
    event: {
      subComponent,
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
        const handler = new SelectSubComponentHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        const updates = handler.getUpdates();

        updateActionLog(currentData, handler);

        updateGameData(currentData, updates);

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}
