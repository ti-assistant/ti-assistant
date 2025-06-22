import { IntlShape } from "react-intl";
import getCodexFourRelics from "./codexfour/relics";
import getCodexTwoRelics from "./codextwo/relics";
import getDiscordantStarsRelics from "./discordantstars/relics";
import getProphecyOfKingsRelics from "./prophecyofkings/relics";

export function getBaseRelics(intl: IntlShape): Record<RelicId, BaseRelic> {
  return {
    ...getProphecyOfKingsRelics(intl),
    ...getCodexTwoRelics(intl),
    ...getCodexFourRelics(intl),
    ...getDiscordantStarsRelics(intl),
  };
}
