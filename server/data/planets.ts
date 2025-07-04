import { IntlShape } from "react-intl";
import getBasePlanets from "./base/planets";
import getCodexThreePlanets from "./codexthree/planets";
import { DISCORDANT_STARS_PLANETS } from "./discordantstars/planets";
import getProphecyOfKingsPlanets from "./prophecyofkings/planets";

export function getPlanets(intl: IntlShape): Record<PlanetId, BasePlanet> {
  return {
    ...getBasePlanets(intl),
    ...getProphecyOfKingsPlanets(intl),
    ...getCodexThreePlanets(intl),
    ...DISCORDANT_STARS_PLANETS,
  };
}
