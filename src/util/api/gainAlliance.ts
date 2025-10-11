import {
  GainAllianceHandler,
  LoseAllianceHandler,
} from "../model/gainAlliance";
import dataUpdate from "./dataUpdate";

export function gainAlliance(
  gameId: string,
  faction: FactionId,
  fromFaction: FactionId
) {
  const data: GameUpdateData = {
    action: "GAIN_ALLIANCE",
    event: {
      faction,
      fromFaction,
    },
  };

  return dataUpdate(gameId, data, GainAllianceHandler);
}

export function loseAlliance(
  gameId: string,
  faction: FactionId,
  fromFaction: FactionId
) {
  const data: GameUpdateData = {
    action: "LOSE_ALLIANCE",
    event: {
      faction,
      fromFaction,
    },
  };

  return dataUpdate(gameId, data, LoseAllianceHandler);
}
