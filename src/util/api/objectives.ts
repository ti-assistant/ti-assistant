import { mutate } from "swr";
import { poster } from "./util";

import { Expansion } from "./options";

export type ObjectiveType = "stage-one" | "stage-two" | "secret" | "other";

export type ObjectiveUpdateAction =
  | "REVEAL_OBJECTIVE"
  | "REMOVE_OBJECTIVE"
  | "SCORE_OBJECTIVE"
  | "UNSCORE_OBJECTIVE"
  | "CHANGE_OBJECTIVE_TYPE";

export interface ObjectiveUpdateData {
  action?: ObjectiveUpdateAction;
  faction?: string;
  objective?: string;
  timestamp?: number;
  type?: ObjectiveType;
}

export interface BaseObjective {
  description: string;
  game: string;
  name: string;
  points: number;
  type: ObjectiveType;
  // Optional
  max?: number;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  phase?: string;
  repeatable?: boolean;
  replaces?: string;
}

export interface GameObjective {
  factions?: string[];
  scorers?: string[];
  selected?: boolean;
}

export type Objective = BaseObjective & GameObjective;

export function revealObjective(
  gameId: string,
  factionName: string | undefined,
  objectiveName: string
) {
  const data: ObjectiveUpdateData = {
    action: "REVEAL_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(
    `/api/${gameId}/objectives`,
    async () => await poster(`/api/${gameId}/objectiveUpdate`, data),
    {
      optimisticData: (objectives: Record<string, Objective>) => {
        const updatedObjectives = structuredClone(objectives);

        const objective = updatedObjectives[objectiveName];

        if (!objective) {
          return updatedObjectives;
        }

        objective.selected = true;
        if (objective.type === "secret" && factionName) {
          if (!objective.factions) {
            objective.factions = [];
          }
          objective.factions.push(factionName);
        }

        return updatedObjectives;
      },
      revalidate: false,
    }
  );
}

export function removeObjective(
  gameId: string,
  factionName: string,
  objectiveName: string
) {
  const data: ObjectiveUpdateData = {
    action: "REMOVE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(
    `/api/${gameId}/objectives`,
    async () => await poster(`/api/${gameId}/objectiveUpdate`, data),
    {
      optimisticData: (objectives: Record<string, Objective>) => {
        const updatedObjectives = structuredClone(objectives);

        const objective = updatedObjectives[objectiveName];

        if (!objective) {
          return updatedObjectives;
        }

        objective.selected = false;
        if (objective.type === "secret") {
          objective.factions = (objective.factions ?? []).filter(
            (faction) => faction !== factionName
          );
        }

        return updatedObjectives;
      },
      revalidate: false,
    }
  );
}

export function scoreObjective(
  gameId: string,
  factionName: string,
  objectiveName: string
) {
  const data: ObjectiveUpdateData = {
    action: "SCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(
    `/api/${gameId}/objectives`,
    async () => await poster(`/api/${gameId}/objectiveUpdate`, data),
    {
      optimisticData: (objectives: Record<string, Objective>) => {
        const updatedObjectives = structuredClone(objectives);

        const objective = updatedObjectives[objectiveName];

        if (!objective) {
          return updatedObjectives;
        }

        objective.scorers = [...(objective.scorers ?? []), factionName];

        return updatedObjectives;
      },
      revalidate: false,
    }
  );
}

export function unscoreObjective(
  gameId: string,
  factionName: string,
  objectiveName: string
) {
  const data: ObjectiveUpdateData = {
    action: "UNSCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(
    `/api/${gameId}/objectives`,
    async () => await poster(`/api/${gameId}/objectiveUpdate`, data),
    {
      optimisticData: (objectives: Record<string, Objective>) => {
        const updatedObjectives = structuredClone(objectives);

        const objective = updatedObjectives[objectiveName];

        if (!objective || !objective.scorers) {
          return updatedObjectives;
        }

        const factionIndex = objective.scorers.lastIndexOf(factionName);
        if (factionIndex !== -1) {
          objective.scorers.splice(factionIndex, 1);
        }

        return updatedObjectives;
      },
      revalidate: false,
    }
  );
}

export function changeObjectiveType(
  gameId: string,
  objectiveName: string,
  type: ObjectiveType
) {
  const data: ObjectiveUpdateData = {
    action: "CHANGE_OBJECTIVE_TYPE",
    objective: objectiveName,
    type: type,
  };

  mutate(
    `/api/${gameId}/objectives`,
    async () => await poster(`/api/${gameId}/objectiveUpdate`, data),
    {
      optimisticData: (objectives: Record<string, Objective>) => {
        const updatedObjectives = structuredClone(objectives);

        const objective = updatedObjectives[objectiveName];

        if (!objective) {
          return updatedObjectives;
        }
        objective.type = type;

        return updatedObjectives;
      },
      revalidate: false,
    }
  );
}
