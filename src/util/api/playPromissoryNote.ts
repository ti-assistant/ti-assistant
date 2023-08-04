import { mutate } from "swr";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import {
  PlayPromissoryNoteHandler,
  UnplayPromissoryNoteHandler,
} from "../model/playPromissoryNote";

export function playPromissoryNote(
  gameId: string,
  card: string,
  target: string
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
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new PlayPromissoryNoteHandler(storedGameData, data);

        if (!handler.validate()) {
          return storedGameData;
        }

        const updates = handler.getUpdates();

        updateActionLog(storedGameData, handler);

        updateGameData(storedGameData, updates);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}

export function unplayPromissoryNote(
  gameId: string,
  card: string,
  target: string
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
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new UnplayPromissoryNoteHandler(storedGameData, data);

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
