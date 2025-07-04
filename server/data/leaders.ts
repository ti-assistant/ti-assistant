// NOTE: Currently only has leaders that get used as component actions.

import { IntlShape } from "react-intl";
import getCodexThreeLeaders from "./codexthree/leaders";
import { DISCORDANT_STARS_LEADERS } from "./discordantstars/leaders";
import getProphecyOfKingsLeaders from "./prophecyofkings/leaders";

export function getLeaders(intl: IntlShape): Record<LeaderId, BaseLeader> {
  return {
    ...getProphecyOfKingsLeaders(intl),
    ...getCodexThreeLeaders(intl),
    ...DISCORDANT_STARS_LEADERS,
  };
}
