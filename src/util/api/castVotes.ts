import { mutate } from "swr";
import { updateGameData, updateActionLog } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";
import { CastVotesHandler } from "../model/castVotes";

export function castVotes(
  gameId: string,
  faction: string,
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
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new CastVotesHandler(storedGameData, data);

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
