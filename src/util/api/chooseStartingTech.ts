import { mutate } from "swr";
import { GameUpdateData } from "./state";
import { StoredGameData, poster } from "./util";
import { updateGameData, updateActionLog } from "./data";
import {
  ChooseStartingTechHandler,
  RemoveStartingTechHandler,
} from "../model/chooseStartingTech";

export function chooseStartingTech(
  gameId: string,
  faction: string,
  tech: string
) {
  const techId = tech.replace(/\//g, "").replace(/\./g, "").replace(" Ω", "");
  const data: GameUpdateData = {
    action: "CHOOSE_STARTING_TECH",
    event: {
      faction,
      tech: techId,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new ChooseStartingTechHandler(storedGameData, data);

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

export function removeStartingTech(
  gameId: string,
  faction: string,
  tech: string
) {
  const techId = tech.replace(/\//g, "").replace(/\./g, "").replace(" Ω", "");
  const data: GameUpdateData = {
    action: "REMOVE_STARTING_TECH",
    event: {
      faction,
      tech: techId,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new RemoveStartingTechHandler(storedGameData, data);

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
