import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "../model/scoreObjective";
import dataUpdate from "./dataUpdate";

export function scoreObjective(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const data: GameUpdateData = {
    action: "SCORE_OBJECTIVE",
    event: {
      faction,
      objective,
      key,
    },
  };

  return dataUpdate(gameId, data, ScoreObjectiveHandler);
}

export function unscoreObjective(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const data: GameUpdateData = {
    action: "UNSCORE_OBJECTIVE",
    event: {
      faction,
      objective,
      key,
    },
  };

  return dataUpdate(gameId, data, UnscoreObjectiveHandler);
}
