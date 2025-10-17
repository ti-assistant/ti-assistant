import { UpdatePlanetStateHandler } from "../model/updatePlanetState";
import dataUpdate from "./dataUpdate";

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

  return dataUpdate(gameId, data, UpdatePlanetStateHandler);
}
