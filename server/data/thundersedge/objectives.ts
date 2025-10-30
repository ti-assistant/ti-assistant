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
    "The Silver Flame": {
      description: intl.formatMessage({
        id: "Objectives.The Silver Flame.Description",
        description: "Description for Objective: The Silver Flame",
        defaultMessage: "Roll a 10 when using The Silver Flame.",
      }),
      expansion: "THUNDERS EDGE",
      id: "The Silver Flame",
      name: intl.formatMessage({
        id: "Objectives.The Silver Flame.Title",
        description: "Title of Objective: The Silver Flame",
        defaultMessage: "The Silver Flame",
      }),
      points: 1,
      type: "OTHER",
    },
    "Zealous Orthodoxy": {
      description: intl.formatMessage({
        id: "Objectives.Zealous Orthodoxy.Description",
        description: "Description for Objective: Zealous Orthodoxy",
        defaultMessage:
          "The first player to score 2 secret objectives gains 1 victory point.",
      }),
      expansion: "THUNDERS EDGE",
      event: "Zealous Orthodoxy",
      id: "Zealous Orthodoxy",
      name: intl.formatMessage({
        id: "Objectives.Zealous Orthodoxy.Title",
        description: "Title of Objective: Zealous Orthodoxy",
        defaultMessage: "Zealous Orthodoxy",
      }),
      phase: "STATUS",
      points: 1,
      type: "OTHER",
    },
  };
}
