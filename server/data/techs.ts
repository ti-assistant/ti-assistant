import { IntlShape } from "react-intl";
import getBaseTechs from "./base/techs";
import getCodexThreeTechs from "./codexthree/techs";
import { DISCORDANT_STARS_TECHS } from "./discordantstars/techs";
import getProphecyOfKingsTechs from "./prophecyofkings/techs";

export function getTechs(intl: IntlShape): Record<TechId, BaseTech> {
  return {
    ...getBaseTechs(intl),
    ...getProphecyOfKingsTechs(intl),
    ...getCodexThreeTechs(intl),
    ...DISCORDANT_STARS_TECHS,
  };
}
