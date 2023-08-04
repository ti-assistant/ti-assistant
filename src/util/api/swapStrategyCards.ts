import { mutate } from "swr";
import { updateGameData, updateActionLog } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { SwapStrategyCardsHandler } from "../model/swapStrategyCards";

export function swapStrategyCards(
  gameId: string,
  cardOne: string,
  cardTwo: string,
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
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new SwapStrategyCardsHandler(storedGameData, data);

        if (!handler.validate()) {
          return storedGameData;
        }

        updateGameData(storedGameData, handler.getUpdates());

        updateActionLog(storedGameData, handler);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}
