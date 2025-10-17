import { EndTurnHandler } from "../model/endTurn";
import dataUpdate from "./dataUpdate";

export function endTurn(
  gameId: string,
  samePlayer?: boolean,
  jumpToPlayer?: FactionId
) {
  const data: GameUpdateData = {
    action: "END_TURN",
    event: {
      samePlayer,
      jumpToPlayer,
    },
  };

  return dataUpdate(gameId, data, EndTurnHandler);
}
