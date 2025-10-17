import { EndTurnHandler } from "../model/endTurn";
import { UnpassHandler } from "../model/unpass";
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

export function unpass(gameId: string, factionId: FactionId) {
  const data: GameUpdateData = {
    action: "UNPASS",
    event: {
      factionId,
    },
  };

  return dataUpdate(gameId, data, UnpassHandler);
}
