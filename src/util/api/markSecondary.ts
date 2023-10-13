import { mutate } from "swr";
import { poster } from "./util";
import { MarkSecondaryHandler } from "../model/markSecondary";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function markSecondary(
  gameId: string,
  faction: FactionId,
  state: Secondary
) {
  const data: GameUpdateData = {
    action: "MARK_SECONDARY",
    event: {
      faction,
      state,
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
        const handler = new MarkSecondaryHandler(currentData, data);

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
