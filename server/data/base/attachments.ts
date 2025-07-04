import { IntlShape } from "react-intl";

export default function getBaseAttachments(
  intl: IntlShape
): Record<BaseGame.AttachmentId, BaseAttachment> {
  return {
    "Core Mining": {
      expansion: "BASE",
      influence: 0,
      id: "Core Mining",
      name: intl.formatMessage({
        id: "Attachments.Core Mining.Title",
        description: "Title of Attachment: Core Mining",
        defaultMessage: "Core Mining",
      }),
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 2,
    },
    "Demilitarized Zone": {
      attribute: "demilitarized",
      expansion: "BASE",
      influence: 0,
      id: "Demilitarized Zone",
      name: intl.formatMessage({
        id: "Attachments.Demilitarized Zone.Title",
        description: "Title of Attachment: Demilitarized Zone",
        defaultMessage: "Demilitarized Zone",
      }),
      required: {
        home: false,
        type: "CULTURAL",
      },
      resources: 0,
    },
    "Holy Planet of Ixth": {
      attribute: "victory-point",
      expansion: "BASE",
      influence: 0,
      id: "Holy Planet of Ixth",
      name: intl.formatMessage({
        id: "Attachments.Holy Planet of Ixth.Title",
        description: "Title of Attachment: Holy Planet of Ixth",
        defaultMessage: "Holy Planet of Ixth",
      }),
      required: {
        home: false,
        type: "CULTURAL",
      },
      resources: 0,
    },
    "Research Team: Biotic": {
      attribute: "green-skip",
      expansion: "BASE",
      influence: 0,
      id: "Research Team: Biotic",
      name: intl.formatMessage({
        id: "Attachments.Research Team: Biotic.Title",
        description: "Title of Attachment: Research Team: Biotic",
        defaultMessage: "Research Team: Biotic",
      }),
      required: {
        home: false,
        type: "INDUSTRIAL",
      },
      resources: 0,
    },
    "Research Team: Cybernetic": {
      attribute: "yellow-skip",
      expansion: "BASE",
      influence: 0,
      id: "Research Team: Cybernetic",
      name: intl.formatMessage({
        id: "Attachments.Research Team: Cybernetic.Title",
        description: "Title of Attachment: Research Team: Cybernetic",
        defaultMessage: "Research Team: Cybernetic",
      }),
      required: {
        home: false,
        type: "INDUSTRIAL",
      },
      resources: 0,
    },
    "Research Team: Propulsion": {
      attribute: "blue-skip",
      expansion: "BASE",
      influence: 0,
      id: "Research Team: Propulsion",
      name: intl.formatMessage({
        id: "Attachments.Research Team: Propulsion.Title",
        description: "Title of Attachment: Research Team: Propulsion",
        defaultMessage: "Research Team: Propulsion",
      }),
      required: {
        home: false,
        type: "INDUSTRIAL",
      },
      resources: 0,
    },
    "Research Team: Warfare": {
      attribute: "red-skip",
      expansion: "BASE",
      influence: 0,
      id: "Research Team: Warfare",
      name: intl.formatMessage({
        id: "Attachments.Research Team: Warfare.Title",
        description: "Title of Attachment: Research Team: Warfare",
        defaultMessage: "Research Team: Warfare",
      }),
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 0,
    },
    "Senate Sanctuary": {
      expansion: "BASE",
      influence: 2,
      id: "Senate Sanctuary",
      name: intl.formatMessage({
        id: "Attachments.Senate Sanctuary.Title",
        description: "Title of Attachment: Senate Sanctuary",
        defaultMessage: "Senate Sanctuary",
      }),
      required: {
        home: false,
        type: "CULTURAL",
      },
      resources: 0,
    },
    "Terraforming Initiative": {
      expansion: "BASE",
      influence: 1,
      id: "Terraforming Initiative",
      name: intl.formatMessage({
        id: "Attachments.Terraforming Initiative.Title",
        description: "Title of Attachment: Terraforming Initiative",
        defaultMessage: "Terraforming Initiative",
      }),
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 1,
    },
  };
}
