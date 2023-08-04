import { mutate } from "swr";
import { GameUpdateData } from "./state";
import { StoredGameData, poster } from "./util";
import { AddTechHandler, RemoveTechHandler } from "../model/addTech";
import { updateGameData, updateActionLog } from "./data";

export function addTech(gameId: string, faction: string, tech: string) {
  const techId = tech.replace(/\//g, "").replace(/\./g, "").replace(" Ω", "");
  const data: GameUpdateData = {
    action: "ADD_TECH",
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
        const handler = new AddTechHandler(storedGameData, data);

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

export function removeTech(gameId: string, faction: string, tech: string) {
  const techId = tech.replace(/\//g, "").replace(/\./g, "").replace(" Ω", "");
  const data: GameUpdateData = {
    action: "REMOVE_TECH",
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
        const handler = new RemoveTechHandler(storedGameData, data);

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
