import { mutate } from "swr";
import { updateGameData, updateActionLog } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { GiftOfPrescienceHandler } from "../model/giftOfPrescience";

export function giftOfPrescience(gameId: string, faction: string) {
  const data: GameUpdateData = {
    action: "GIFT_OF_PRESCIENCE",
    event: {
      faction,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new GiftOfPrescienceHandler(storedGameData, data);

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
