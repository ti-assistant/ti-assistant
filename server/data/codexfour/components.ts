import { IntlShape } from "react-intl";

export default function getCodexFourComponents(
  intl: IntlShape
): Record<CodexFour.ComponentId, BaseComponent | BaseTechComponent> {
  return {
    "Age of Exploration": {
      description: intl.formatMessage({
        id: "Components.Age of Exploration.Description",
        description: "Description for Component: Age of Exploration",
        defaultMessage:
          "ACTION: Exhaust DARK ENERGY TAP and choose a non-home edge system that contains your ships to roll 1 die. On a result of 1-4, draw a random unused red tile; on a result of 5-10, draw a random unused blue tile. Place that tile adjacent to the chosen system so that it is touching at least 2 non-home systems. Place a frontier token in the system if it does not contain any planets.",
      }),
      expansion: "CODEX FOUR",
      event: "Age of Exploration",
      id: "Age of Exploration",
      name: intl.formatMessage({
        id: "Components.Age of Exploration.Title",
        description: "Title of Component: Age of Exploration",
        defaultMessage: "Age of Exploration",
      }),
      type: "EVENT",
    },
    "Total War": {
      description: intl.formatMessage({
        id: "Components.Total War.Description",
        description: "Description for Component: Total War",
        defaultMessage:
          "ACTION: Discard 10 commodities from planets in your home system to gain 1 victory point.",
      }),
      expansion: "CODEX FOUR",
      event: "Total War",
      id: "Total War",
      name: intl.formatMessage({
        id: "Components.Total War.Title",
        description: "Title of Component: Total War",
        defaultMessage: "Total War",
      }),
      type: "EVENT",
    },
  };
}
