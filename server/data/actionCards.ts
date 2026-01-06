import { IntlShape } from "react-intl";
import getBaseActionCards from "./base/actionCards";
import getCodexOneActionCards from "./codexone/actionCards";
import getDiscordantStarsActionCards from "./discordantstars/actionCards";
import getProphecyOfKingsActionCards from "./prophecyofkings/actionCards";
import getThundersEdgeActionCards from "./thundersedge/actionCards";
import getTwilightsFallActionCards from "./twilightsfall/actionCards";

export function getActionCards(
  intl: IntlShape
): Record<ActionCardId, BaseActionCard> {
  return {
    ...getBaseActionCards(intl),
    ...getCodexOneActionCards(intl),
    ...getProphecyOfKingsActionCards(intl),
    ...getThundersEdgeActionCards(intl),
    ...getTwilightsFallActionCards(intl),
    ...getDiscordantStarsActionCards(intl),
  };
}
