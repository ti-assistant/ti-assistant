import { IntlShape } from "react-intl";

export default function getThundersEdgeObjectives(
  intl: IntlShape,
): Record<ThundersEdge.ObjectiveId, BaseObjective> {
  return {
    Styx: {
      description: intl.formatMessage(
        {
          id: "Planets.Styx.Ability",
          description: "Planet Ability for Styx",
          defaultMessage:
            "When you gain this card, gain 1 victory point.{br}When you lose this card, lose 1 victory point.",
        },
        { br: "\n\n" },
      ),
      expansion: "THUNDERS EDGE",
      id: "Styx",
      name: intl.formatMessage({
        id: "Planets.Styx.Name",
        description: "Name of Planet: Styx",
        defaultMessage: "Styx",
      }),
      points: 1,
      type: "OTHER",
    },
    "The Silver Flame": {
      description: intl.formatMessage(
        {
          id: "Relics.The Silver Flame.Description",
          description: "Description for Relic: The Silver Flame",
          defaultMessage:
            "The Silver Flame may be exchanged as part of a transaction.{br}ACTION: Roll 1 die and purge this card; if the result is a 10, gain 1 victory point. Otherwise, purge your home system and all units in it; you cannot score public objectives. Put The Fracture into play if it is not already.",
        },
        { br: "\n\n" },
      ),
      expansion: "THUNDERS EDGE",
      id: "The Silver Flame",
      name: intl.formatMessage({
        id: "Relics.The Silver Flame.Title",
        description: "Title of Relic: The Silver Flame",
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
        id: "Events.Zealous Orthodoxy.Title",
        description: "Title of Event: Zealous Orthodoxy",
        defaultMessage: "Zealous Orthodoxy",
      }),
      phase: "STATUS",
      points: 1,
      type: "OTHER",
    },
  };
}
