import { CastVotesHandler } from "../model/castVotes";
import dataUpdate from "./dataUpdate";

export function castVotes(
  gameId: string,
  faction: FactionId,
  votes: number,
  extraVotes: number,
  target?: string
) {
  const data: GameUpdateData = {
    action: "CAST_VOTES",
    event: {
      faction,
      votes,
      extraVotes,
      target,
    },
  };

  return dataUpdate(gameId, data, CastVotesHandler);
}
