import { BaseAttachment } from "../../src/util/api/attachments";

export type AttachmentId =
  | "Biotic Research Facility"
  | "Core Mining"
  | "Cybernetic Research Facility"
  | "Demilitarized Zone"
  | "Dyson Sphere"
  | "Holy Planet of Ixth"
  | "Lazax Survivors"
  | "Mining World"
  | "Nano-Forge"
  | "Paradise World"
  | "Propulsion Research Facility"
  | "Research Team: Biotic"
  | "Research Team: Cybernetic"
  | "Research Team: Propulsion"
  | "Research Team: Warfare"
  | "Rich World"
  | "Senate Sanctuary"
  | "Terraform"
  | "Terraforming Initiative"
  | "Tomb of Emphidia"
  | "Ul the Progenitor"
  | "Warfare Research Facility";

export const BASE_ATTACHMENTS: Record<AttachmentId, BaseAttachment> = {
  "Biotic Research Facility": {
    attribute: "green-skip",
    expansion: "POK",
    influence: 1,
    name: "Biotic Research Facility",
    replaces: "Research Team: Biotic",
    required: {
      home: false,
      type: "Industrial",
    },
    resources: 1,
  },
  "Core Mining": {
    expansion: "BASE",
    influence: 0,
    name: "Core Mining",
    required: {
      home: false,
      type: "Hazardous",
    },
    resources: 2,
  },
  "Cybernetic Research Facility": {
    attribute: "yellow-skip",
    expansion: "POK",
    influence: 1,
    name: "Cybernetic Research Facility",
    replaces: "Research Team: Cybernetic",
    required: {
      home: false,
      type: "Industrial",
    },
    resources: 1,
  },
  "Demilitarized Zone": {
    attribute: "demilitarized",
    expansion: "BASE",
    influence: 0,
    name: "Demilitarized Zone",
    required: {
      home: false,
      type: "Cultural",
    },
    resources: 0,
  },
  "Dyson Sphere": {
    expansion: "POK",
    influence: 1,
    name: "Dyson Sphere",
    replaces: "Holy Planet of Ixth",
    required: {
      home: false,
      type: "Cultural",
    },
    resources: 2,
  },
  "Holy Planet of Ixth": {
    attribute: "victory-point",
    expansion: "BASE",
    influence: 0,
    name: "Holy Planet of Ixth",
    required: {
      home: false,
      type: "Cultural",
    },
    resources: 0,
  },
  "Lazax Survivors": {
    expansion: "POK",
    influence: 2,
    name: "Lazax Survivors",
    required: {
      home: false,
      type: "Hazardous",
    },
    resources: 1,
  },
  "Mining World": {
    expansion: "POK",
    influence: 0,
    name: "Mining World",
    replaces: "Core Mining",
    required: {
      home: false,
      type: "Hazardous",
    },
    resources: 2,
  },
  "Nano-Forge": {
    attribute: "legendary",
    expansion: "CODEX TWO",
    influence: 2,
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
    name: "Paradise World",
    replaces: "Senate Sanctuary",
    required: {
      home: false,
      type: "Cultural",
    },
    resources: 0,
  },
  "Propulsion Research Facility": {
    attribute: "blue-skip",
    expansion: "POK",
    influence: 1,
    name: "Propulsion Research Facility",
    replaces: "Research Team: Propulsion",
    required: {
      home: false,
      type: "Industrial",
    },
    resources: 1,
  },
  "Research Team: Biotic": {
    attribute: "green-skip",
    expansion: "BASE",
    influence: 0,
    name: "Research Team: Biotic",
    required: {
      home: false,
      type: "Industrial",
    },
    resources: 0,
  },
  "Research Team: Cybernetic": {
    attribute: "yellow-skip",
    expansion: "BASE",
    influence: 0,
    name: "Research Team: Cybernetic",
    required: {
      home: false,
      type: "Industrial",
    },
    resources: 0,
  },
  "Research Team: Propulsion": {
    attribute: "blue-skip",
    expansion: "BASE",
    influence: 0,
    name: "Research Team: Propulsion",
    required: {
      home: false,
      type: "Industrial",
    },
    resources: 0,
  },
  "Research Team: Warfare": {
    attribute: "red-skip",
    expansion: "BASE",
    influence: 0,
    name: "Research Team: Warfare",
    required: {
      home: false,
      type: "Hazardous",
    },
    resources: 0,
  },
  "Rich World": {
    expansion: "POK",
    influence: 0,
    name: "Rich World",
    replaces: "Terraforming Initiative",
    required: {
      home: false,
      type: "Hazardous",
    },
    resources: 1,
  },
  "Senate Sanctuary": {
    expansion: "BASE",
    influence: 2,
    name: "Senate Sanctuary",
    required: {
      home: false,
      type: "Cultural",
    },
    resources: 0,
  },
  Terraform: {
    attribute: "all-types",
    expansion: "POK",
    influence: 1,
    name: "Terraform",
    required: {
      home: false,
    },
    resources: 1,
  },
  "Terraforming Initiative": {
    expansion: "BASE",
    influence: 1,
    name: "Terraforming Initiative",
    required: {
      home: false,
      type: "Hazardous",
    },
    resources: 1,
  },
  "Tomb of Emphidia": {
    attribute: "tomb",
    expansion: "POK",
    influence: 1,
    name: "Tomb of Emphidia",
    required: {
      home: false,
      type: "Cultural",
    },
    resources: 0,
  },
  "Ul the Progenitor": {
    attribute: "space-cannon",
    expansion: "POK",
    influence: 3,
    name: "Ul the Progenitor",
    required: {
      home: true,
      name: "Elysium",
    },
    resources: 3,
  },
  "Warfare Research Facility": {
    attribute: "red-skip",
    expansion: "POK",
    influence: 1,
    name: "Warfare Research Facility",
    replaces: "Research Team: Warfare",
    required: {
      home: false,
      type: "Hazardous",
    },
    resources: 1,
  },
};
