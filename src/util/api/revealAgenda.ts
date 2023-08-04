import { mutate } from "swr";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { HideAgendaHandler, RevealAgendaHandler } from "../model/revealAgenda";

export function revealAgenda(gameId: string, agenda: string) {
  const data: GameUpdateData = {
    action: "REVEAL_AGENDA",
    event: {
      agenda,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new RevealAgendaHandler(storedGameData, data);

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

export function hideAgenda(gameId: string, agenda: string, veto?: boolean) {
  const data: GameUpdateData = {
    action: "HIDE_AGENDA",
    event: {
      agenda,
      veto,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new HideAgendaHandler(storedGameData, data);

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
