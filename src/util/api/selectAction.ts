import { mutate } from "swr";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import {
  SelectActionHandler,
  UnselectActionHandler,
} from "../model/selectAction";

export function selectAction(gameId: string, action: string) {
  const data: GameUpdateData = {
    action: "SELECT_ACTION",
    event: {
      action,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new SelectActionHandler(storedGameData, data);

        if (!handler.validate()) {
          return storedGameData;
        }

        const updates = handler.getUpdates();

        updateActionLog(storedGameData, handler);

        updateGameData(storedGameData, updates);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}

export function unselectAction(gameId: string, action: string) {
  const data: GameUpdateData = {
    action: "UNSELECT_ACTION",
    event: {
      action,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new UnselectActionHandler(storedGameData, data);

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
