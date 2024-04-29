import { mutate } from "swr";
import { poster } from "./util";
import { UpdateLeaderStateHandler } from "../model/updateLeaderState";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { buildComponents, buildLeaders } from "../../data/GameData";
import { createIntlCache, createIntl } from "react-intl";

export function updateLeaderState(
  gameId: string,
  leaderId: LeaderId,
  state: LeaderState
) {
  const data: GameUpdateData = {
    action: "UPDATE_LEADER_STATE",
    event: {
      leaderId,
      state,
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
        // Translations not needed, so just create an english one.

        const leader = (currentData.leaders ?? {})[data.event.leaderId];
        if (leader) {
          data.event.prevState = leader.state;
        }

        const handler = new UpdateLeaderStateHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        const updates = handler.getUpdates();

        updateActionLog(currentData, handler);

        updateGameData(currentData, updates);

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}
