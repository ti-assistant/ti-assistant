import { AssignStrategyCardHandler } from "../model/assignStrategyCard";
import dataUpdate from "./dataUpdate";

export function assignStrategyCard(
  gameId: string,
  assignedTo: FactionId,
  cardId: StrategyCardId,
  pickedBy: FactionId
) {
  const data: AssignStrategyCardData = {
    action: "ASSIGN_STRATEGY_CARD",
    event: {
      assignedTo,
      id: cardId,
      pickedBy,
    },
  };

  return dataUpdate(gameId, data, AssignStrategyCardHandler);
}
