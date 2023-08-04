import { mutate } from "swr";
import { GameUpdateData } from "./state";
import { StoredGameData, poster } from "./util";
import { updateGameData, updateActionLog } from "./data";
import { ChooseSubFactionHandler } from "../model/chooseSubFaction";

export function chooseSubFaction(
  gameId: string,
  faction: string,
  subFaction: string
) {
  const data: GameUpdateData = {
    action: "CHOOSE_SUB_FACTION",
    event: {
      faction,
      subFaction,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new ChooseSubFactionHandler(storedGameData, data);

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
