import { Resources } from "../../../src/Resources";
import { BaseAttachment } from "../../../src/util/api/attachments";

export const DISCORDANT_STARS_ATTACHMENTS: Record<
  DiscordantStars.AttachmentId,
  BaseAttachment
> = {
  // TODO: Fix the skip - should be an any skip.
  // Can attach to Mecatol?
  // "Encryption Key": {
  //   attribute: "blue-skip",
  //   expansion: "DISCORDANT STARS",
  //   influence: 0,
  //   name: "Encryption Key",
  //   required: {
  //     home: false,
  //   },
  //   resources: 0,
  // },
  // // TODO: Add attribute for this.
  // "Core Token": {
  //   expansion: "DISCORDANT STARS",
  //   influence: 0,
  //   name: "Core Token",
  //   required: {
  //     home: false,
  //   },
  //   resources: 2,
  // },
  // // Can attach to Mecatol?
  // "Gledge Base": {
  //   expansion: "DISCORDANT STARS",
  //   influence: 0,
  //   name: "Gledge Base",
  //   required: {
  //     home: false,
  //   },
  //   resources: 2,
  // },
  "Branch Office - Broadcast Hub": {
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    influence: 1,
    name: "Branch Office - Broadcast Hub",
    required: {
      home: false,
    },
    resources: 0,
  },
  "Branch Office - Tax Haven": {
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    influence: 1,
    name: "Branch Office - Tax Haven",
    required: {
      home: false,
    },
    resources: 0,
  },
  "Branch Office - Reserve Bank": {
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    influence: 0,
    name: "Branch Office - Reserve Bank",
    required: {
      home: false,
    },
    resources: 1,
  },
  "Branch Office - Orbital Shipyard": {
    expansion: "DISCORDANT STARS",
    faction: "Veldyr Sovereignty",
    influence: 0,
    name: "Branch Office - Orbital Shipyard",
    required: {
      home: false,
    },
    resources: 1,
  },
};
