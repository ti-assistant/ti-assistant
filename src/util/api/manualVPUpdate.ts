import { mutate } from "swr";
import { updateGameData, updateActionLog } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { ManualVPUpdateHandler } from "../model/manualVPUpdate";

export function manualVPUpdate(gameId: string, faction: string, vps: number) {
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
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new ManualVPUpdateHandler(storedGameData, data);

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
