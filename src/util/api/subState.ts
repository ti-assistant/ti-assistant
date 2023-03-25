import { mutate } from "swr";
import { Agenda, repealAgenda } from "./agendas";
import {
  assignStrategyCard,
  setFirstStrategyCard,
  StrategyCard,
  StrategyCardName,
} from "./cards";
import {
  revealObjective,
  scoreObjective,
  unscoreObjective,
} from "./objectives";
import { claimPlanet } from "./planets";
import { setGlobalPause, setSpeaker } from "./state";
import { lockTech, unlockTech } from "./techs";
import { poster } from "./util";

export type Secondary = "PENDING" | "DONE" | "SKIPPED";

export type SubStateUpdateAction =
  | "CLEAR_SUB_STATE"
  | "SET_ACTION"
  | "SELECT_COMPONENT"
  | "SET_SPEAKER"
  | "UNDO_SPEAKER"
  | "ADD_TECH"
  | "CLEAR_ADDED_TECH"
  | "REMOVE_TECH"
  | "CLEAR_REMOVED_TECH"
  | "ADD_PLANET"
  | "REMOVE_PLANET"
  | "SCORE_OBJECTIVE"
  | "UNSCORE_OBJECTIVE"
  | "CAST_VOTES"
  | "REVEAL_OBJECTIVE"
  | "HIDE_OBJECTIVE"
  | "REVEAL_AGENDA"
  | "HIDE_AGENDA"
  | "REPEAL_AGENDA"
  | "REMOVE_REPEALED_AGENDA"
  | "PICK_STRATEGY_CARD"
  | "UNDO_STRATEGY_CARD"
  | "SWAP_STRATEGY_CARDS"
  | "PLAY_RIDER"
  | "UNDO_RIDER"
  | "MARK_SECONDARY"
  | "SET_OTHER_FIELD"
  | "FINALIZE_SUB_STATE";

export interface AssignStrategyCardEvent {
  assignedTo: string;
  name: StrategyCardName;
  pickedBy: string;
}

export type Action = StrategyCardName | "Tactical" | "Component" | "Pass";

export interface TurnData {
  selectedAction?: Action;
  factions?: Record<string, SubStateFaction>;
  speaker?: string;
  component?: {
    name: string;
    factions?: Record<string, SubStateFaction>;
  };
}

export interface SubStateUpdateData {
  action?: SubStateUpdateAction;
  actionName?: Action;
  agendaName?: string;
  cardEvent?: AssignStrategyCardEvent;
  cardName?: StrategyCardName;
  cardOneName?: StrategyCardName;
  cardTwoName?: StrategyCardName;
  componentName?: string;
  factionName?: string;
  fieldName?: string;
  numVotes?: number;
  objectiveName?: string;
  outcome?: string;
  planetName?: string;
  secondary?: Secondary;
  riderName?: string;
  target?: string;
  techName?: string;
  timestamp?: number;
  value?: any;
}

export interface SubStateFaction {
  secondary?: Secondary;
  objectives?: string[];
  planets?: string[];
  removeTechs?: string[];
  target?: string;
  techs?: string[];
  votes?: number;
}

export interface SubState {
  agenda?: string;
  speaker?: string;
  factions?: Record<string, SubStateFaction>;
  objectives?: string[];
  tieBreak?: string;
  outcome?: string;
  repealedAgenda?: string;
  subAgenda?: string;
  strategyCards?: AssignStrategyCardEvent[];
  turnData?: TurnData;
  riders?: Record<
    string,
    {
      factionName?: string;
      outcome?: string;
    }
  >;
  [key: string]: any;
}

function rewindTurnData(gameid: string, turnData: TurnData | undefined) {
  Object.entries(turnData?.factions ?? {}).forEach(([factionName, faction]) => {
    rewindSubStateFaction(gameid, factionName, faction);
  });
  Object.entries(turnData?.component?.factions ?? {}).forEach(
    ([factionName, faction]) => {
      rewindSubStateFaction(gameid, factionName, faction);
    }
  );
}

function rewindSubStateFaction(
  gameId: string,
  factionName: string,
  faction: SubStateFaction
) {
  // Objectives
  for (const objective of faction.objectives ?? []) {
    if (objective !== "Imperial Point") {
      unscoreObjective(gameId, factionName, objective);
    }
  }
}

export function clearSubState(gameid: string) {
  const data: SubStateUpdateData = {
    action: "CLEAR_SUB_STATE",
  };

  return mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        rewindTurnData(gameid, subState.turnData);
        return {};
      },
      revalidate: false,
    }
  );
}

