import { IntlShape } from "react-intl";

export function getBaseDiscordantStarsAttachments(
  intl: IntlShape
): Record<DiscordantStars.AttachmentId, BaseAttachment> {
  return {
    "Council Preserve": {
      attribute: "extra-votes",
      expansion: "DISCORDANT STARS",
      influence: 0,
      id: "Council Preserve",
      name: intl.formatMessage({
        id: "Attachments.Council Preserve.Title",
        description: "Title for Attachment: Council Preserve",
        defaultMessage: "Council Preserve",
      }),
      required: {
        home: false,
        type: "CULTURAL",
      },
      resources: 0,
    },
    "Orbital Foundries": {
      attribute: "production",
      expansion: "DISCORDANT STARS",
      influence: 0,
      id: "Orbital Foundries",
      name: intl.formatMessage({
        id: "Attachments.Orbital Foundries.Title",
        description: "Title for Attachment: Orbital Foundries",
        defaultMessage: "Orbital Foundries",
      }),
      required: {
        home: false,
        type: "INDUSTRIAL",
      },
      resources: 0,
    },
    "Arcane Citadel": {
      attribute: "infantry",
      expansion: "DISCORDANT STARS",
      influence: 0,
      id: "Arcane Citadel",
      name: intl.formatMessage({
        id: "Attachments.Arcane Citadel.Title",
        description: "Title for Attachment: Arcane Citadel",
        defaultMessage: "Arcane Citadel",
      }),
      required: {
        home: false,
        type: "HAZARDOUS",
      },
      resources: 0,
    },
    // TODO: Fix the skip - should be an any skip.
    // Can attach to Mecatol?
    // "Encryption Key": {
    //   attribute: "blue-skip",
    //   expansion: "DISCORDANT STARS",
    //   influence: 0,
    //   id: "Encryption Key",
    // name: "Encryption Key",
    //   required: {
    //     home: false,
    //   },
    //   resources: 0,
    // },
    // // TODO: Add attribute for this.
    // "Core Token": {
    //   expansion: "DISCORDANT STARS",
    //   influence: 0,
    //   id: "Core Token",
    // name: "Core Token",
    //   required: {
    //     home: false,
    //   },
    //   resources: 2,
    // },
    // // Can attach to Mecatol?
    "Gledge Base": {
      expansion: "DISCORDANT STARS",
      faction: "Gledge Union",
      influence: 0,
      id: "Gledge Base",
      name: intl.formatMessage({
        id: "Attachments.Gledge Base.Title",
        description: "Title for Attachment: Gledge Base",
        defaultMessage: "Gledge Base",
      }),
      required: {
        home: false,
      },
      resources: 2,
    },
    "Branch Office - Broadcast Hub": {
      expansion: "DISCORDANT STARS",
      faction: "Veldyr Sovereignty",
      influence: 1,
      id: "Branch Office - Broadcast Hub",
      name: intl.formatMessage({
        id: "Attachments.Branch Office - Broadcast Hub.Title",
        description: "Title for Attachment: Branch Office - Broadcast Hub",
        defaultMessage: "Branch Office - Broadcast Hub",
      }),
      required: {
        home: false,
      },
      resources: 0,
    },
    "Branch Office - Tax Haven": {
      expansion: "DISCORDANT STARS",
      faction: "Veldyr Sovereignty",
      influence: 1,
      id: "Branch Office - Tax Haven",
      name: intl.formatMessage({
        id: "Attachments.Branch Office - Tax Haven.Title",
        description: "Title for Attachment: Branch Office - Tax Haven",
        defaultMessage: "Branch Office - Tax Haven",
      }),
      required: {
        home: false,
      },
      resources: 0,
    },
    "Branch Office - Reserve Bank": {
      expansion: "DISCORDANT STARS",
      faction: "Veldyr Sovereignty",
      influence: 0,
      id: "Branch Office - Reserve Bank",
      name: intl.formatMessage({
        id: "Attachments.Branch Office - Reserve Bank.Title",
        description: "Title for Attachment: Branch Office - Reserve Bank",
        defaultMessage: "Branch Office - Reserve Bank",
      }),
      required: {
        home: false,
      },
      resources: 1,
    },
    "Branch Office - Orbital Shipyard": {
      expansion: "DISCORDANT STARS",
      faction: "Veldyr Sovereignty",
      influence: 0,
      id: "Branch Office - Orbital Shipyard",
      name: intl.formatMessage({
        id: "Attachments.Branch Office - Orbital Shipyard.Title",
        description: "Title for Attachment: Branch Office - Orbital Shipyard",
        defaultMessage: "Branch Office - Orbital Shipyard",
      }),
      required: {
        home: false,
      },
      resources: 1,
    },
  };
}
