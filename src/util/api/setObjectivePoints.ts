import { SetObjectivePointsHandler } from "../model/setObjectivePoints";
import dataUpdate from "./dataUpdate";

export function setObjectivePoints(
  gameId: string,
  objective: string,
  points: number
) {
  const data: GameUpdateData = {
    action: "SET_OBJECTIVE_POINTS",
    event: {
      objective,
      points,
    },
  };

  return dataUpdate(gameId, data, SetObjectivePointsHandler);
}
