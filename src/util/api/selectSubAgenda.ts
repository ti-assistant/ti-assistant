import { mutate } from "swr";
import { poster } from "./util";
import { SelectSubAgendaHandler } from "../model/selectSubAgenda";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function selectSubAgenda(gameId: string, subAgenda: AgendaId | "None") {
  const data: GameUpdateData = {
    action: "SELECT_SUB_AGENDA",
    event: {
      subAgenda,
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
        const handler = new SelectSubAgendaHandler(currentData, data);

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
