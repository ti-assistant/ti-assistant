import { SelectFactionHandler } from "../model/selectFaction";
import dataUpdate from "./dataUpdate";

export function selectFaction(gameId: string, faction: FactionId | "None") {
  const data: GameUpdateData = {
    action: "SELECT_FACTION",
    event: {
      faction,
    },
  };

  return dataUpdate(gameId, data, SelectFactionHandler);
}
