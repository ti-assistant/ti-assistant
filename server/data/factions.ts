import { IntlShape } from "react-intl";
import getBaseFactions from "./base/factions";
import getCodexThreeFactions from "./codexthree/factions";
import { DISCORDANT_STARS_FACTIONS } from "./discordantstars/factions";
import getProphecyOfKingsFactions from "./prophecyofkings/factions";

export function getFactions(intl: IntlShape): Record<FactionId, BaseFaction> {
  return {
    ...getBaseFactions(intl),
    ...getProphecyOfKingsFactions(intl),
    ...getCodexThreeFactions(intl),
    ...DISCORDANT_STARS_FACTIONS,
  };
}
