import { IntlShape } from "react-intl";

export default function getTwilightsFallObjectives(
  intl: IntlShape,
): Record<TwilightsFall.ObjectiveId, BaseObjective> {
  return {
    Unravel: {
      description: intl.formatMessage(
        {
          id: "Action Cards.Unravel.Description",
          defaultMessage:
            "ACTION: Choose and purge a relic. If the relic belonged to another player, that player gains 1 victory point; if it belonged to you, put The Fracture into play and place 1 additional ingress token in a system that contains your units.",
          description: "Description of action card: Unravel",
        },
        { br: "\n\n" },
      ),
      expansion: "TWILIGHTS FALL",
      id: "Unravel",
      name: intl.formatMessage({
        id: "Action Cards.Unravel.Name",
        defaultMessage: "Unravel",
        description: "Name of action card: Unravel",
      }),
      points: 1,
      repeatable: true,
      type: "OTHER",
    },
  };
}
