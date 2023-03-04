import { mutate } from "swr";
import { Expansion } from "./options";
import { poster } from "./util";

export type PlanetAttribute =
  | "legendary"
  | "red-skip"
  | "yellow-skip"
  | "blue-skip"
  | "green-skip"
  | "demilitarized"
  | "tomb"
  | "space-cannon"
  | "all-types";

export type PlanetType =
  | "Industrial"
  | "Cultural"
  | "Hazardous"
  | "all"
  | "none";

export type PlanetUpdateAction =
  | "ADD_PLANET"
  | "REMOVE_PLANET"
  | "ADD_ATTACHMENT"
  | "REMOVE_ATTACHMENT";

export interface PlanetUpdateData {
  action?: PlanetUpdateAction;
  attachment?: string;
  faction?: string;
  planet?: string;
  timestamp?: number;
}

export interface BasePlanet {
  expansion: Expansion;
  ability?: string;
  attributes: PlanetAttribute[];
  faction?: string;
  home: boolean;
  influence: number;
  locked?: boolean;
  name: string;
  resources: number;
  system?: number;
  type: PlanetType;
}

export interface GamePlanet {
  owner?: string;
  ready?: boolean;
  attachments?: string[];
}

export type Planet = BasePlanet & GamePlanet;

export function claimPlanet(
  gameId: string,
  planet: string,
  factionName: string
) {
  const data: PlanetUpdateData = {
    action: "ADD_PLANET",
    faction: factionName,
    planet: planet,
  };

  mutate(
    `/api/${gameId}/planets`,
    async () => await poster(`/api/${gameId}/planetUpdate`, data),
    {
      optimisticData: (planets: Record<string, Planet>) => {
        const updatedPlanets = structuredClone(planets);

        const updatedPlanet = updatedPlanets[planet];

        if (!updatedPlanet) {
          return updatedPlanets;
        }

        updatedPlanet.owner = factionName;

        updatedPlanets[planet] = updatedPlanet;

        return updatedPlanets;
      },
      revalidate: false,
    }
  );
}

export function unclaimPlanet(
  gameId: string,
  planet: string,
  factionName: string
) {
  const data: PlanetUpdateData = {
    action: "REMOVE_PLANET",
    faction: factionName,
    planet: planet,
  };

  mutate(
    `/api/${gameId}/planets`,
    async () => await poster(`/api/${gameId}/planetUpdate`, data),
    {
      optimisticData: (planets: Record<string, Planet>) => {
        const updatedPlanets = structuredClone(planets);

        const updatedPlanet = updatedPlanets[planet];

        if (!updatedPlanet) {
          return updatedPlanets;
        }

        delete updatedPlanet.owner;

        updatedPlanets[planet] = updatedPlanet;

        return updatedPlanets;
      },
      revalidate: false,
    }
  );
}

export function addAttachment(
  gameId: string,
  planetName: string,
  attachmentName: string
) {
  const data: PlanetUpdateData = {
    action: "ADD_ATTACHMENT",
    attachment: attachmentName,
    planet: planetName,
  };

  mutate(
    `/api/${gameId}/planets`,
    async () => await poster(`/api/${gameId}/planetUpdate`, data),
    {
      optimisticData: (planets: Record<string, Planet>) => {
        const updatedPlanets = structuredClone(planets);

        const planet = updatedPlanets[planetName];

        if (!planet) {
          return updatedPlanets;
        }

        // Remove attachment from other planets.
        for (const planet of Object.values(updatedPlanets)) {
          planet.attachments = planet.attachments?.filter(
            (attachment) => attachment !== attachmentName
          );
        }

        // Add attachment to planet.
        if (!planet.attachments) {
          planet.attachments = [];
        }
        planet.attachments.push(attachmentName);

        return updatedPlanets;
      },
      revalidate: false,
    }
  );
}

export function removeAttachment(
  gameId: string,
  planetName: string,
  attachmentName: string
) {
  const data: PlanetUpdateData = {
    action: "REMOVE_ATTACHMENT",
    attachment: attachmentName,
    planet: planetName,
  };

  mutate(
    `/api/${gameId}/planets`,
    async () => await poster(`/api/${gameId}/planetUpdate`, data),
    {
      optimisticData: (planets: Record<string, Planet>) => {
        const updatedPlanets = structuredClone(planets);

        const planet = updatedPlanets[planetName];

        if (!planet) {
          return updatedPlanets;
        }

        // Add attachment to planet.
        planet.attachments = planet.attachments?.filter(
          (attachment) => attachment !== attachmentName
        );
        // const planetAttachments = [...((planets[planetName] ?? {}).attachments ?? [])];
        // updatedPlanets[planetName].attachments = planetAttachments.filter((attachment) => attachment !== attachmentName);

        return updatedPlanets;
      },
      revalidate: false,
    }
  );
}
