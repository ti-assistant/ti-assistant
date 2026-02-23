function EMPTY_RED_SYSTEM(id: SystemId, expansion: Expansion): BaseSystem {
  return {
    expansion: expansion,
    id: id,
    planets: [],
    type: "RED",
  };
}

function HYPERLANE_SYSTEM(id: SystemId): BaseSystem {
  return {
    expansion: "POK",
    id: id,
    planets: [],
    type: "HYPERLANE",
  };
}

export default function getProphecyOfKingsSystems(): Record<
  ProphecyOfKings.SystemId,
  BaseSystem
> {
  return {
    52: {
      expansion: "POK",
      id: 52,
      planets: ["Ixth"],
      type: "HOME",
    },
    53: {
      expansion: "POK",
      id: 53,
      planets: ["Arcturus"],
      type: "HOME",
    },
    54: {
      expansion: "POK",
      id: 54,
      planets: ["Acheron"],
      type: "HOME",
    },
    55: {
      expansion: "POK",
      id: 55,
      planets: ["Elysium"],
      type: "HOME",
    },
    56: {
      expansion: "POK",
      id: 56,
      planets: ["The Dark"],
      type: "HOME",
    },
    57: {
      expansion: "POK",
      id: 57,
      planets: ["Naazir", "Rokha"],
      type: "HOME",
    },
    58: {
      expansion: "POK",
      id: 58,
      planets: ["Ylir", "Valk", "Avar"],
      type: "HOME",
    },
    59: {
      expansion: "POK",
      id: 59,
      planets: ["Archon Vail"],
      type: "BLUE",
    },
    60: {
      expansion: "POK",
      id: 60,
      planets: ["Perimeter"],
      type: "BLUE",
    },
    61: {
      expansion: "POK",
      id: 61,
      planets: ["Ang"],
      type: "BLUE",
    },
    62: {
      expansion: "POK",
      id: 62,
      planets: ["Sem-Lore"],
      type: "BLUE",
    },
    63: {
      expansion: "POK",
      id: 63,
      planets: ["Vorhal"],
      type: "BLUE",
    },
    64: {
      expansion: "POK",
      id: 64,
      planets: ["Atlas"],
      type: "BLUE",
      wormholes: ["BETA"],
    },
    65: {
      expansion: "POK",
      id: 65,
      planets: ["Primor"],
      type: "BLUE",
    },
    66: {
      expansion: "POK",
      id: 66,
      planets: ["Hope's End"],
      type: "BLUE",
    },
    67: {
      expansion: "POK",
      id: 67,
      planets: ["Cormund"],
      type: "RED",
    },
    68: {
      expansion: "POK",
      id: 68,
      planets: ["Everra"],
      type: "RED",
    },
    69: {
      expansion: "POK",
      id: 69,
      planets: ["Accoen", "Jeol Ir"],
      type: "BLUE",
    },
    70: {
      expansion: "POK",
      id: 70,
      planets: ["Kraag", "Siig"],
      type: "BLUE",
    },
    71: {
      expansion: "POK",
      id: 71,
      planets: ["Ba'kal", "Alio Prima"],
      type: "BLUE",
    },
    72: {
      expansion: "POK",
      id: 72,
      planets: ["Lisis", "Velnor"],
      type: "BLUE",
    },
    73: {
      expansion: "POK",
      id: 73,
      planets: ["Cealdri", "Xanhact"],
      type: "BLUE",
    },
    74: {
      expansion: "POK",
      id: 74,
      planets: ["Vega Major", "Vega Minor"],
      type: "BLUE",
    },
    75: {
      expansion: "POK",
      id: 75,
      planets: ["Abaddon", "Loki", "Ashtroth"],
      type: "BLUE",
    },
    76: {
      expansion: "POK",
      id: 76,
      planets: ["Rigel II", "Rigel III", "Rigel I"],
      type: "BLUE",
    },
    77: EMPTY_RED_SYSTEM(77, "POK"),
    78: EMPTY_RED_SYSTEM(78, "POK"),
    79: {
      expansion: "POK",
      id: 79,
      planets: [],
      type: "RED",
      wormholes: ["ALPHA"],
    },
    80: EMPTY_RED_SYSTEM(80, "POK"),
    81: EMPTY_RED_SYSTEM(81, "POK"),
    "82A": {
      expansion: "POK",
      id: "82A",
      planets: ["Mallice"],
      type: "NEXUS",
      wormholes: ["GAMMA"],
    },
    "82B": {
      expansion: "POK",
      id: "82B",
      planets: ["Mallice"],
      type: "NEXUS",
      wormholes: ["ALPHA", "BETA", "GAMMA"],
    },
    "83A": {
      expansion: "POK",
      id: "83A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "TOP RIGHT",
        },
      ],
    },
    "83B": {
      expansion: "POK",
      id: "83B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "TOP LEFT",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "84A": {
      expansion: "POK",
      id: "84A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "TOP LEFT",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "84B": {
      expansion: "POK",
      id: "84B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "UP",
        },
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "DOWN",
          b: "TOP RIGHT",
        },
      ],
    },
    "85A": {
      expansion: "POK",
      id: "85A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "TOP LEFT",
          b: "TOP RIGHT",
        },
      ],
    },
    "85B": {
      expansion: "POK",
      id: "85B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "TOP LEFT",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "86A": {
      expansion: "POK",
      id: "86A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "TOP LEFT",
          b: "TOP RIGHT",
        },
      ],
    },
    "86B": {
      expansion: "POK",
      id: "86B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "UP",
        },
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "DOWN",
          b: "TOP RIGHT",
        },
      ],
    },
    "87A": {
      expansion: "POK",
      id: "87A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "BOTTOM RIGHT",
        },
        {
          a: "TOP LEFT",
          b: "BOTTOM RIGHT",
        },
        {
          a: "UP",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "87B": {
      expansion: "POK",
      id: "87B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "88A": {
      expansion: "POK",
      id: "88A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "UP",
        },
        {
          a: "BOTTOM LEFT",
          b: "TOP RIGHT",
        },
        {
          a: "BOTTOM LEFT",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "88B": {
      expansion: "POK",
      id: "88B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "TOP LEFT",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "89A": {
      expansion: "POK",
      id: "89A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "UP",
        },
        {
          a: "UP",
          b: "BOTTOM RIGHT",
        },
        {
          a: "BOTTOM LEFT",
          b: "BOTTOM RIGHT",
        },
      ],
    },
    "89B": {
      expansion: "POK",
      id: "89B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "UP",
        },
        {
          a: "UP",
          b: "DOWN",
        },
      ],
    },
    "90A": {
      expansion: "POK",
      id: "90A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "BOTTOM RIGHT",
        },
        {
          a: "TOP LEFT",
          b: "TOP RIGHT",
        },
      ],
    },
    "90B": {
      expansion: "POK",
      id: "90B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "UP",
        },
        {
          a: "UP",
          b: "DOWN",
        },
      ],
    },
    "91A": {
      expansion: "POK",
      id: "91A",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "BOTTOM LEFT",
          b: "UP",
        },
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "DOWN",
          b: "TOP RIGHT",
        },
      ],
    },
    "91B": {
      expansion: "POK",
      id: "91B",
      planets: [],
      type: "HYPERLANE",
      hyperlanes: [
        {
          a: "UP",
          b: "DOWN",
        },
        {
          a: "UP",
          b: "BOTTOM RIGHT",
        },
      ],
    },
  };
}
