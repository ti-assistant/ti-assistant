import { GainRelicHandler, LoseRelicHandler } from "../model/gainRelic";
import dataUpdate from "./dataUpdate";

export function gainRelic(
  gameId: string,
  faction: FactionId,
  relic: RelicId,
  planet?: PlanetId
) {
  const data: GameUpdateData = {
    action: "GAIN_RELIC",
    event: {
      faction,
      relic,
      planet,
    },
  };

  return dataUpdate(gameId, data, GainRelicHandler);
}

export function loseRelic(gameId: string, faction: FactionId, relic: RelicId) {
  const data: GameUpdateData = {
    action: "LOSE_RELIC",
    event: {
      faction,
      relic,
    },
  };

  return dataUpdate(gameId, data, LoseRelicHandler);
}
