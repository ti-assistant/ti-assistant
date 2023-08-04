import { mutate } from "swr";
import { poster, StoredGameData } from "./util";

export interface SetPauseData {
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
      optimisticData: (storedGameData: StoredGameData) => {
        storedGameData.state.paused = paused;

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}
