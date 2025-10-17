import {
  MarkPrimaryHandler,
  MarkSecondaryHandler,
} from "../model/markSecondary";
import dataUpdate from "./dataUpdate";

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
