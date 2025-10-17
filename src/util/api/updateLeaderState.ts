import { UpdateLeaderStateHandler } from "../model/updateLeaderState";
import dataUpdate from "./dataUpdate";

export function updateLeaderState(
  gameId: string,
  leaderId: LeaderId,
  state: LeaderState
) {
  const data: GameUpdateData = {
    action: "UPDATE_LEADER_STATE",
    event: {
      leaderId,
      state,
    },
  };

  return dataUpdate(gameId, data, UpdateLeaderStateHandler);
}
