import { mutate } from "swr";
import { poster } from "./util";
import { PlayRiderHandler, UnplayRiderHandler } from "../model/playRider";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function playRider(
  gameId: string,
  rider: string,
  faction?: FactionId,
  outcome?: string
) {
  const data: GameUpdateData = {
    action: "PLAY_RIDER",
    event: {
      rider,
      faction,
      outcome,
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
        const handler = new PlayRiderHandler(currentData, data);

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

export function unplayRider(gameId: string, rider: string) {
  const data: GameUpdateData = {
    action: "UNPLAY_RIDER",
    event: {
      rider,
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
        const handler = new UnplayRiderHandler(currentData, data);

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
