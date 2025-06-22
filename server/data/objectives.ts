import { IntlShape } from "react-intl";
import getBaseObjectives from "./base/objectives";
import getCodexFourObjectives from "./codexfour/objectives";
import getProphecyOfKingsObjectives from "./prophecyofkings/objectives";

export function getObjectives(
  intl: IntlShape
): Record<ObjectiveId, BaseObjective> {
  return {
    ...getBaseObjectives(intl),
    ...getProphecyOfKingsObjectives(intl),
    ...getCodexFourObjectives(intl),
  };
}