export function setSubStateSelectedAction(gameid: string, actionName: Action) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "SET_ACTION",
    actionName: actionName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);
        rewindTurnData(gameid, subState.turnData);

        updatedSubState.turnData = {};

        updatedSubState.turnData.selectedAction = actionName;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function selectSubStateComponent(gameid: string, componentName: string) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "SELECT_COMPONENT",
    componentName: componentName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.turnData) {
          updatedSubState.turnData = {};
        }
        updatedSubState.turnData.component = {
          name: componentName,
        };

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function setSubStateSpeaker(gameid: string, factionName: string) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "SET_SPEAKER",
    factionName: factionName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.turnData) {
          updatedSubState.turnData = {};
        }

        updatedSubState.turnData.speaker = factionName;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function undoSubStateSpeaker(gameid: string) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "UNDO_SPEAKER",
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        delete updatedSubState.speaker;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function addSubStateTech(
  gameid: string,
  factionName: string,
  techName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "ADD_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.turnData) {
          updatedSubState.turnData = {};
        }
        if (!updatedSubState.turnData.factions) {
          updatedSubState.turnData.factions = {};
        }
        const faction = updatedSubState.turnData.factions[factionName] ?? {};

        if (!faction.techs) {
          faction.techs = [];
        }

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        faction.techs.push(techString);

        updatedSubState.turnData.factions[factionName] = faction;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function clearAddedSubStateTech(
  gameid: string,
  factionName: string,
  techName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "CLEAR_ADDED_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (
          !updatedSubState.turnData ||
          !updatedSubState.turnData.factions ||
          !updatedSubState.turnData.factions[factionName]
        ) {
          return updatedSubState;
        }

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        const updatedFaction = updatedSubState.turnData.factions[factionName];
        if (!updatedFaction || !updatedFaction.techs) {
          return updatedSubState;
        }

        updatedFaction.techs = updatedFaction.techs.filter(
          (tech) => tech !== techString
        );

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function removeSubStateTech(
  gameid: string,
  factionName: string,
  techName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "REMOVE_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.turnData) {
          updatedSubState.turnData = {};
        }

        if (!updatedSubState.turnData.factions) {
          updatedSubState.turnData.factions = {};
        }
        const faction = updatedSubState.turnData.factions[factionName] ?? {};

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        if (!faction.removeTechs) {
          faction.removeTechs = [];
        }

        faction.removeTechs.push(techString);

        updatedSubState.turnData.factions[factionName] = faction;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function clearRemovedSubStateTech(
  gameid: string,
  factionName: string,
  techName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "CLEAR_REMOVED_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (
          !updatedSubState.turnData ||
          !updatedSubState.turnData.factions ||
          !updatedSubState.turnData.factions[factionName]
        ) {
          return updatedSubState;
        }

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        const updatedFaction = updatedSubState.turnData.factions[factionName];
        if (!updatedFaction || !updatedFaction.removeTechs) {
          return updatedSubState;
        }

        updatedFaction.removeTechs = updatedFaction.removeTechs.filter(
          (tech) => tech !== techString
        );

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function addSubStatePlanet(
  gameid: string,
  factionName: string,
  planetName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "ADD_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.turnData) {
          updatedSubState.turnData = {};
        }
        if (!updatedSubState.turnData.factions) {
          updatedSubState.turnData.factions = {};
        }
        const faction = updatedSubState.turnData.factions[factionName] ?? {};

        if (!faction.planets) {
          faction.planets = [];
        }

        faction.planets.push(planetName);

        updatedSubState.turnData.factions[factionName] = faction;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function removeSubStatePlanet(
  gameid: string,
  factionName: string,
  planetName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "REMOVE_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (
          !updatedSubState.turnData ||
          !updatedSubState.turnData.factions ||
          !updatedSubState.turnData.factions[factionName]
        ) {
          return updatedSubState;
        }

        const updatedFaction = updatedSubState.turnData.factions[factionName];
        if (!updatedFaction || !updatedFaction.planets) {
          return updatedSubState;
        }

        updatedFaction.planets = updatedFaction.planets.filter(
          (planet) => planet !== planetName
        );

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function scoreSubStateObjective(
  gameid: string,
  factionName: string,
  objectiveName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "SCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.turnData) {
          updatedSubState.turnData = {};
        }
        if (!updatedSubState.turnData.factions) {
          updatedSubState.turnData.factions = {};
        }
        const faction = updatedSubState.turnData.factions[factionName] ?? {};

        if (!faction.objectives) {
          faction.objectives = [];
        }

        faction.objectives.push(objectiveName);

        updatedSubState.turnData.factions[factionName] = faction;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function unscoreSubStateObjective(
  gameid: string,
  factionName: string,
  objectiveName: string
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "UNSCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.turnData || !updatedSubState.turnData.factions) {
          return updatedSubState;
        }

        const updatedFaction = updatedSubState.turnData.factions[factionName];
        if (!updatedFaction || !updatedFaction.objectives) {
          return updatedSubState;
        }

        updatedFaction.objectives = updatedFaction.objectives.filter(
          (objective) => objective !== objectiveName
        );

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function castSubStateVotes(
  gameid: string,
  factionName: string,
  target: string | undefined,
  numVotes: number
) {
  setGlobalPause(gameid, false);

  const data: SubStateUpdateData = {
    action: "CAST_VOTES",
    factionName: factionName,
    target: target,
    numVotes: numVotes,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.factions) {
          updatedSubState.factions = {};
        }
        const faction = updatedSubState.factions[factionName] ?? {};

        if (!faction) {
          return updatedSubState;
        }

        faction.votes = numVotes;
        faction.target = target;

        updatedSubState.factions[factionName] = faction;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function revealSubStateObjective(gameid: string, objectiveName: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "REVEAL_OBJECTIVE",
    objectiveName: objectiveName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.objectives) {
          updatedSubState.objectives = [];
        }
        updatedSubState.objectives.push(objectiveName);

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function hideSubStateObjective(gameid: string, objectiveName: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "HIDE_OBJECTIVE",
    objectiveName: objectiveName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.objectives) {
          return updatedSubState;
        }

        updatedSubState.objectives = updatedSubState.objectives.filter(
          (objective) => objective !== objectiveName
        );

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function revealSubStateAgenda(gameid: string, agendaName: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "REVEAL_AGENDA",
    agendaName: agendaName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        updatedSubState.agenda = agendaName;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function hideSubStateAgenda(gameid: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "HIDE_AGENDA",
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        delete updatedSubState.agenda;
        delete updatedSubState.tieBreak;
        delete updatedSubState.outcome;
        delete updatedSubState.factions;
        delete updatedSubState.riders;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function repealSubStateAgenda(gameid: string, agendaName: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "REPEAL_AGENDA",
    agendaName: agendaName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        updatedSubState.repealedAgenda = agendaName;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function removeRepealedSubStateAgenda(gameid: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "REMOVE_REPEALED_AGENDA",
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        delete updatedSubState.repealedAgenda;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function pickSubStateStrategyCard(
  gameid: string,
  cardEvent: AssignStrategyCardEvent,
  numFactions: number
) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "PICK_STRATEGY_CARD",
    cardEvent: cardEvent,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.strategyCards) {
          updatedSubState.strategyCards = [];
        }

        const numPickedCards = updatedSubState.strategyCards.reduce(
          (count, card) => {
            if (card.assignedTo === cardEvent.assignedTo) {
              return count + 1;
            }
            return count;
          },
          0
        );
        if (numPickedCards > 0 && numFactions > 4) {
          return updatedSubState;
        }
        if (numPickedCards > 1) {
          return updatedSubState;
        }

        updatedSubState.strategyCards.push(cardEvent);

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function undoSubStateStrategyCard(gameid: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "UNDO_STRATEGY_CARD",
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        (updatedSubState.strategyCards ?? []).pop();

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function swapSubStateStrategyCards(
  gameid: string,
  cardOne: StrategyCard,
  cardTwo: StrategyCard
) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "SWAP_STRATEGY_CARDS",
    cardOneName: cardOne.name,
    cardTwoName: cardTwo.name,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        (updatedSubState.strategyCards ?? []).forEach((card) => {
          if (cardTwo.name && card.name === cardOne.name) {
            card.name = cardTwo.name;
          } else if (cardOne.name && card.name === cardTwo.name) {
            card.name = cardOne.name;
          }
        });

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function addSubStateRider(
  gameid: string,
  riderName: string,
  factionName: string | undefined,
  outcome: string | undefined
) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "PLAY_RIDER",
    riderName: riderName,
    factionName: factionName,
    outcome: outcome,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.riders) {
          updatedSubState.riders = {};
        }

        updatedSubState.riders[riderName] = {
          factionName: factionName,
          outcome: outcome,
        };

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function removeSubStateRider(gameid: string, riderName: string) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "UNDO_RIDER",
    riderName: riderName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState);

        if (!updatedSubState.riders) {
          return updatedSubState;
        }

        delete updatedSubState.riders[riderName];

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function markSecondary(
  gameid: string,
  factionName: string,
  secondary: Secondary
) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "MARK_SECONDARY",
    factionName: factionName,
    secondary: secondary,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState) ?? {};

        if (!updatedSubState.turnData) {
          updatedSubState.turnData = {};
        }
        if (!updatedSubState.turnData.factions) {
          updatedSubState.turnData.factions = {};
        }

        const updatedFaction =
          updatedSubState.turnData.factions[factionName] ?? {};

        updatedFaction.secondary = secondary;

        updatedSubState.turnData.factions[factionName] = updatedFaction;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function setSubStateOther(
  gameid: string,
  fieldName: string,
  value: any
) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "SET_OTHER_FIELD",
    fieldName: fieldName,
    value: value,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        const updatedSubState = structuredClone(subState) ?? {};

        updatedSubState[fieldName] = value;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function resolveRiders(
  gameid: string,
  subState: SubState,
  electedOutcome: string
) {
  setGlobalPause(gameid, false);
  for (const [riderName, rider] of Object.entries(subState.riders ?? {})) {
    if (!rider.outcome || !rider.factionName) {
      continue;
    }
    if (rider.outcome !== electedOutcome) {
      continue;
    }
    switch (riderName) {
      case "Politics Rider":
        setSpeaker(gameid, rider.factionName);
        break;
      case "Imperial Rider":
        scoreObjective(gameid, rider.factionName, "Imperial Rider");
        break;
    }
  }
}

export function finalizeSubState(gameid: string, subState: SubState) {
  setGlobalPause(gameid, false);
  const data: SubStateUpdateData = {
    action: "FINALIZE_SUB_STATE",
  };

  if (subState.turnData?.speaker) {
    setSpeaker(gameid, subState.turnData.speaker);
  }

  if (subState.component) {
    // TODO: Handle compoents.
  }

  // if (subState.repealedAgenda) {
  //   repealAgenda(gameid, subState.repealedAgenda);
  // }

  for (const objectiveName of subState.objectives ?? []) {
    revealObjective(gameid, undefined, objectiveName);
  }

  let firstCard = true;
  const gift = subState["Gift of Prescience"];
  for (const strategyCard of subState.strategyCards ?? []) {
    if (firstCard) {
      if (
        (gift && strategyCard.assignedTo === gift) ||
        (!gift && strategyCard.assignedTo === "Naalu Collective")
      ) {
        setFirstStrategyCard(gameid, strategyCard.name);
        firstCard = false;
      }
    }
    assignStrategyCard(gameid, strategyCard.name, strategyCard.assignedTo);
  }

  for (const [factionName, faction] of Object.entries(
    subState.turnData?.factions ?? {}
  )) {
    for (const techName of faction.techs ?? []) {
      if (techName === "IIHQ Modernization") {
        claimPlanet(gameid, "Custodia Vigilia", factionName);
      }
      unlockTech(gameid, factionName, techName);
    }
    // Locked techs
    for (const techName of faction.removeTechs ?? []) {
      lockTech(gameid, factionName, techName);
    }
    // Conquered planets
    for (let planetName of faction.planets ?? []) {
      planetName = planetName === "[0.0.0]" ? "000" : planetName;
      claimPlanet(gameid, planetName, factionName);
    }
  }

  for (const [factionName, updates] of Object.entries(
    subState.factions ?? {}
  )) {
    // Unlocked techs
    for (const techName of updates.techs ?? []) {
      if (techName === "IIHQ Modernization") {
        claimPlanet(gameid, "Custodia Vigilia", factionName);
      }
      unlockTech(gameid, factionName, techName);
    }
    // Locked techs
    for (const techName of updates.removeTechs ?? []) {
      lockTech(gameid, factionName, techName);
    }
    // Conquered planets
    for (let planetName of updates.planets ?? []) {
      planetName = planetName === "[0.0.0]" ? "000" : planetName;
      claimPlanet(gameid, planetName, factionName);
    }
    // Scored objectives
    // for (const objectiveName of updates.objectives ?? []) {
    //   scoreObjective(gameid, factionName, objectiveName);
    // }
  }

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        return {};
      },
      revalidate: false,
    }
  );
}
