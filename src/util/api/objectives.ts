import { mutate } from "swr";
import { poster } from "./util";

import { Expansion } from "./options";
import { Phase } from "./state";
import { Planet } from "./planets";
import { Agenda } from "./agendas";
import { Tech } from "./techs";

export type ObjectiveType = "STAGE ONE" | "STAGE TWO" | "SECRET" | "OTHER";

export type ObjectiveUpdateAction =
  | "REVEAL_OBJECTIVE"
  | "REMOVE_OBJECTIVE"
  | "TAKE_OBJECTIVE"
  | "SCORE_OBJECTIVE"
  | "UNSCORE_OBJECTIVE"
  | "CHANGE_OBJECTIVE_TYPE"
  | "CHANGE_OBJECTIVE_POINTS";

export interface ObjectiveUpdateData {
  action?: ObjectiveUpdateAction;
  faction?: string;
  prevFaction?: string;
  key?: string;
  objective?: string;
  timestamp?: number;
  type?: ObjectiveType;
  points?: number;
}

export interface BaseObjective {
  description: string;
  expansion: Expansion;
  name: string;
  points: number;
  type: ObjectiveType;
  // Optional
  max?: number;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  phase?: Phase;
  repeatable?: boolean;
  replaces?: string;
}

export interface GameObjective {
  factions?: string[];
  scorers?: string[];
  selected?: boolean;
  keyedScorers?: Record<string, string[]>;
  revealOrder?: number;
  points?: number;
}

export type Objective = BaseObjective & GameObjective;

export function hasScoredObjective(factionName: string, objective: Objective) {
  return (objective.scorers ?? []).includes(factionName);
}

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

        const maxOrder = Object.values(objectives).reduce((maxOrder, obj) => {
          return Math.max(maxOrder, obj.revealOrder ?? 0);
        }, 0);

        objective.selected = true;
        objective.revealOrder = maxOrder + 1;
        if (objective.type === "SECRET" && factionName) {
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
  factionName: string | undefined,
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

        delete objective.selected;
        delete objective.revealOrder;
        if (objective.type === "SECRET") {
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
  objectiveName: string,
  key?: string
) {
  const data: ObjectiveUpdateData = {
    action: "SCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
    key: key,
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

        if (key) {
          const updatedScorers = objective.keyedScorers ?? {};
          updatedScorers[key] = [...(updatedScorers[key] ?? []), factionName];
          objective.keyedScorers = updatedScorers;
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
  objectiveName: string,
  key?: string
) {
  const data: ObjectiveUpdateData = {
    action: "UNSCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
    key: key,
  };

  return mutate(
    `/api/${gameId}/objectives`,
    async () => await poster(`/api/${gameId}/objectiveUpdate`, data),
    {
      optimisticData: (objectives: Record<string, Objective>) => {
        const updatedObjectives = structuredClone(objectives);

        const objective = updatedObjectives[objectiveName];

        if (!objective || !objective.scorers) {
          return updatedObjectives;
        }

        if (key && objective.keyedScorers) {
          const updatedScorers = objective.keyedScorers[key];
          if (updatedScorers) {
            const keyedIndex = updatedScorers.lastIndexOf(factionName);
            if (keyedIndex !== -1) {
              updatedScorers.splice(keyedIndex, 1);
              objective.keyedScorers[key] = updatedScorers;
            }
          }
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

export function takeObjective(
  gameId: string,
  objectiveName: string,
  factionName: string,
  prevFaction: string,
  key?: string
) {
  const data: ObjectiveUpdateData = {
    action: "TAKE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
    prevFaction: prevFaction,
    key: key,
  };

  return mutate(
    `/api/${gameId}/objectives`,
    async () => await poster(`/api/${gameId}/objectiveUpdate`, data),
    {
      optimisticData: (objectives: Record<string, Objective>) => {
        const updatedObjectives = structuredClone(objectives);

        const objective = updatedObjectives[objectiveName];

        console.log(objectiveName);
        if (!objective || !objective.scorers) {
          return updatedObjectives;
        }

        console.log("Taking");
        if (key && objective.keyedScorers) {
          console.log("Up");
          const updatedScorers = objective.keyedScorers[key];
          if (updatedScorers) {
            const keyedIndex = updatedScorers.lastIndexOf(prevFaction);
            if (keyedIndex !== -1) {
              updatedScorers[keyedIndex] = factionName;
              objective.keyedScorers[key] = updatedScorers;
            } else {
              updatedScorers.push(factionName);
              objective.keyedScorers[key] = updatedScorers;
            }
          }
        }

        const factionIndex = objective.scorers.lastIndexOf(prevFaction);
        if (factionIndex !== -1) {
          objective.scorers[factionIndex] = factionName;
        } else {
          objective.scorers.push(factionName);
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

export function changeObjectivePoints(
  gameId: string,
  objectiveName: string,
  points: number
) {
  const data: ObjectiveUpdateData = {
    action: "CHANGE_OBJECTIVE_POINTS",
    objective: objectiveName,
    points: points,
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
        objective.points = points;

        return updatedObjectives;
      },
      revalidate: false,
    }
  );
}
