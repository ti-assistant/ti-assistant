import { IntlShape } from "react-intl";

export default function getCodexTwoRelics(
  intl: IntlShape
): Record<CodexTwo.RelicId, BaseRelic> {
  return {
    "Dynamis Core": {
      description: intl.formatMessage(
        {
          id: "Relics.Dynamis Core.Description",
          description: "Description for Relic: Dynamis Core",
          defaultMessage:
            "While this card is in your play area, your commodity value is increased by 2.{br}ACTION: Gain trade goods equal to your commodity value, then purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX TWO",
      id: "Dynamis Core",
      name: intl.formatMessage({
        id: "Relics.Dynamis Core.Title",
        description: "Title of Relic: Dynamis Core",
        defaultMessage: "Dynamis Core",
      }),
      timing: "COMPONENT_ACTION",
    },
    "JR-XS455-O": {
      description: intl.formatMessage({
        id: "Relics.JR-XS455-O.Description",
        description: "Description for Relic: JR-XS455-O",
        defaultMessage:
          "ACTION: Exhaust this agent and choose a player; that player may spend 3 resources to place a structure on a planet they control. If they do not, they gain 1 trade good.",
      }),
      expansion: "CODEX TWO",
      id: "JR-XS455-O",
      name: intl.formatMessage({
        id: "Relics.JR-XS455-O.Title",
        description: "Title of Relic: JR-XS455-O",
        defaultMessage: "JR-XS455-O",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Nano-Forge": {
      description: intl.formatMessage({
        id: "Relics.Nano-Forge.Description",
        description: "Description for Relic: Nano-Forge",
        defaultMessage:
          "ACTION: Attach this card to a non-legendary, non-home planet you control; its resource and influence values are increased by 2 and it is a legendary planet. This action cannot be performed once attached.",
      }),
      expansion: "CODEX TWO",
      id: "Nano-Forge",
      name: intl.formatMessage({
        id: "Relics.Nano-Forge.Title",
        description: "Title of Relic: Nano-Forge",
        defaultMessage: "Nano-Forge",
      }),
      timing: "COMPONENT_ACTION",
    },
  };
}
