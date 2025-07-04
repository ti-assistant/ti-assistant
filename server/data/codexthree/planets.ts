import { IntlShape } from "react-intl";

const HOME_MIDDLE = { x: 0, y: -12 };
const MIDDLE = { x: 0, y: 0 };
const TOP_LEFT = { x: -22, y: -36 };
const HOME_BOTTOM_RIGHT = { x: 30, y: 32 };
const BOTTOM_RIGHT = { x: 18, y: 32 };
const MIDDLE_LEFT = { x: -48, y: -8 };
const TOP_RIGHT = { x: 22, y: -38 };
const FAR_BOTTOM_RIGHT = { x: 28, y: 42 };

export default function getCodexThreePlanets(
  intl: IntlShape
): Record<CodexThree.PlanetId, BasePlanet> {
  return {
    "Archon Ren Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 3,
      id: "Archon Ren Keleres",
      name: "Archon Ren",
      position: TOP_LEFT,
      resources: 2,
      subFaction: "Xxcha Kingdom",
      system: 100,
      type: "NONE",
    },
    "Archon Tau Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 1,
      id: "Archon Tau Keleres",
      name: "Archon Tau",
      position: HOME_BOTTOM_RIGHT,
      resources: 1,
      subFaction: "Xxcha Kingdom",
      system: 100,
      type: "NONE",
    },
    "Avar Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 1,
      id: "Avar Keleres",
      name: "Avar",
      position: FAR_BOTTOM_RIGHT,
      resources: 1,
      subFaction: "Argent Flight",
      system: 101,
      type: "NONE",
    },
    "Custodia Vigilia": {
      ability:
        "While you control Mecatol Rex, it gains SPACE CANNON 5 and PRODUCTION 3.\n\nGain 2 command tokens when another player scores Victory Points using Imperial",
      attributes: ["legendary"],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      influence: 3,
      locked: true,
      id: "Custodia Vigilia",
      name: "Custodia Vigilia",
      resources: 2,
      type: "NONE",
    },
    "Moll Primus Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 1,
      id: "Moll Primus Keleres",
      name: "Moll Primus",
      position: HOME_MIDDLE,
      resources: 4,
      system: 102,
      subFaction: "Mentak Coalition",
      type: "NONE",
    },
    "Valk Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 0,
      id: "Valk Keleres",
      name: "Valk",
      position: MIDDLE_LEFT,
      resources: 2,
      subFaction: "Argent Flight",
      system: 101,
      type: "NONE",
    },
    "Ylir Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 2,
      id: "Ylir Keleres",
      name: "Ylir",
      position: TOP_RIGHT,
      resources: 0,
      subFaction: "Argent Flight",
      system: 101,
      type: "NONE",
    },
  };
}
