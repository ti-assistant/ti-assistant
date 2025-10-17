import { IntlShape } from "react-intl";

export default function getCodexOneComponents(
  intl: IntlShape
): Record<CodexOne.ComponentId, BaseComponent | BaseTechComponent> {
  return {
    "Wormhole Generator": {
      description: intl.formatMessage({
        id: "Components.Wormhole Generator.Description",
        description: "Description for Component: Wormhole Generator Ω",
        defaultMessage:
          "ACTION: Exhaust this card to place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships.",
      }),
      expansion: "CODEX ONE",
      faction: "Ghosts of Creuss",
      id: "Wormhole Generator",
      name: intl.formatMessage({
        id: "Components.Wormhole Generator.Title",
        description: "Title of Component: Wormhole Generator Ω",
        defaultMessage: "Wormhole Generator Ω",
      }),
      type: "TECH",
    },
  };
}
