import { DataStore } from "../../context/dataStore";
import { CastVotesHandler } from "../model/castVotes";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function castVotes(
  gameId: string,
  faction: FactionId,
  votes: number,
  extraVotes: number,
  target?: string
) {
  const data: GameUpdateData = {
    action: "CAST_VOTES",
    event: {
      faction,
      votes,
      extraVotes,
      target,
    },
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new CastVotesHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);
    updateGameData(storedGameData, handler.getUpdates());

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
