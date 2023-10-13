import { mutate } from "swr";
import { poster } from "./util";
import { UpdatePlanetStateHandler } from "../model/updatePlanetState";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function updatePlanetState(
  gameId: string,
  planet: PlanetId,
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new UpdatePlanetStateHandler(currentData, data);

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
