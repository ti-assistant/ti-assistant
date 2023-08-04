import { mutate } from "swr";
import { AdvancePhaseHandler } from "../model/advancePhase";
import { updateGameData, updateActionLog } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";

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
      optimisticData: (storedGameData: StoredGameData) => {
        data.event.factions = storedGameData.factions;
        data.event.state = storedGameData.state;
        data.event.strategycards = storedGameData.strategycards ?? {};

        const handler = new AdvancePhaseHandler(storedGameData, data);

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
