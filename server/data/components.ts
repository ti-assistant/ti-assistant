import { IntlShape } from "react-intl";
import getBaseComponents from "./base/components";
import getCodexFourComponents from "./codexfour/components";
import getCodexOneComponents from "./codexone/components";
import { DISCORDANT_STARS_COMPONENTS } from "./discordantstars/components";
import getProphecyOfKingsComponents from "./prophecyofkings/components";

export function getComponents(
  intl: IntlShape
): Record<ComponentId, BaseComponent | BaseTechComponent> {
  return {
    ...getBaseComponents(intl),
    ...getProphecyOfKingsComponents(intl),
    ...getCodexOneComponents(intl),
    ...getCodexFourComponents(intl),
    ...DISCORDANT_STARS_COMPONENTS,
  };
}
