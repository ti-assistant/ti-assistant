import { CommitToExpeditionHandler } from "../model/commitToExpedition";
import { Optional } from "../types/types";
import dataUpdate from "./dataUpdate";

export function commitToExpedition(
  gameId: string,
  expedition: keyof Expedition,
  factionId: Optional<FactionId>
) {
  const data: GameUpdateData = {
    action: "COMMIT_TO_EXPEDITION",
    event: {
      expedition,
      factionId,
    },
  };

  return dataUpdate(gameId, data, CommitToExpeditionHandler);
}
