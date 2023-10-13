import { mutate } from "swr";
import { poster } from "./util";
import { AddTechHandler, RemoveTechHandler } from "../model/addTech";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function addTech(gameId: string, faction: FactionId, techId: TechId) {
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new AddTechHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        updateGameData(currentData, handler.getUpdates());

        updateActionLog(currentData, handler);

        console.log("Tech Added", faction);
        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}

export function removeTech(gameId: string, faction: FactionId, techId: TechId) {
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new RemoveTechHandler(currentData, data);

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
