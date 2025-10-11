import { PlayRiderHandler, UnplayRiderHandler } from "../model/playRider";
import dataUpdate from "./dataUpdate";

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

  return dataUpdate(gameId, data, PlayRiderHandler);
}

export function unplayRider(gameId: string, rider: string) {
  const data: GameUpdateData = {
    action: "UNPLAY_RIDER",
    event: {
      rider,
    },
  };

  return dataUpdate(gameId, data, UnplayRiderHandler);
}
