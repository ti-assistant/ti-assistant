import { IntlShape } from "react-intl";

export default function getProphecyOfKingsAttachments(
  intl: IntlShape,
): Record<ProphecyOfKings.AttachmentId, BaseAttachment> {
  return {
    "Biotic Research Facility": {
      attribute: "green-skip",
      expansion: "POK",
      influence: 1,
      id: "Biotic Research Facility",
      name: intl.formatMessage({
        id: "Attachments.Biotic Research Facility.Title",
        description: "Title of Attachment: Biotic Research Facility",
        defaultMessage: "Biotic Research Facility",
      }),
      replaces: "Research Team: Biotic",
      required: {
        home: false,
        type: "INDUSTRIAL",
      },
      resources: 1,
    },
    "Cybernetic Research Facility": {
      attribute: "yellow-skip",
      expansion: "POK",
      influence: 1,
      id: "Cybernetic Research Facility",
      name: intl.formatMessage({
        id: "Attachments.Cybernetic Research Facility.Title",
        description: "Title of Attachment: Cybernetic Research Facility",
        defaultMessage: "Cybernetic Research Facility",
      }),
      replaces: "Research Team: Cybernetic",
      required: {
        home: false,
        type: "INDUSTRIAL",
      },
      resources: 1,
    },
    "Dyson Sphere": {
      expansion: "POK",
      influence: 1,
      id: "Dyson Sphere",
      name: intl.formatMessage({
        id: "Attachments.Dyson Sphere.Title",
        description: "Title of Attachment: Dyson Sphere",
        defaultMessage: "Dyson Sphere",
      }),
      replaces: "Holy Planet of Ixth",
      required: {
        home: false,
        type: "CULTURAL",
      },
      resources: 2,
    },
    "Lazax Survivors": {
      expansion: "POK",
      influence: 2,
      id: "Lazax Survivors",
      name: intl.formatMessage({
        id: "Attachments.Lazax Survivors.Title",
        description: "Title of Attachment: Lazax Survivors",
        defaultMessage: "Lazax Survivors",
      }),
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 1,
    },
    "Mining World": {
      expansion: "POK",
      influence: 0,
      id: "Mining World",
      name: intl.formatMessage({
        id: "Attachments.Mining World.Title",
        description: "Title of Attachment: Mining World",
        defaultMessage: "Mining World",
      }),
      replaces: "Core Mining",
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 2,
    },
    "Paradise World": {
      expansion: "POK",
      influence: 2,
      id: "Paradise World",
      name: intl.formatMessage({
        id: "Attachments.Paradise World.Title",
        description: "Title of Attachment: Paradise World",
        defaultMessage: "Paradise World",
      }),
      replaces: "Senate Sanctuary",
      required: {
        home: false,
        type: "CULTURAL",
      },
      resources: 0,
    },
    "Propulsion Research Facility": {
      attribute: "blue-skip",
      expansion: "POK",
      influence: 1,
      id: "Propulsion Research Facility",
      name: intl.formatMessage({
        id: "Attachments.Propulsion Research Facility.Title",
        description: "Title of Attachment: Propulsion Research Facility",
        defaultMessage: "Propulsion Research Facility",
      }),
      replaces: "Research Team: Propulsion",
      required: {
        home: false,
        type: "INDUSTRIAL",
      },
      resources: 1,
    },
    "Rich World": {
      expansion: "POK",
      influence: 0,
      id: "Rich World",
      name: intl.formatMessage({
        id: "Attachments.Rich World.Title",
        description: "Title of Attachment: Rich World",
        defaultMessage: "Rich World",
      }),
      replaces: "Terraforming Initiative",
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 1,
    },
    Terraform: {
      attribute: "all-types",
      expansion: "POK",
      faction: "Titans of Ul",
      influence: 1,
      id: "Terraform",
      name: intl.formatMessage({
        id: "Titans of Ul.Promissories.Terraform.Title",
        description: "Title of Faction Promissory: Terraform",
        defaultMessage: "Terraform",
      }),
      required: {
        home: false,
      },
      resources: 1,
    },
    "Tomb of Emphidia": {
      attribute: "tomb",
      expansion: "POK",
      influence: 1,
      id: "Tomb of Emphidia",
      name: intl.formatMessage({
        id: "Attachments.Tomb of Emphidia.Title",
        description: "Title of Attachment: Tomb of Emphidia",
        defaultMessage: "Tomb of Emphidia",
      }),
      required: {
        home: false,
        type: "CULTURAL",
      },
      resources: 0,
    },
    "Ul the Progenitor": {
      attribute: "space-cannon",
      expansion: "POK",
      faction: "Titans of Ul",
      influence: 3,
      id: "Ul the Progenitor",
      name: intl.formatMessage({
        id: "Attachments.Ul the Progenitor.Title",
        description: "Title of Attachment: Ul the Progenitor",
        defaultMessage: "Ul the Progenitor",
      }),
      required: {
        home: true,
        id: "Elysium",
      },
      resources: 3,
    },
    "Warfare Research Facility": {
      attribute: "red-skip",
      expansion: "POK",
      influence: 1,
      id: "Warfare Research Facility",
      name: intl.formatMessage({
        id: "Attachments.Warfare Research Facility.Title",
        description: "Title of Attachment: Warfare Research Facility",
        defaultMessage: "Warfare Research Facility",
      }),
      replaces: "Research Team: Warfare",
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 1,
    },
  };
}
