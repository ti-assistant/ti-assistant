import { PurgeSystemHandler, UnpurgeSystemHandler } from "../model/purgeSystem";
import dataUpdate from "./dataUpdate";

export function purgeSystem(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "PURGE_SYSTEM",
    event: {
      systemId,
    },
  };

  return dataUpdate(gameId, data, PurgeSystemHandler);
}

export function unpurgeSystem(gameId: string, systemId: SystemId) {
  const data: GameUpdateData = {
    action: "UNPURGE_SYSTEM",
    event: {
      systemId,
    },
  };

  return dataUpdate(gameId, data, UnpurgeSystemHandler);
}
