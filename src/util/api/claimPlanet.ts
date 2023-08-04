import { mutate } from "swr";
import { buildPlanets } from "../../data/GameData";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "../model/claimPlanet";
import { updateActionLog, updateGameData } from "./data";
import { GameUpdateData } from "./state";
import { poster, StoredGameData } from "./util";

export function claimPlanet(gameId: string, faction: string, planet: string) {
  const data: GameUpdateData = {
    action: "CLAIM_PLANET",
    event: {
      faction,
      planet,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const planets = buildPlanets(storedGameData);
        const planet = planets[data.event.planet];
        if (planet && planet.owner) {
          data.event.prevOwner = planet.owner;
        }

        const handler = new ClaimPlanetHandler(storedGameData, data);

        if (!handler.validate()) {
          return storedGameData;
        }

        updateGameData(storedGameData, handler.getUpdates());

        updateActionLog(storedGameData, handler);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}

export function unclaimPlanet(gameId: string, faction: string, planet: string) {
  const data: GameUpdateData = {
    action: "UNCLAIM_PLANET",
    event: {
      faction,
      planet,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const handler = new UnclaimPlanetHandler(storedGameData, data);

        if (!handler.validate()) {
          return storedGameData;
        }

        updateGameData(storedGameData, handler.getUpdates());

        updateActionLog(storedGameData, handler);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}
