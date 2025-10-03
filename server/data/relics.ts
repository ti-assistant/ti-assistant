import { IntlShape } from "react-intl";
import getCodexFourRelics from "./codexfour/relics";
import getCodexTwoRelics from "./codextwo/relics";
import getDiscordantStarsRelics from "./discordantstars/relics";
import getProphecyOfKingsRelics from "./prophecyofkings/relics";
import getThundersEdgeRelics from "./thundersedge/relics";

export function getRelics(intl: IntlShape): Record<RelicId, BaseRelic> {
  return {
    ...getProphecyOfKingsRelics(intl),
    ...getCodexTwoRelics(intl),
    ...getCodexFourRelics(intl),
    ...getThundersEdgeRelics(intl),
    ...getDiscordantStarsRelics(intl),
  };
}
