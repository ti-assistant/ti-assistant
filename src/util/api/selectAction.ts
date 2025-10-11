import {
  SelectActionHandler,
  UnselectActionHandler,
} from "../model/selectAction";
import dataUpdate from "./dataUpdate";

export function selectAction(gameId: string, action: Action) {
  const data: GameUpdateData = {
    action: "SELECT_ACTION",
    event: {
      action,
    },
  };

  return dataUpdate(gameId, data, SelectActionHandler);
}

export function unselectAction(gameId: string, action: Action) {
  const data: GameUpdateData = {
    action: "UNSELECT_ACTION",
    event: {
      action,
    },
  };

  return dataUpdate(gameId, data, UnselectActionHandler);
}
