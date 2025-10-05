import DataManager from "../../context/DataManager";
import TimerManager from "../../context/TimerManager";
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

  DataManager.update((storedGameData) => {
    const handler = new CastVotesHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    const gameTimer = TimerManager.getValue<number>("game");
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);
    updateGameData(storedGameData, handler.getUpdates());

    storedGameData.lastUpdate = now;

    return storedGameData;
  });
  TimerManager.update((timers) => {
    timers.paused = false;
    return timers;
  });

  return updatePromise.catch((_) => {
    DataManager.reset();
  });
}
