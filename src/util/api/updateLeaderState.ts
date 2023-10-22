import { mutate } from "swr";
import { poster } from "./util";
import { UpdateLeaderStateHandler } from "../model/updateLeaderState";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function updateLeaderState(
  gameId: string,
  factionId: FactionId,
  leaderType: LeaderType,
  state: LeaderState
) {
  const data: GameUpdateData = {
    action: "UPDATE_LEADER_STATE",
    event: {
      factionId,
      leaderType,
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
        const handler = new UpdateLeaderStateHandler(currentData, data);

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
