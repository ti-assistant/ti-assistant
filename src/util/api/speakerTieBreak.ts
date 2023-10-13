import { mutate } from "swr";
import { poster } from "./util";
import { SpeakerTieBreakHandler } from "../model/speakerTieBreak";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function speakerTieBreak(gameId: string, tieBreak: string) {
  const data: GameUpdateData = {
    action: "SPEAKER_TIE_BREAK",
    event: {
      tieBreak,
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
        const handler = new SpeakerTieBreakHandler(currentData, data);

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
