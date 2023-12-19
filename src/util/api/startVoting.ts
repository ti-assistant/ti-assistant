import { mutate } from "swr";
import { poster } from "./util";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { StartVotingHandler } from "../model/startVoting";

export function startVoting(gameId: string) {
  const data: GameUpdateData = {
    action: "START_VOTING",
    event: {},
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new StartVotingHandler(currentData, data);

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
