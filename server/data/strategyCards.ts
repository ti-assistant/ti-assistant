import { IntlShape } from "react-intl";
import getBaseStrategyCards from "./base/strategycards";

export function getStrategyCards(
  intl: IntlShape
): Record<StrategyCardId, BaseStrategyCard> {
  return { ...getBaseStrategyCards(intl) };
}
