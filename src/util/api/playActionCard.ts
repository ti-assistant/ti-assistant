import { mutate } from "swr";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import {
  PlayActionCardHandler,
  UnplayActionCardHandler,
} from "../model/playActionCard";

export function playActionCard(gameId: string, card: string, target: string) {
  const data: GameUpdateData = {
    action: "PLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new PlayActionCardHandler(storedGameData, data);

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

export function unplayActionCard(gameId: string, card: string, target: string) {
  const data: GameUpdateData = {
    action: "UNPLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new UnplayActionCardHandler(storedGameData, data);

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
