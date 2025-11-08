import { getLogEntries } from "../util/actionLog";
import { ActionLog, Optional } from "../util/types/types";
import { objectEntries } from "../util/util";
import { useGameDataValue, useMemoizedGameDataValue } from "./dataHooks";

export type Objectives = Partial<Record<ObjectiveId, Objective>>;

export function useObjectives() {
  return useGameDataValue<Objectives>("objectives", {});
}

export function useObjectivesOfType(type: ObjectiveType) {
  return useMemoizedGameDataValue<Objectives, Objectives>(
    "objectives",
    {},
    (objectives) => {
      const results: Objectives = {};
      for (const [objectiveId, objective] of objectEntries(objectives)) {
        if (objective.type === type) {
          results[objectiveId] = objective;
        }
      }
      return results;
    }
  );
}

export function useObjective(objectiveId: ObjectiveId) {
  return useGameDataValue<Optional<Objective>>(
    `objectives.${objectiveId}`,
    undefined
  );
}

export function useObjectiveRevealOrder() {
  return useMemoizedGameDataValue<
    ActionLog,
    Partial<Record<ObjectiveId, number>>
  >("actionLog", {}, (actionLog) => {
    const revealOrder: Partial<Record<ObjectiveId, number>> = {};
    let order = 1;
    getLogEntries<RevealObjectiveData>(
      [...actionLog].reverse(),
      "REVEAL_OBJECTIVE"
    ).forEach((logEntry) => {
      const objectiveId = logEntry.data.event.objective;
      revealOrder[objectiveId] = order;
      ++order;
    });
    return revealOrder;
  });
}
