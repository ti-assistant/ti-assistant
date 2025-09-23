import { IntlShape } from "react-intl";

export default function getThundersEdgeLeaders(
  intl: IntlShape
): Record<ThundersEdge.LeaderId, BaseLeader> {
  return {
    "Kan Kip Rel": {
      description: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Kan Kip Rel.Description",
        description: "Description for Ral Nel Agent: Kan Kip Rel",
        defaultMessage:
          "ACTION: Exhaust this card to draw 2 action cards; give 1 of those cards to another player.",
      }),
      expansion: "THUNDERS EDGE",
      faction: "Ral Nel Consortium",
      id: "Kan Kip Rel",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Leaders.Kan Kip Rel.Name",
        description: "Name of Ral Nel Agent: Kan Kip Rel",
        defaultMessage: "Kan Kip Rel",
      }),
      timing: "COMPONENT_ACTION",
      type: "AGENT",
    },
  };
}
