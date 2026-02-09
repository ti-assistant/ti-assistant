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
  intl: IntlShape,
): Record<CodexThree.PlanetId, BasePlanet> {
  return {
    "Archon Ren Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 3,
      id: "Archon Ren Keleres",
      name: intl.formatMessage({
        id: "Planets.Archon Ren.Name",
        description: "Name of Planet: Archon Ren",
        defaultMessage: "Archon Ren",
      }),
      position: TOP_LEFT,
      resources: 2,
      subFaction: "Xxcha Kingdom",
      system: 200,
      types: [],
    },
    "Archon Tau Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 1,
      id: "Archon Tau Keleres",
      name: intl.formatMessage({
        id: "Planets.Archon Tau.Name",
        description: "Name of Planet: Archon Tau",
        defaultMessage: "Archon Tau",
      }),
      position: HOME_BOTTOM_RIGHT,
      resources: 1,
      subFaction: "Xxcha Kingdom",
      system: 200,
      types: [],
    },
    "Avar Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 1,
      id: "Avar Keleres",
      name: intl.formatMessage({
        id: "Planets.Avar.Name",
        description: "Name of Planet: Avar",
        defaultMessage: "Avar",
      }),
      position: FAR_BOTTOM_RIGHT,
      resources: 1,
      subFaction: "Argent Flight",
      system: 201,
      types: [],
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
      name: intl.formatMessage({
        id: "Planets.Custodia Vigilia.Name",
        description: "Name of Planet: Custodia Vigilia",
        defaultMessage: "Custodia Vigilia",
      }),
      omegas: [
        {
          ability:
            'While you control Mecatol Rex, it gains SPACE CANNON 5 and PRODUCTION 3.\n\nGain 2 command tokens when another player gains a victory point using the second clause of "Imperial"',
          expansion: "THUNDERS EDGE",
          influence: 2,
        },
      ],
      resources: 2,
      types: [],
    },
    "Moll Primus Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 1,
      id: "Moll Primus Keleres",
      name: intl.formatMessage({
        id: "Planets.Moll Primus.Name",
        description: "Name of Planet: Moll Primus",
        defaultMessage: "Moll Primus",
      }),
      position: HOME_MIDDLE,
      resources: 4,
      system: 202,
      subFaction: "Mentak Coalition",
      types: [],
    },
    "Valk Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 0,
      id: "Valk Keleres",
      name: intl.formatMessage({
        id: "Planets.Valk.Name",
        description: "Name of Planet: Valk",
        defaultMessage: "Valk",
      }),
      position: MIDDLE_LEFT,
      resources: 2,
      subFaction: "Argent Flight",
      system: 201,
      types: [],
    },
    "Ylir Keleres": {
      attributes: [],
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      home: true,
      influence: 2,
      id: "Ylir Keleres",
      name: intl.formatMessage({
        id: "Planets.Ylir.Name",
        description: "Name of Planet: Ylir",
        defaultMessage: "Ylir",
      }),
      position: TOP_RIGHT,
      resources: 0,
      subFaction: "Argent Flight",
      system: 201,
      types: [],
    },
  };
}
