import { SwapStrategyCardsHandler } from "../model/swapStrategyCards";
import dataUpdate from "./dataUpdate";

export function swapStrategyCards(
  gameId: string,
  cardOne: StrategyCardId,
  cardTwo: StrategyCardId,
  imperialArbiter?: boolean
) {
  const data: GameUpdateData = {
    action: "SWAP_STRATEGY_CARDS",
    event: {
      cardOne,
      cardTwo,
      imperialArbiter,
    },
  };

  return dataUpdate(gameId, data, SwapStrategyCardsHandler);
}
