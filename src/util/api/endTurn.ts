import { mutate } from "swr";
import { getSelectedAction, updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { Secondary } from "./subState";
import { EndTurnHandler } from "../model/endTurn";

export function endTurn(gameId: string, samePlayer?: boolean) {
  const data: GameUpdateData = {
    action: "END_TURN",
    event: {
      samePlayer,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const selectedAction = getSelectedAction(storedGameData);
        data.event.prevFaction = storedGameData.state.activeplayer;
        if (!selectedAction) {
          return storedGameData;
        }
        data.event.selectedAction = selectedAction;
        const secondaries: Record<string, Secondary> = {};
        for (const faction of Object.values(storedGameData.factions)) {
          secondaries[faction.name] = faction.secondary ?? "PENDING";
        }
        data.event.secondaries = secondaries;

        const handler = new EndTurnHandler(storedGameData, data);

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
