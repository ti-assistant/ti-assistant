import { mutate } from "swr";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";
import {
  PlayAdjudicatorBaalHandler,
  UndoAdjudicatorBaalHandler,
} from "../model/playAdjudicatorBaal";

export function playAdjudicatorBaal(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "PLAY_ADJUDICATOR_BAAL",
    event: {
      systemId,
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
        const handler = new PlayAdjudicatorBaalHandler(currentData, data);

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

export function undoAdjudicatorBaal(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "UNDO_ADJUDICATOR_BAAL",
    event: {
      systemId,
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
        const handler = new UndoAdjudicatorBaalHandler(currentData, data);

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
