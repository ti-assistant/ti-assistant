import { ChooseSubFactionHandler } from "../model/chooseSubFaction";
import dataUpdate from "./dataUpdate";

export function chooseSubFaction(
  gameId: string,
  faction: "Council Keleres",
  subFaction: SubFaction
) {
  const data: GameUpdateData = {
    action: "CHOOSE_SUB_FACTION",
    event: {
      faction,
      subFaction,
    },
  };

  return dataUpdate(gameId, data, ChooseSubFactionHandler);
}
