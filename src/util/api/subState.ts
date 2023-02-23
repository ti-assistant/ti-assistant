import { mutate } from "swr";
import { repealAgenda } from "./agendas";
import { assignStrategyCard, StrategyCardName } from "./cards";
import { revealObjective, scoreObjective } from "./objectives";
import { claimPlanet } from "./planets";
import { setSpeaker } from "./state";
import { lockTech, unlockTech } from "./techs";
import { poster } from "./util";

export type SubStateUpdateAction =
  | "CLEAR_SUB_STATE"
  | "SET_ACTION"
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
  | "SET_OTHER_FIELD"
  | "FINALIZE_SUB_STATE";

export interface SubStateUpdateData {
  action?: SubStateUpdateAction;
  actionName?: string;
  agendaName?: string;
  cardName?: StrategyCardName;
  factionName?: string;
  fieldName?: string;
  numVotes?: number;
  objectiveName?: string;
  planetName?: string;
  target?: string;
  techName?: string;
  timestamp?: number;
  value?: any;
}

export interface SubStateFaction {
  objectives: string[];
  planets: string[];
  removeTechs: string[];
  target?: string;
  techs: string[];
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
  strategyCards?: {
    cardName: StrategyCardName;
    factionName: string;
  }[];
  [key: string]: any;
}

function createEmptySubStateFaction(): SubStateFaction {
  return {
    objectives: [],
    planets: [],
    removeTechs: [],
    techs: [],
  };
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
        return {};
      },
      revalidate: false,
    }
  );
}

export function setSubStateSelectedAction(gameid: string, actionName: string) {
  const data: SubStateUpdateData = {
    action: "SET_ACTION",
    actionName: actionName,
  };

  mutate(
    `/api/${gameid}/subState`,
    async () => await poster(`/api/${gameid}/subStateUpdate`, data),
    {
      optimisticData: (subState: SubState) => {
        return {
          selectedAction: actionName,
        };
      },
      revalidate: false,
    }
  );
}

export function setSubStateSpeaker(gameid: string, factionName: string) {
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

        updatedSubState.speaker = factionName;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function undoSubStateSpeaker(gameid: string) {
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

        if (!updatedSubState.factions) {
          updatedSubState.factions = {};
        }
        if (!updatedSubState.factions[factionName]) {
          updatedSubState.factions[factionName] = createEmptySubStateFaction();
        }

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        updatedSubState.factions[factionName]?.techs.push(techString);

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
          !updatedSubState.factions ||
          !updatedSubState.factions[factionName]
        ) {
          return updatedSubState;
        }

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        const updatedFaction = updatedSubState.factions[factionName];
        if (!updatedFaction) {
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

        if (!updatedSubState.factions) {
          updatedSubState.factions = {};
        }
        if (!updatedSubState.factions[factionName]) {
          updatedSubState.factions[factionName] = createEmptySubStateFaction();
        }

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        updatedSubState.factions[factionName]?.removeTechs.push(techString);

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
          !updatedSubState.factions ||
          !updatedSubState.factions[factionName]
        ) {
          return updatedSubState;
        }

        const techString = techName
          .replace(/\//g, "")
          .replace(/\./g, "")
          .replace(" Ω", "");

        const updatedFaction = updatedSubState.factions[factionName];
        if (!updatedFaction) {
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

        if (!updatedSubState.factions) {
          updatedSubState.factions = {};
        }
        if (!updatedSubState.factions[factionName]) {
          updatedSubState.factions[factionName] = createEmptySubStateFaction();
        }

        updatedSubState.factions[factionName]?.planets.push(planetName);

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
          !updatedSubState.factions ||
          !updatedSubState.factions[factionName]
        ) {
          return updatedSubState;
        }

        const updatedFaction = updatedSubState.factions[factionName];
        if (!updatedFaction) {
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

        if (!updatedSubState.factions) {
          updatedSubState.factions = {};
        }
        if (!updatedSubState.factions[factionName]) {
          updatedSubState.factions[factionName] = createEmptySubStateFaction();
        }

        updatedSubState.factions[factionName]?.objectives.push(objectiveName);

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

        if (
          !updatedSubState.factions ||
          !updatedSubState.factions[factionName]
        ) {
          return updatedSubState;
        }

        const updatedFaction = updatedSubState.factions[factionName];
        if (!updatedFaction) {
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
  target: string,
  numVotes: number
) {
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
        if (!updatedSubState.factions[factionName]) {
          updatedSubState.factions[factionName] = createEmptySubStateFaction();
        }

        const updatedFaction = updatedSubState.factions[factionName];
        if (!updatedFaction) {
          return updatedSubState;
        }

        updatedFaction.votes = numVotes;
        updatedFaction.target = target;

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function revealSubStateObjective(gameid: string, objectiveName: string) {
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

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function repealSubStateAgenda(gameid: string, agendaName: string) {
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
  cardName: StrategyCardName,
  factionName: string
) {
  const data: SubStateUpdateData = {
    action: "PICK_STRATEGY_CARD",
    cardName: cardName,
    factionName: factionName,
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

        updatedSubState.strategyCards.push({
          cardName: cardName,
          factionName: factionName,
        });

        return updatedSubState;
      },
      revalidate: false,
    }
  );
}

export function undoSubStateStrategyCard(gameid: string) {
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

export function setSubStateOther(
  gameid: string,
  fieldName: string,
  value: any
) {
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

export function finalizeSubState(gameid: string, subState: SubState) {
  const data: SubStateUpdateData = {
    action: "FINALIZE_SUB_STATE",
  };

  if (subState.speaker) {
    setSpeaker(gameid, subState.speaker);
  }

  if (subState.component) {
    // TODO: Handle compoents.
  }

  if (subState.repealedAgenda) {
    repealAgenda(gameid, subState.repealedAgenda);
  }

  for (const objectiveName of subState.objectives ?? []) {
    revealObjective(gameid, undefined, objectiveName);
  }

  for (const strategyCard of subState.strategyCards ?? []) {
    assignStrategyCard(gameid, strategyCard.cardName, strategyCard.factionName);
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
    for (const objectiveName of updates.objectives ?? []) {
      scoreObjective(gameid, factionName, objectiveName);
    }
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
