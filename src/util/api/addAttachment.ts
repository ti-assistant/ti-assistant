import { mutate } from "swr";
import { buildPlanets } from "../../data/GameData";
import {
  AddAttachmentHandler,
  RemoveAttachmentHandler,
} from "../model/addAttachment";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { StoredGameData, poster } from "./util";

// TODO: Determine whether planet treatment is necessary.
export function addAttachment(
  gameId: string,
  planet: string,
  attachment: string
) {
  const data: GameUpdateData = {
    action: "ADD_ATTACHMENT",
    event: {
      attachment,
      planet,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const planets = buildPlanets(storedGameData);
        for (const [planetId, planet] of Object.entries(planets)) {
          if ((planet.attachments ?? []).includes(data.event.attachment)) {
            data.event.prevPlanet = planetId;
            break;
          }
        }

        const handler = new AddAttachmentHandler(storedGameData, data);

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

export function removeAttachment(
  gameId: string,
  planet: string,
  attachment: string
) {
  const data: GameUpdateData = {
    action: "REMOVE_ATTACHMENT",
    event: {
      attachment,
      planet,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new RemoveAttachmentHandler(storedGameData, data);

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
