import { mutate } from "swr";
import { poster } from "./util";
import {
  PlayPromissoryNoteHandler,
  UnplayPromissoryNoteHandler,
} from "../model/playPromissoryNote";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function playPromissoryNote(
  gameId: string,
  card: string,
  target: FactionId
) {
  const data: GameUpdateData = {
    action: "PLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
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
        const handler = new PlayPromissoryNoteHandler(currentData, data);

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

export function unplayPromissoryNote(
  gameId: string,
  card: string,
  target: FactionId
) {
  const data: GameUpdateData = {
    action: "UNPLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
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
        const handler = new UnplayPromissoryNoteHandler(currentData, data);

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
