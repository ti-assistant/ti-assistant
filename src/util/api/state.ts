import { mutate } from "swr";
import { getOnDeckFaction, getPreviousFaction } from "../helpers";
import { StrategyCard } from "./cards";
import { Faction } from "./factions";
import { SubState } from "./subState";
import { poster } from "./util";

export type Phase =
  | "SETUP"
  | "STRATEGY"
  | "ACTION"
  | "STATUS"
  | "AGENDA"
  | "END";

export type StateUpdateAction =
  | "ADVANCE_PHASE"
  | "START_NEXT_ROUND"
  | "JUMP_TO_PLAYER"
  | "ADVANCE_PLAYER"
  | "PREVIOUS_PLAYER"
  | "SET_SPEAKER"
  | "END_GAME"
  | "CONTINUE_GAME"
  | "SET_AGENDA_NUM"
  | "ANCIENT_BURIAL_SITES" // Probably a better way to do this...
  | "SET_GLOBAL_PAUSE";

export interface StateUpdateData {
  action?: StateUpdateAction;
  agendaNum?: number;
  factionName?: string;
  paused?: boolean;
  skipAgenda?: boolean;
  speaker?: string;
  timestamp?: number;
}

export interface GameState {
  activeplayer?: string;
  ancientBurialSites?: string;
  agendaNum?: number;
  agendaUnlocked?: boolean;
  finalPhase?: Phase;
  paused?: boolean;
  phase: Phase;
  round: number;
  speaker: string;
}

export function setSpeaker(gameid: string, speaker: string) {
  const data: StateUpdateData = {
    action: "SET_SPEAKER",
    speaker: speaker,
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        if (
          state.phase === "STRATEGY" &&
          state.speaker === state.activeplayer
        ) {
          updatedState.activeplayer = speaker;
        }

        updatedState.speaker = speaker;

        return updatedState;
      },
      revalidate: false,
    }
  );

  // TODO: Consider whether there's a better option.
  // Maybe split the backend changes to have separate updates?
  mutate(
    `/api/${gameid}/factions`,
    (factions: Record<string, Faction>) => {
      const updatedFactions = structuredClone(factions);

      const speakerFaction = factions[speaker];

      if (!speakerFaction) {
        return updatedFactions;
      }

      const currentOrder = speakerFaction.order ?? 1;

      const numFactions = Object.keys(factions).length;

      for (const name of Object.keys(factions)) {
        const updatedFaction = updatedFactions[name];
        if (!updatedFaction) {
          continue;
        }
        let factionOrder = updatedFaction.order - currentOrder + 1;
        if (factionOrder < 1) {
          factionOrder += numFactions;
        }
        updatedFaction.order = factionOrder;
      }

      return updatedFactions;
    },
    {
      revalidate: false,
    }
  );
}

export function jumpToPlayer(gameid: string, factionName: string) {
  setGlobalPause(gameid, false);

  const data: StateUpdateData = {
    action: "JUMP_TO_PLAYER",
    factionName: factionName,
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        return {
          ...structuredClone(state),
          activeplayer: factionName,
        };
      },
      revalidate: false,
    }
  );
}

export async function nextPlayer(
  gameid: string,
  factions: Record<string, Faction>,
  strategyCards: Record<string, StrategyCard>,
  subState: SubState
) {
  setGlobalPause(gameid, false);

  const data: StateUpdateData = {
    action: "ADVANCE_PLAYER",
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const onDeckFaction = getOnDeckFaction(
          state,
          factions,
          strategyCards,
          subState
        );
        return {
          ...structuredClone(state),
          activeplayer: onDeckFaction ? onDeckFaction.name : "None",
        };
      },
      revalidate: false,
    }
  );
}

export async function prevPlayer(
  gameid: string,
  factions: Record<string, Faction>,
  subState: SubState
) {
  setGlobalPause(gameid, false);

  const data: StateUpdateData = {
    action: "PREVIOUS_PLAYER",
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const prevFaction = getPreviousFaction(state, factions, subState);

        return {
          ...structuredClone(state),
          activeplayer: prevFaction ? prevFaction.name : "None",
        };
      },
      revalidate: false,
    }
  );
}

export async function finishGame(gameid: string) {
  const data: StateUpdateData = {
    action: "END_GAME",
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.phase = "END";

        return updatedState;
      },
      revalidate: false,
    }
  );
}

export async function continueGame(gameid: string) {
  setGlobalPause(gameid, false);

  const data: StateUpdateData = {
    action: "CONTINUE_GAME",
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.phase = state.finalPhase ?? "STATUS";
        delete updatedState.finalPhase;

        return updatedState;
      },
      revalidate: false,
    }
  );
}

export function setAgendaNum(gameid: string, agendaNum: number) {
  const data: StateUpdateData = {
    action: "SET_AGENDA_NUM",
    agendaNum: agendaNum,
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.agendaNum = agendaNum;

        return updatedState;
      },
      revalidate: false,
    }
  );
}

export function ancientBurialSites(
  gameid: string,
  factionName: string | undefined
) {
  const data: StateUpdateData = {
    action: "ANCIENT_BURIAL_SITES",
    factionName: factionName,
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.ancientBurialSites = factionName;

        return updatedState;
      },
      revalidate: false,
    }
  );
}

export function setGlobalPause(gameid: string, paused: boolean) {
  const data: StateUpdateData = {
    action: "SET_GLOBAL_PAUSE",
    paused: paused,
  };

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.paused = paused;

        return updatedState;
      },
      revalidate: false,
    }
  );
}
