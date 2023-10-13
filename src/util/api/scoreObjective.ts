import { mutate } from "swr";
import { poster } from "./util";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "../model/scoreObjective";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function scoreObjective(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const data: GameUpdateData = {
    action: "SCORE_OBJECTIVE",
    event: {
      faction,
      objective,
      key,
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
        const handler = new ScoreObjectiveHandler(currentData, data);

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

export function unscoreObjective(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const data: GameUpdateData = {
    action: "UNSCORE_OBJECTIVE",
    event: {
      faction,
      objective,
      key,
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
        const handler = new UnscoreObjectiveHandler(currentData, data);

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
