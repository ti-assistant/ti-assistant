import { mutate } from "swr";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "../model/scoreObjective";

export function scoreObjective(
  gameId: string,
  faction: string,
  objective: string,
  key?: string
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
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new ScoreObjectiveHandler(storedGameData, data);

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

export function unscoreObjective(
  gameId: string,
  faction: string,
  objective: string,
  key?: string
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
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new UnscoreObjectiveHandler(storedGameData, data);

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
