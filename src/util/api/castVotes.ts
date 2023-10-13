import { mutate } from "swr";
import { poster } from "./util";
import { CastVotesHandler } from "../model/castVotes";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

export function castVotes(
  gameId: string,
  faction: FactionId,
  votes: number,
  target?: string
) {
  const data: GameUpdateData = {
    action: "CAST_VOTES",
    event: {
      faction,
      votes,
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
        const handler = new CastVotesHandler(currentData, data);

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
