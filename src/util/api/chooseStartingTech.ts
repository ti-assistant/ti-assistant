import {
  ChooseStartingTechHandler,
  RemoveStartingTechHandler,
} from "../model/chooseStartingTech";
import dataUpdate from "./dataUpdate";

export function chooseStartingTech(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const data: GameUpdateData = {
    action: "CHOOSE_STARTING_TECH",
    event: {
      faction,
      tech: techId,
    },
  };

  return dataUpdate(gameId, data, ChooseStartingTechHandler);
}

export function removeStartingTech(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const data: GameUpdateData = {
    action: "REMOVE_STARTING_TECH",
    event: {
      faction,
      tech: techId,
    },
  };

  return dataUpdate(gameId, data, RemoveStartingTechHandler);
}
