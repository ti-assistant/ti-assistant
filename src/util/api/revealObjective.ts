import {
  HideObjectiveHandler,
  RevealObjectiveHandler,
} from "../model/revealObjective";
import dataUpdate from "./dataUpdate";

export function revealObjective(gameId: string, objective: ObjectiveId) {
  const data: GameUpdateData = {
    action: "REVEAL_OBJECTIVE",
    event: {
      objective,
    },
  };

  return dataUpdate(gameId, data, RevealObjectiveHandler);
}

export function hideObjective(gameId: string, objective: ObjectiveId) {
  const data: GameUpdateData = {
    action: "HIDE_OBJECTIVE",
    event: {
      objective,
    },
  };

  return dataUpdate(gameId, data, HideObjectiveHandler);
}
