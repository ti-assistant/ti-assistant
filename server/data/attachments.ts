import { DISCORDANT_STARS_ATTACHMENTS } from "./discordantstars/attachments";

export const BASE_ATTACHMENTS: Record<AttachmentId, BaseAttachment> = {
  "Biotic Research Facility": {
    attribute: "green-skip",
    expansion: "POK",
    influence: 1,
    id: "Biotic Research Facility",
    name: "Biotic Research Facility",
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
    name: "Core Mining",
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
    name: "Cybernetic Research Facility",
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
    name: "Demilitarized Zone",
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
    name: "Dyson Sphere",
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
    name: "Holy Planet of Ixth",
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
    name: "Lazax Survivors",
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
    name: "Mining World",
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
    name: "Nano-Forge",
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
    name: "Paradise World",
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
    name: "Propulsion Research Facility",
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
    name: "Research Team: Biotic",
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
    name: "Research Team: Cybernetic",
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
    name: "Research Team: Propulsion",
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
    name: "Research Team: Warfare",
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
    name: "Rich World",
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
    name: "Senate Sanctuary",
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
    name: "Terraform",
    required: {
      home: false,
    },
    resources: 1,
  },
  "Terraforming Initiative": {
    expansion: "BASE",
    influence: 1,
    id: "Terraforming Initiative",
    name: "Terraforming Initiative",
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
    name: "Tomb of Emphidia",
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
    name: "Ul the Progenitor",
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
    name: "Warfare Research Facility",
    replaces: "Research Team: Warfare",
    required: {
      home: false,
      type: "HAZARDOUS",
    },
    resources: 1,
  },
  ...DISCORDANT_STARS_ATTACHMENTS,
};
