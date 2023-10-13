import { mutate } from "swr";
import { AdvancePhaseHandler } from "../model/advancePhase";
import { poster } from "./util";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function advancePhase(gameId: string, skipAgenda: boolean = false) {
  const data: GameUpdateData = {
    action: "ADVANCE_PHASE",
    event: {
      skipAgenda,
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
        data.event.factions = currentData.factions;
        data.event.state = currentData.state;
        data.event.strategycards = currentData.strategycards ?? {};

        const handler = new AdvancePhaseHandler(currentData, data);

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
