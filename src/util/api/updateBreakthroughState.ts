import { UpdateBreakthroughStateHandler } from "../model/updateBreakthroughState";
import dataUpdate from "./dataUpdate";

export function updateBreakthroughState(
  gameId: string,
  factionId: FactionId,
  state: ComponentState
) {
  const data: GameUpdateData = {
    action: "UPDATE_BREAKTHROUGH_STATE",
    event: {
      factionId,
      state,
    },
  };

  return dataUpdate(gameId, data, UpdateBreakthroughStateHandler);
}
