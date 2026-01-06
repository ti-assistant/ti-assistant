import { ChooseSubFactionHandler } from "../model/chooseSubFaction";
import { ChooseTFFactionHandler } from "../model/chooseTFFaction";
import { Optional } from "../types/types";
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

export function chooseTFFaction(
  gameId: string,
  factionId: FactionId,
  subFaction: Optional<FactionId>,
  type: "Unit" | "Planet"
) {
  const data: GameUpdateData = {
    action: "CHOOSE_TF_FACTION",
    event: {
      factionId,
      subFaction,
      type,
    },
  };

  return dataUpdate(gameId, data, ChooseTFFactionHandler);
}
