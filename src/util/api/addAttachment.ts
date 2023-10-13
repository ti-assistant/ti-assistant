import { mutate } from "swr";
import { buildPlanets } from "../../data/GameData";
import {
  AddAttachmentHandler,
  RemoveAttachmentHandler,
} from "../model/addAttachment";
import { poster } from "./util";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

// TODO: Determine whether planet treatment is necessary.
export function addAttachment(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const planets = buildPlanets(currentData);
        for (const planet of Object.values(planets)) {
          if ((planet.attachments ?? []).includes(data.event.attachment)) {
            data.event.prevPlanet = planet.id;
            break;
          }
        }

        const handler = new AddAttachmentHandler(currentData, data);

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

export function removeAttachment(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new RemoveAttachmentHandler(currentData, data);

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
