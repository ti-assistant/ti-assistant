import { IntlShape } from "react-intl/src/types";

export default function getCodexFourObjectives(
  intl: IntlShape,
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
      event: "Total War",
      id: "Total War",
      name: intl.formatMessage({
        id: "Events.Total War.Title",
        description: "Title of Event: Total War",
        defaultMessage: "Total War",
      }),
      repeatable: true,
      phase: "ACTION",
      points: 1,
      type: "OTHER",
    },
    "Book of Latvinia": {
      description: intl.formatMessage(
        {
          id: "Relics.Book of Latvinia.Description",
          description: "Description for Relic: Book of Latvinia",
          defaultMessage:
            "When you gain this card, research up to 2 technologies that have no prerequisites.{br}ACTION: Purge this card; if you control planets that have all 4 types of technology specialties, gain 1 victory point. Otherwise, gain the speaker token.",
        },
        { br: "\n\n" },
      ),
      expansion: "CODEX FOUR",
      id: "Book of Latvinia",
      name: intl.formatMessage({
        id: "Relics.Book of Latvinia.Title",
        description: "Title of Relic: Book of Latvinia",
        defaultMessage: "Book of Latvinia",
      }),
      phase: "ACTION",
      points: 1,
      type: "OTHER",
    },
  };
}
