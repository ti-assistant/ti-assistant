const ATTACHMENTS = {
  "Demilitarized Zone": {
    required: {
      type: "Cultural",
      home: false,
    },
    resources: 0,
    influence: 0,
    attribute: "demilitarized",
  },
  "Dyson Sphere": {
    required: {
      type: "Cultural",
      home: false,
    },
    resources: 2,
    influence: 1,
    attribute: "",
  },
  "Paradise World": {
    required: {
      type: "Cultural",
      home: false,
    },
    resources: 0,
    influence: 2,
    attribute: "",
  },
  "Tomb of Emphidia": {
    required: {
      type: "Cultural",
      home: false,
    },
    resources: 0,
    influence: 1,
    attribute: "tomb",
  },
  "Biotic Research Facility": {
    required: {
      type: "Industrial",
      home: false,
    },
    resources: 1,
    influence: 1,
    attribute: "green-skip",
  },
  "Cybernetic Research Facility": {
    required: {
      type: "Industrial",
      home: false,
    },
    resources: 1,
    influence: 1,
    attribute: "yellow-skip",
  },
  "Propulsion Research Facility": {
    required: {
      type: "Industrial",
      home: false,
    },
    resources: 1,
    influence: 1,
    attribute: "blue-skip",
  },
  "Lazax Survivors": {
    required: {
      type: "Hazardous",
      home: false,
    },
    resources: 1,
    influence: 2,
    attribute: "",
  },
  "Mining World": {
    required: {
      type: "Hazardous",
      home: false,
    },
    resources: 2,
    influence: 0,
    attribute: "",
  },
  "Rich World": {
    required: {
      type: "Hazardous",
      home: false,
    },
    resources: 1,
    influence: 0,
    attribute: "",
  },
  "Warfare Research Facility": {
    required: {
      type: "Hazardous",
      home: false,
    },
    resources: 1,
    influence: 1,
    attribute: "red-skip",
  },
  "Ul the Progenitor": {
    required: {
      name: "Elysium",
      home: true,
    },
    resources: 3,
    influence: 3,
    attribute: "space-cannon",
  },
  "Terraform": {
    required: {
      legendary: false,
      home: false,
    },
    resources: 1,
    influence: 1,
    attribute: "all-types",
  },
  "Nano-Forge": {
    required: {
      legendary: false,
      home: false,
    },
    resources: 2,
    influence: 2,
    attribute: "legendary",
  },
};
export default function handler(req, res) {
  res.status(200).json(ATTACHMENTS);
}