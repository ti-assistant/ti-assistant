import { AdvancePhaseHandler } from "../model/advancePhase";
import dataUpdate from "./dataUpdate";

export function advancePhase(gameId: string, skipAgenda: boolean = false) {
  const data: GameUpdateData = {
    action: "ADVANCE_PHASE",
    event: {
      skipAgenda,
    },
  };

  return dataUpdate(gameId, data, AdvancePhaseHandler);
}
