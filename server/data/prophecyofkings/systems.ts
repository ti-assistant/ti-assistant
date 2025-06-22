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
    79: EMPTY_RED_SYSTEM(79, "POK"),
    80: EMPTY_RED_SYSTEM(80, "POK"),
    81: EMPTY_RED_SYSTEM(81, "POK"),
    "82A": {
      expansion: "POK",
      id: "82A",
      planets: ["Mallice"],
      type: "NEXUS",
    },
    "82B": {
      expansion: "POK",
      id: "82B",
      planets: ["Mallice"],
      type: "NEXUS",
    },
    "83A": HYPERLANE_SYSTEM("83A"),
    "83B": HYPERLANE_SYSTEM("83B"),
    "84A": HYPERLANE_SYSTEM("84A"),
    "84B": HYPERLANE_SYSTEM("84B"),
    "85A": HYPERLANE_SYSTEM("85A"),
    "85B": HYPERLANE_SYSTEM("85B"),
    "86A": HYPERLANE_SYSTEM("86A"),
    "86B": HYPERLANE_SYSTEM("86B"),
    "87A": HYPERLANE_SYSTEM("87A"),
    "87B": HYPERLANE_SYSTEM("87B"),
    "88A": HYPERLANE_SYSTEM("88A"),
    "88B": HYPERLANE_SYSTEM("88B"),
    "89A": HYPERLANE_SYSTEM("89A"),
    "89B": HYPERLANE_SYSTEM("89B"),
    "90A": HYPERLANE_SYSTEM("90A"),
    "90B": HYPERLANE_SYSTEM("90B"),
    "91A": HYPERLANE_SYSTEM("91A"),
    "91B": HYPERLANE_SYSTEM("91B"),
  };
}
