import { ClaimPlanetHandler, UnclaimPlanetHandler } from "../model/claimPlanet";
import dataUpdate from "./dataUpdate";

export function claimPlanet(
  gameId: string,
  faction: FactionId,
  planet: PlanetId
) {
  const data: GameUpdateData = {
    action: "CLAIM_PLANET",
    event: {
      faction,
      planet,
    },
  };

  return dataUpdate(gameId, data, ClaimPlanetHandler);
}

export function unclaimPlanet(
  gameId: string,
  faction: FactionId,
  planet: PlanetId
) {
  const data: GameUpdateData = {
    action: "UNCLAIM_PLANET",
    event: {
      faction,
      planet,
    },
  };

  return dataUpdate(gameId, data, UnclaimPlanetHandler);
}
