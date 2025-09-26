import { IntlShape } from "react-intl";

const HOME_MIDDLE = { x: 0, y: -12 };
const MIDDLE = { x: 0, y: 0 };
const TOP_LEFT = { x: -22, y: -36 };
const HOME_BOTTOM_RIGHT = { x: 30, y: 32 };
const BOTTOM_RIGHT = { x: 18, y: 32 };
const MIDDLE_LEFT = { x: -48, y: -8 };
const TOP_RIGHT = { x: 22, y: -38 };
const FAR_BOTTOM_RIGHT = { x: 28, y: 42 };
const FRACTURE_MID = { x: 0, y: -16 };

export default function getThundersEdgePlanets(
  intl: IntlShape
): Record<ThundersEdge.PlanetId, BasePlanet> {
  return {
    Ikatena: {
      attributes: [],
      expansion: "THUNDERS EDGE",
      faction: "Deepwrought Scholarate",
      home: true,
      influence: 4,
      id: "Ikatena",
      name: "Ikatena",
      position: HOME_MIDDLE,
      resources: 4,
      // TODO: Add system.
      type: "NONE",
    },
    Cocytus: {
      alwaysInclude: true,
      attributes: ["relic"],
      expansion: "THUNDERS EDGE",
      influence: 0,
      id: "Cocytus",
      name: "Cocytus",
      position: { x: -43, y: 25 },
      resources: 3,
      system: 666,
      type: "NONE",
    },
    Lethe: {
      alwaysInclude: true,
      attributes: ["relic"],
      expansion: "THUNDERS EDGE",
      influence: 2,
      id: "Lethe",
      name: "Lethe",
      position: { x: 34, y: 6 },
      resources: 0,
      system: 668,
      type: "NONE",
    },
    Phlegethon: {
      alwaysInclude: true,
      attributes: ["relic"],
      expansion: "THUNDERS EDGE",
      influence: 2,
      id: "Phlegethon",
      name: "Phlegethon",
      position: { x: 54, y: 44 },
      resources: 1,
      system: 668,
      type: "NONE",
    },
    Styx: {
      ability: intl.formatMessage(
        {
          id: "Planets.Styx.Ability",
          description: "Planet Ability for Styx",
          defaultMessage:
            "When you gain this card, gain 1 victory point.{br}When you lose this card, lose 1 victory point.",
        },
        { br: "\n\n" }
      ),
      alwaysInclude: true,
      attributes: ["legendary", "relic"],
      expansion: "THUNDERS EDGE",
      influence: 0,
      id: "Styx",
      name: "Styx",
      position: { x: 0, y: -16 },
      resources: 4,
      system: 667,
      type: "NONE",
    },
    "Thunder's Edge": {
      ability: intl.formatMessage(
        {
          id: "Planets.Thunder's Edge.Ability",
          description: "Planet Ability for Thunder's Edge",
          defaultMessage:
            "Gain your breakthrough when you gain this card if you do not already have it.{br}You may exhaust this card at the end of your turn to perform an action.",
        },
        { br: "\n\n" }
      ),
      alwaysInclude: true,
      attributes: ["legendary"],
      expansion: "THUNDERS EDGE",
      influence: 1,
      id: "Thunder's Edge",
      name: "Thunder's Edge",
      position: MIDDLE,
      resources: 5,
      type: "NONE",
    },
  };
}
