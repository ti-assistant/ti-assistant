import { IntlShape } from "react-intl";

export default function getCodexTwoAttachments(
  intl: IntlShape
): Record<CodexTwo.AttachmentId, BaseAttachment> {
  return {
    "Nano-Forge": {
      attribute: "legendary",
      expansion: "CODEX TWO",
      influence: 2,
      id: "Nano-Forge",
      name: intl.formatMessage({
        id: "Attachments.Nano-Forge.Title",
        description: "Title of Attachment: Nano-Forge",
        defaultMessage: "Nano-Forge",
      }),
      required: {
        home: false,
        legendary: false,
      },
      resources: 2,
    },
  };
}
