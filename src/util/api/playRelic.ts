import { mutate } from "swr";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { PlayRelicHandler, UnplayRelicHandler } from "../model/playRelic";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function playRelic(gameId: string, event: PlayRelicEvent) {
  const data: GameUpdateData = {
    action: "PLAY_RELIC",
    event,
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new PlayRelicHandler(currentData, data);

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

export function unplayRelic(gameId: string, event: PlayRelicEvent) {
  const data: GameUpdateData = {
    action: "UNPLAY_RELIC",
    event,
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new UnplayRelicHandler(currentData, data);

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
