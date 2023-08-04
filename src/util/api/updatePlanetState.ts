import { mutate } from "swr";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import {
  PlanetState,
  UpdatePlanetStateHandler,
} from "../model/updatePlanetState";

export function updatePlanetState(
  gameId: string,
  planet: string,
  state: PlanetState
) {
  const data: GameUpdateData = {
    action: "UPDATE_PLANET_STATE",
    event: {
      planet,
      state,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new UpdatePlanetStateHandler(storedGameData, data);

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
