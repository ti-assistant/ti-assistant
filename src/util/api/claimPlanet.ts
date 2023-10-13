import { mutate } from "swr";
import { buildPlanets } from "../../data/GameData";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "../model/claimPlanet";
import { poster } from "./util";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";

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

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const planets = buildPlanets(currentData);
        const planet = planets[data.event.planet];
        if (planet && planet.owner) {
          data.event.prevOwner = planet.owner;
        }

        const handler = new ClaimPlanetHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        updateGameData(currentData, handler.getUpdates());

        updateActionLog(currentData, handler);

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
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

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const handler = new UnclaimPlanetHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        updateGameData(currentData, handler.getUpdates());

        updateActionLog(currentData, handler);

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}
