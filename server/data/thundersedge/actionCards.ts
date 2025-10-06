import { IntlShape } from "react-intl";

export default function getThundersEdgeActionCards(
  intl: IntlShape
): Record<ThundersEdge.ActionCardId, BaseActionCard> {
  return {
    Overrule: {
      count: 1,
      description: intl.formatMessage(
        {
          id: "Action Cards.Overrule.Description",
          defaultMessage:
            "ACTION: Perform the primary ability of a readied or unchosen strategy card.",
          description: "Description of action card: Overrule",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      id: "Overrule",
      name: intl.formatMessage({
        id: "Action Cards.Overrule.Name",
        defaultMessage: "Overrule",
        description: "Name of action card: Overrule",
      }),
      timing: "COMPONENT_ACTION",
    },
  };
}
