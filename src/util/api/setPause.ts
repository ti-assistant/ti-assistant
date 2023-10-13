import { mutate } from "swr";
import { poster } from "./util";
import { BASE_GAME_DATA } from "../../../server/data/data";

interface SetPauseData {
  paused: boolean;
}

export function setGlobalPause(gameId: string, paused: boolean) {
  const data: SetPauseData = {
    paused,
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/setPause`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        currentData.state.paused = paused;

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}
