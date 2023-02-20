import { mutate } from "swr";
import { Expansion } from "./options";
import { GameTech } from "./techs";
import { poster } from "./util";

export type FactionUpdateAction =
  | "ADD_TECH"
  | "REMOVE_TECH"
  | "CHOOSE_STARTING_TECH"
  | "REMOVE_STARTING_TECH"
  | "CHOOSE_SUB_FACTION"
  | "PASS"
  | "READY_ALL"
  | "MANUAL_VP_ADJUST"
  | "UPDATE_CAST_VOTES"
  | "RESET_CAST_VOTES";

export type SubFaction = "Argent Flight" | "Mentak Coalition" | "Xxcha Kingdom";

export interface FactionUpdateData {
  action?: FactionUpdateAction;
  faction?: string;
  factions?: Record<string, { votes: number }>;
  planet?: string;
  planets?: string[];
  ready?: boolean;
  subFaction?: SubFaction;
  tech?: string;
  timestamp?: number;
  vps?: number;
}

export interface StartsWith {
  planets?: string[];
  techs?: string[];
  units: Record<string, number>;
  faction?: SubFaction;
  choice?: {
    options: string[];
    select: number;
  };
  planetchoice?: {
    options: SubFaction[];
  };
}

export interface BaseFaction {
  colors: Record<string, number>;
  commodities: number;
  game: Expansion;
  name: string;
  shortname: string;
  startswith: StartsWith;
}

export interface GameFaction {
  color: string;
  commander: string;
  hero: string;
  mapPosition: number;
  name: string;
  order: number;
  planets: Record<string, { ready: boolean }>;
  playerName?: string;
  startswith: StartsWith;
  techs: Record<string, GameTech>;
  castVotes?: number;
  passed?: boolean;
  votes?: number;
  vps?: number;
}

export type Faction = BaseFaction & GameFaction;

export async function passFaction(
  gameId: string,
  factionName: string
): Promise<any> {
  const data: FactionUpdateData = {
    action: "PASS",
    faction: factionName,
  };

  return mutate(
    `/api/${gameId}/factions`,
    async () => await poster(`/api/${gameId}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        const faction = updatedFactions[factionName];

        if (!faction) {
          return updatedFactions;
        }

        faction.passed = true;

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export function readyAllFactions(gameId: string) {
  const data: FactionUpdateData = {
    action: "READY_ALL",
  };

  mutate(
    `/api/${gameId}/factions`,
    async () => await poster(`/api/${gameId}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        for (const faction of Object.values(updatedFactions)) {
          faction.passed = false;
        }

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export function manualVPUpdate(
  gameId: string,
  factionName: string,
  value: number
) {
  const data: FactionUpdateData = {
    action: "MANUAL_VP_ADJUST",
    faction: factionName,
    vps: value,
  };

  mutate(
    `/api/${gameId}/factions`,
    async () => await poster(`/api/${gameId}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        const faction = updatedFactions[factionName];

        if (!faction) {
          return updatedFactions;
        }

        faction.vps = (faction.vps ?? 0) + value;

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export function updateCastVotes(gameId: string, subStateFactions = {}) {
  const data: FactionUpdateData = {
    action: "UPDATE_CAST_VOTES",
    factions: subStateFactions,
  };

  mutate(
    `/api/${gameId}/factions`,
    async () => await poster(`/api/${gameId}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        for (const [factionName, votes] of Object.entries(subStateFactions)) {
          const faction = updatedFactions[factionName];

          if (!faction) {
            continue;
          }

          if (!faction.castVotes) {
            faction.castVotes = 0;
          }

          faction.castVotes += votes as number;
        }

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export function resetCastVotes(gameId: string) {
  const data: FactionUpdateData = {
    action: "RESET_CAST_VOTES",
  };

  mutate(
    `/api/${gameId}/factions`,
    async () => await poster(`/api/${gameId}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        for (const faction of Object.values(updatedFactions)) {
          faction.castVotes = 0;
        }

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}

export function chooseSubFaction(
  gameId: string,
  factionName: string,
  subFactionName: SubFaction
) {
  const data: FactionUpdateData = {
    action: "CHOOSE_SUB_FACTION",
    faction: factionName,
    subFaction: subFactionName,
  };

  mutate(
    `/api/${gameId}/factions`,
    async () => await poster(`/api/${gameId}/factionUpdate`, data),
    {
      optimisticData: (factions: Record<string, Faction>) => {
        const updatedFactions = structuredClone(factions);

        const faction = updatedFactions[factionName];

        if (!faction) {
          return updatedFactions;
        }

        if (!faction.startswith) {
          faction.startswith = {
            planets: [],
            techs: [],
            units: {},
          };
        }

        faction.startswith.faction = subFactionName;

        switch (subFactionName) {
          case "Argent Flight":
            faction.startswith.planets = ["Avar", "Valk", "Ylir"];
            break;
          case "Mentak Coalition":
            faction.startswith.planets = ["Moll Primus"];
            break;
          case "Xxcha Kingdom":
            faction.startswith.planets = ["Archon Ren", "Archon Tau"];
            break;
        }

        return updatedFactions;
      },
      revalidate: false,
    }
  );
}
