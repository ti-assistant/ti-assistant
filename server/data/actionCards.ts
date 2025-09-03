import { IntlShape } from "react-intl";
import getBaseActionCards from "./base/actionCards";
import getCodexOneActionCards from "./codexone/actionCards";
import getProphecyOfKingsActionCards from "./prophecyofkings/actionCards";
import getDiscordantStarsActionCards from "./discordantstars/actionCards";

export function getActionCards(
  intl: IntlShape
): Record<ActionCardId, BaseActionCard> {
  return {
    ...getBaseActionCards(intl),
    ...getCodexOneActionCards(intl),
    ...getProphecyOfKingsActionCards(intl),
    ...getDiscordantStarsActionCards(intl),
  };
}
