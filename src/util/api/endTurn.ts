import { EndTurnHandler } from "../model/endTurn";
import dataUpdate from "./dataUpdate";

export function endTurn(gameId: string, samePlayer?: boolean) {
  const data: GameUpdateData = {
    action: "END_TURN",
    event: {
      samePlayer,
    },
  };

  return dataUpdate(gameId, data, EndTurnHandler);
}
