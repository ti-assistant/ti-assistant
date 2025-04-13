import { Optional } from "../util/types/types";
import { useGameDataValue } from "./dataHooks";

export type Objectives = Partial<Record<ObjectiveId, Objective>>;

export function useObjectives() {
  return useGameDataValue<Objectives>("objectives", {});
}

export function useObjective(objectiveId: ObjectiveId) {
  return useGameDataValue<Optional<Objective>>(
    `objectives.${objectiveId}`,
    undefined
  );
}
