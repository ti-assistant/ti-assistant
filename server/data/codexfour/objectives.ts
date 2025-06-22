import { IntlShape } from "react-intl/src/types";

export function getCodexFourObjectives(
  intl: IntlShape
): Record<CodexFour.ObjectiveId, BaseObjective> {
  return {
    "Total War": {
      description: intl.formatMessage({
        id: "Objectives.Total War.Description",
        description: "Description for Objective: Total War",
        defaultMessage:
          "Discard 10 commodities from planets in your home system.",
      }),
      expansion: "CODEX FOUR",
      id: "Total War",
      name: intl.formatMessage({
        id: "Objectives.Total War.Title",
        description: "Title of Objective: Total War",
        defaultMessage: "Total War",
      }),
      repeatable: true,
      phase: "ACTION",
      points: 1,
      type: "OTHER",
    },
    "Book of Latvinia": {
      description: intl.formatMessage({
        id: "Objectives.Book of Latvinia.Description",
        description: "Description for Objective: Book of Latvinia",
        defaultMessage:
          "Use the Book of Latvinia's ACTION while in control of planets with all 4 types of technology specialities.",
      }),
      expansion: "CODEX FOUR",
      id: "Book of Latvinia",
      name: intl.formatMessage({
        id: "Objectives.Book of Latvinia.Title",
        description: "Title of Objective: Book of Latvinia",
        defaultMessage: "Book of Latvinia",
      }),
      phase: "ACTION",
      points: 1,
      type: "OTHER",
    },
  };
}
