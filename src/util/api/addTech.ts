import { AddTechHandler, RemoveTechHandler } from "../model/addTech";
import dataUpdate from "./dataUpdate";

export function addTech(
  gameId: string,
  faction: FactionId,
  techId: TechId,
  additionalFactions?: FactionId[],
  researchAgreement?: boolean,
  shareKnowledge?: boolean
) {
  const data: GameUpdateData = {
    action: "ADD_TECH",
    event: {
      faction,
      additionalFactions,
      tech: techId,
      researchAgreement,
      shareKnowledge,
    },
  };

  return dataUpdate(gameId, data, AddTechHandler);
}

export function removeTech(
  gameId: string,
  faction: FactionId,
  techId: TechId,
  additionalFactions?: FactionId[]
) {
  const data: GameUpdateData = {
    action: "REMOVE_TECH",
    event: {
      faction,
      tech: techId,
      additionalFactions,
    },
  };

  return dataUpdate(gameId, data, RemoveTechHandler);
}
