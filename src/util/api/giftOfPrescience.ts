import { mutate } from "swr";
import { poster } from "./util";
import { GiftOfPrescienceHandler } from "../model/giftOfPrescience";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function giftOfPrescience(gameId: string, faction: FactionId) {
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new GiftOfPrescienceHandler(currentData, data);

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
