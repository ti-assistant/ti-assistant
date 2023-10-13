import { mutate } from "swr";
import { poster } from "./util";
import { SetObjectivePointsHandler } from "../model/setObjectivePoints";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function setObjectivePoints(
  gameId: string,
  objective: string,
  points: number
) {
  const data: GameUpdateData = {
    action: "SET_OBJECTIVE_POINTS",
    event: {
      objective,
      points,
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
        const handler = new SetObjectivePointsHandler(currentData, data);

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
