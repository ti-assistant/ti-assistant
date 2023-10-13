import { mutate } from "swr";
import { poster } from "./util";
import { ManualVPUpdateHandler } from "../model/manualVPUpdate";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function manualVPUpdate(
  gameId: string,
  faction: FactionId,
  vps: number
) {
  const data: GameUpdateData = {
    action: "MANUAL_VP_UPDATE",
    event: {
      faction,
      vps,
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
        const handler = new ManualVPUpdateHandler(currentData, data);

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
