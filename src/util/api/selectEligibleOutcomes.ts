import { SelectEligibleOutcomesHandler } from "../model/selectEligibleOutcomes";
import dataUpdate from "./dataUpdate";

export function selectEligibleOutcomes(
  gameId: string,
  outcomes: OutcomeType | "None"
) {
  const data: GameUpdateData = {
    action: "SELECT_ELIGIBLE_OUTCOMES",
    event: {
      outcomes,
    },
  };

  return dataUpdate(gameId, data, SelectEligibleOutcomesHandler);
}
