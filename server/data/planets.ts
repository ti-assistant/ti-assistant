import { IntlShape } from "react-intl";
import getBasePlanets from "./base/planets";
import getCodexThreePlanets from "./codexthree/planets";
import { DISCORDANT_STARS_PLANETS } from "./discordantstars/planets";
import getProphecyOfKingsPlanets from "./prophecyofkings/planets";
import getThundersEdgePlanets from "./thundersedge/planets";

export function getPlanets(intl: IntlShape): Record<PlanetId, BasePlanet> {
  return {
    ...getBasePlanets(intl),
    ...getProphecyOfKingsPlanets(intl),
    ...getCodexThreePlanets(intl),
    ...getThundersEdgePlanets(intl),
    ...DISCORDANT_STARS_PLANETS,
  };
}
