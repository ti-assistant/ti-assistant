import { DataStore } from "../../context/dataStore";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "../model/claimPlanet";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { poster } from "./util";

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

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new ClaimPlanetHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
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

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/dataUpdate`, data, now);

  DataStore.update((storedGameData) => {
    const handler = new UnclaimPlanetHandler(storedGameData, data);

    if (!handler.validate()) {
      return storedGameData;
    }

    // Requires looking at action log.
    updateGameData(storedGameData, handler.getUpdates());
    const gameTimer = storedGameData.timers?.game;
    updateActionLog(storedGameData, handler, now, gameTimer ?? 0);

    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
