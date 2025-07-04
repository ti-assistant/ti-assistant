import { IntlShape } from "react-intl";

export default function getCodexThreeTechs(
  intl: IntlShape
): Record<CodexThree.TechId, BaseTech> {
  return {
    "Agency Supply Network": {
      description: intl.formatMessage({
        id: "Council Keleres.Techs.Agency Supply Network.Description",
        description: "Description for Tech: Agency Supply Network",
        defaultMessage:
          "Whenever you resolve one of your PRODUCTION abilities, you may resolve an additional one of your PRODUCTION abilities in any system; the additional use does not trigger this ability.",
      }),
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      id: "Agency Supply Network",
      name: intl.formatMessage({
        id: "Council Keleres.Techs.Agency Supply Network.Title",
        description: "Title of Tech: Agency Supply Network",
        defaultMessage: "Agency Supply Network",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    "IIHQ Modernization": {
      description: intl.formatMessage(
        {
          id: "Council Keleres.Techs.I.I.H.Q. Modernization.Description",
          description: "Description for Tech: I.I.H.Q. Modernization",
          defaultMessage:
            "You are neighbors with all players that have units or control planets in or adjacent to the Mecatol Rex system.{br}Gain the Custodia Vigilia planet card and its legendary planet ability card. You cannot lose these cards, and this card cannot have an X or Y assimilator placed on it.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      id: "IIHQ Modernization",
      name: intl.formatMessage({
        id: "Council Keleres.Techs.I.I.H.Q. Modernization.Title",
        description: "Title of Tech: I.I.H.Q. Modernization",
        defaultMessage: "I.I.H.Q. Modernization",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
  };
}
