import { IntlShape } from "react-intl";

const HOME_MIDDLE = { x: 0, y: -12 };
const MIDDLE = { x: 0, y: 0 };
const TOP_LEFT = { x: -22, y: -36 };
const HOME_BOTTOM_RIGHT = { x: 30, y: 32 };
const BOTTOM_RIGHT = { x: 18, y: 32 };
const MIDDLE_LEFT = { x: -48, y: -8 };
const TOP_RIGHT = { x: 22, y: -38 };
const FAR_BOTTOM_RIGHT = { x: 28, y: 42 };

export default function getThundersEdgePlanets(
  intl: IntlShape
): Record<ThundersEdge.PlanetId, BasePlanet> {
  return {
    Cocytus: {
      attributes: ["relic"],
      expansion: "THUNDERS EDGE",
      influence: 0,
      id: "Cocytus",
      name: "Cocytus",
      position: MIDDLE,
      resources: 3,
      type: "NONE",
    },
    Lethe: {
      attributes: ["relic"],
      expansion: "THUNDERS EDGE",
      influence: 2,
      id: "Lethe",
      name: "Lethe",
      position: TOP_LEFT,
      resources: 0,
      type: "NONE",
    },
    Phlegethon: {
      attributes: ["relic"],
      expansion: "THUNDERS EDGE",
      influence: 2,
      id: "Phlegethon",
      name: "Phlegethon",
      position: BOTTOM_RIGHT,
      resources: 1,
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
      attributes: ["legendary", "relic"],
      expansion: "THUNDERS EDGE",
      influence: 0,
      id: "Styx",
      name: "Styx",
      position: MIDDLE,
      resources: 4,
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
