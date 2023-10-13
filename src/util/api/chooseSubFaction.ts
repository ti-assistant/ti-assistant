import { mutate } from "swr";
import { poster } from "./util";
import { ChooseSubFactionHandler } from "../model/chooseSubFaction";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function chooseSubFaction(
  gameId: string,
  faction: "Council Keleres",
  subFaction: SubFaction
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new ChooseSubFactionHandler(currentData, data);

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
