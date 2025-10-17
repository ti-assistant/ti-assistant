import { PurgeTechHandler, UnpurgeTechHandler } from "../model/purgeTech";
import dataUpdate from "./dataUpdate";

export function purgeTech(
  gameId: string,
  techId: TechId,
  factionId?: FactionId
) {
  const data: GameUpdateData = {
    action: "PURGE_TECH",
    event: {
      techId,
      factionId,
    },
  };

  return dataUpdate(gameId, data, PurgeTechHandler);
}

export function unpurgeTech(
  gameId: string,
  techId: TechId,
  factionId?: FactionId
) {
  const data: GameUpdateData = {
    action: "UNPURGE_TECH",
    event: {
      techId,
      factionId,
    },
  };

  return dataUpdate(gameId, data, UnpurgeTechHandler);
}
