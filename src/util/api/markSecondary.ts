import { DataStore } from "../../context/dataStore";
import {
  MarkPrimaryHandler,
  MarkSecondaryHandler,
} from "../model/markSecondary";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

export function markSecondary(
  gameId: string,
  faction: FactionId,
  state: Secondary
) {
  const data: GameUpdateData = {
    action: "MARK_SECONDARY",
    event: {
      faction,
      state,
    },
  };

  dataUpdate(gameId, data, MarkSecondaryHandler);
}

export function markPrimary(gameId: string, completed: boolean) {
  const data: GameUpdateData = {
    action: "MARK_PRIMARY",
    event: { completed },
  };

  dataUpdate(gameId, data, MarkPrimaryHandler);
}

function dataUpdate<
  DataType extends GameUpdateData,
  HandlerType extends IHandler<DataType>
>(gameId: string, data: DataType, handlerType: HandlerType) {
  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new handlerType(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    updateGameData(storedGameData, handler.getUpdates());
    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
