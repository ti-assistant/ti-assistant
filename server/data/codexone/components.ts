import { IntlShape } from "react-intl";

export default function getCodexOneComponents(
  intl: IntlShape
): Record<CodexOne.ComponentId, BaseComponent | BaseTechComponent> {
  return {
    "Fighter Conscription": {
      description: intl.formatMessage({
        id: "Components.Fighter Conscription.Description",
        description: "Description for Component: Fighter Conscription",
        defaultMessage:
          "ACTION: Place 1 fighter from your reinforcements in each system that contains 1 or more of your space docks or units that have capacity; they cannot be placed in systems that contain other players' ships.",
      }),
      expansion: "CODEX ONE",
      id: "Fighter Conscription",
      name: intl.formatMessage({
        id: "Components.Fighter Conscription.Title",
        description: "Title of Component: Fighter Conscription",
        defaultMessage: "Fighter Conscription",
      }),
      type: "CARD",
    },
    Impersonation: {
      description: intl.formatMessage({
        id: "Components.Impersonation.Description",
        description: "Description for Component: Impersonation",
        defaultMessage: "ACTION: Spend 3 influence to draw 1 secret objective.",
      }),
      expansion: "CODEX ONE",
      id: "Impersonation",
      name: intl.formatMessage({
        id: "Components.Impersonation.Title",
        description: "Title of Component: Impersonation",
        defaultMessage: "Impersonation",
      }),
      type: "CARD",
    },
    Plagiarize: {
      description: intl.formatMessage({
        id: "Components.Plagiarize.Description",
        description: "Description for Component: Plagiarize",
        defaultMessage:
          "ACTION: Spend 5 influence and choose a non-faction technology owned by 1 of your neighbors; gain that technology.",
      }),
      expansion: "CODEX ONE",
      id: "Plagiarize",
      name: intl.formatMessage({
        id: "Components.Plagiarize.Title",
        description: "Title of Component: Plagiarize",
        defaultMessage: "Plagiarize",
      }),
      type: "CARD",
    },
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
