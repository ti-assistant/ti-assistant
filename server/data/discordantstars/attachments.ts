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
    influence: 0,
    id: "Gledge Base",
    name: "Gledge Base",
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
    id: "Branch Office - Tax Haven",
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
    id: "Branch Office - Reserve Bank",
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
    id: "Branch Office - Orbital Shipyard",
    name: "Branch Office - Orbital Shipyard",
    required: {
      home: false,
    },
    resources: 1,
  },
};
