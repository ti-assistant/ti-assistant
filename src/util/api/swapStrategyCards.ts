import { mutate } from "swr";
import { poster } from "./util";
import { SwapStrategyCardsHandler } from "../model/swapStrategyCards";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

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

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new SwapStrategyCardsHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        updateGameData(currentData, handler.getUpdates());

        updateActionLog(currentData, handler);

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}
