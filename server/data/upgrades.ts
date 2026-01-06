import { IntlShape } from "react-intl";
import getTwilightsFallUnitUpgrades from "./twilightsfall/unitUpgrades";

export function getUnitUpgrades(
  intl: IntlShape
): Record<TFUnitUpgradeId, TFBaseUnitUpgrade> {
  return {
    ...getTwilightsFallUnitUpgrades(intl),
  };
}
