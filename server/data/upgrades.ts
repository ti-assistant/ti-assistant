import { IntlShape } from "react-intl";
import getTwilightsFallUnitUpgrades, {
  TFUnitUpgradeId,
} from "./twilightsfall/unitUpgrades";

export function getUnitUpgrades(
  intl: IntlShape
): Record<TFUnitUpgradeId, TFBaseUnitUpgrade> {
  return {
    ...getTwilightsFallUnitUpgrades(intl),
  };
}
