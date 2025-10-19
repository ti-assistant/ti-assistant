import { IntlShape } from "react-intl";
import getBaseStrategyCards from "./base/strategycards";
import getTwilightsFallStrategyCards from "./twilightsfall/strategyCards";

export function getStrategyCards(
  intl: IntlShape
): Record<StrategyCardId, BaseStrategyCard> {
  return {
    ...getBaseStrategyCards(intl),
    ...getTwilightsFallStrategyCards(intl),
  };
}
