import { IntlShape } from "react-intl";
import { getBaseDiscordantStarsAttachments } from "./discordantstars/attachments";

export function getBaseAttachments(
  intl: IntlShape
): Record<AttachmentId, BaseAttachment> {
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
    Terraform: {
      attribute: "all-types",
      expansion: "POK",
      faction: "Titans of Ul",
      influence: 1,
      id: "Terraform",
      name: intl.formatMessage({
        id: "Attachments.Terraform.Title",
        description: "Title of Attachment: Terraform",
        defaultMessage: "Terraform",
      }),
      required: {
        home: false,
      },
      resources: 1,
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
    ...getBaseDiscordantStarsAttachments(intl),
  };
}
