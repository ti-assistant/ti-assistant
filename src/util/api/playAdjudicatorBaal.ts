import {
  PlayAdjudicatorBaalHandler,
  UndoAdjudicatorBaalHandler,
} from "../model/playAdjudicatorBaal";
import dataUpdate from "./dataUpdate";

export function playAdjudicatorBaal(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "PLAY_ADJUDICATOR_BAAL",
    event: {
      systemId,
    },
  };

  return dataUpdate(gameId, data, PlayAdjudicatorBaalHandler);
}

export function undoAdjudicatorBaal(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "UNDO_ADJUDICATOR_BAAL",
    event: {
      systemId,
    },
  };

  return dataUpdate(gameId, data, UndoAdjudicatorBaalHandler);
}
