import { mutate } from "swr";
import { ComponentState, Timing } from "./components";
import { scoreObjective, unscoreObjective } from "./objectives";
import { Expansion } from "./options";
import { scoreSubStateObjective, unscoreSubStateObjective } from "./subState";
import { poster } from "./util";

export interface BaseRelic {
  description: string;
  expansion: Expansion;
  name: string;
  timing: Timing;
}

export interface GameRelic {
  owner?: string;
  state?: ComponentState;
}

export type Relic = BaseRelic & GameRelic;

export type RelicUpdateAction = "GAIN_RELIC" | "LOSE_RELIC" | "USE_RELIC";

export interface RelicUpdateData {
  action?: RelicUpdateAction;
  faction?: string;
  relic?: string;
  timestamp?: number;
}

export function gainRelic(gameId: string, relic: string, factionName: string) {
  const data: RelicUpdateData = {
    action: "GAIN_RELIC",
    faction: factionName,
    relic: relic,
  };

  switch (relic) {
    case "Shard of the Throne":
      scoreObjective(gameId, factionName, "Shard of the Throne");
      scoreSubStateObjective(gameId, factionName, "Shard of the Throne");
      break;
  }

  mutate(
    `/api/${gameId}/relics`,
    async () => await poster(`/api/${gameId}/relicUpdate`, data),
    {
      optimisticData: (relics: Record<string, Relic>) => {
        const updatedRelics = structuredClone(relics);

        const updatedRelic = updatedRelics[relic];

        if (!updatedRelic) {
          return updatedRelics;
        }

        updatedRelic.owner = factionName;

        updatedRelics[relic] = updatedRelic;

        return updatedRelics;
      },
      revalidate: false,
    }
  );
}

export function loseRelic(gameId: string, relic: string, factionName: string) {
  const data: RelicUpdateData = {
    action: "LOSE_RELIC",
    faction: factionName,
    relic: relic,
  };
  switch (relic) {
    case "Shard of the Throne":
      unscoreObjective(gameId, factionName, "Shard of the Throne");
      unscoreSubStateObjective(gameId, factionName, "Shard of the Throne");
      break;
  }

  mutate(
    `/api/${gameId}/relics`,
    async () => await poster(`/api/${gameId}/relicUpdate`, data),
    {
      optimisticData: (relics: Record<string, Relic>) => {
        const updatedRelics = structuredClone(relics);

        const updatedRelic = updatedRelics[relic];

        if (!updatedRelic) {
          return updatedRelics;
        }

        delete updatedRelic.owner;

        updatedRelics[relic] = updatedRelic;

        return updatedRelics;
      },
      revalidate: false,
    }
  );
}

export function useRelic(gameId: string, relic: string, factionName?: string) {
  const data: RelicUpdateData = {
    action: "USE_RELIC",
    faction: factionName,
    relic: relic,
  };

  mutate(
    `/api/${gameId}/relics`,
    async () => await poster(`/api/${gameId}/relicUpdate`, data),
    {
      optimisticData: (relics: Record<string, Relic>) => {
        const updatedRelics = structuredClone(relics);

        const updatedRelic = updatedRelics[relic];

        if (!updatedRelic) {
          return updatedRelics;
        }

        let relicState: ComponentState = "purged";
        switch (data.relic) {
          case "JR-X455-O":
          case "Scepter of Elempar":
          case "The Prophet's Tears":
            relicState = "exhausted";
            break;
          case "The Crown of Emphidia":
            relicState = "exhausted";
            break;
        }

        updatedRelics[relic] = updatedRelic;

        return updatedRelics;
      },
      revalidate: false,
    }
  );
}
