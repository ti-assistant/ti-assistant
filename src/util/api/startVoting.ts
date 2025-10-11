import { StartVotingHandler } from "../model/startVoting";
import dataUpdate from "./dataUpdate";

export function startVoting(gameId: string) {
  const data: GameUpdateData = {
    action: "START_VOTING",
    event: {},
  };

  return dataUpdate(gameId, data, StartVotingHandler);
}
