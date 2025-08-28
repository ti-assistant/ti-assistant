import { IntlShape } from "react-intl";

export default function getThundersEdgeObjectives(
  intl: IntlShape
): Record<ThundersEdge.ObjectiveId, BaseObjective> {
  return {
    Styx: {
      description: intl.formatMessage({
        id: "Objectives.Styx.Description",
        description: "Description for Objective: Styx",
        defaultMessage:
          "Given to the player currently in control of the planet Styx.",
      }),
      expansion: "THUNDERS EDGE",
      id: "Styx",
      name: intl.formatMessage({
        id: "Objectives.Styx.Title",
        description: "Title of Objective: Styx",
        defaultMessage: "Styx",
      }),
      points: 1,
      type: "OTHER",
    },
  };
}
