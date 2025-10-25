import { IntlShape } from "react-intl/src/types";

export default function getCodexFourRelics(
  intl: IntlShape
): Record<CodexFour.RelicId, BaseRelic> {
  return {
    "Circlet of the Void": {
      description: intl.formatMessage(
        {
          id: "Relics.Circlet of the Void.Description",
          description: "Description for Relic: Circlet of the Void",
          defaultMessage:
            "Your units do not roll for gravity rifts, and you ignore the movement effects of other anomalies.{br}ACTION: Exhaust this card to explore a frontier token in a system that does not contain any other players' ships.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Circlet of the Void",
      name: intl.formatMessage({
        id: "Relics.Circlet of the Void.Title",
        description: "Title of Relic: Circlet of the Void",
        defaultMessage: "Circlet of the Void",
      }),
      timing: "COMPONENT_ACTION",
    },
    "Book of Latvinia": {
      description: intl.formatMessage(
        {
          id: "Relics.Book of Latvinia.Description",
          description: "Description for Relic: Book of Latvinia",
          defaultMessage:
            "When you gain this card, research up to 2 technologies that have no prerequisites.{br}ACTION: Purge this card; if you control planets that have all 4 types of technology specialties, gain 1 victory point. Otherwise, gain the speaker token.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX FOUR",
      id: "Book of Latvinia",
      name: intl.formatMessage({
        id: "Relics.Book of Latvinia.Title",
        description: "Title of Relic: Book of Latvinia",
        defaultMessage: "Book of Latvinia",
      }),
      timing: "COMPONENT_ACTION",
    },
    Neuraloop: {
      description: intl.formatMessage({
        id: "Relics.Neuraloop.Description",
        description: "Description for Relic: Neuraloop",
        defaultMessage:
          "When a public objective is revealed, you may purge one of your relics to discard that objective and replace it with a random objective from any objective deck; that objective is a public objective, even if it is a secret objective.",
      }),
      expansion: "CODEX FOUR",
      id: "Neuraloop",
      name: intl.formatMessage({
        id: "Relics.Neuraloop.Title",
        description: "Title of Relic: Neuraloop",
        defaultMessage: "Neuraloop",
      }),
      timing: "OTHER",
    },
  };
}
