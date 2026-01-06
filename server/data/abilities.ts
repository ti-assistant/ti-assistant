import { IntlShape } from "react-intl";
import getTwilightsFallAbilities from "./twilightsfall/abilities";

export function getAbilities(
  intl: IntlShape
): Record<TFAbilityId, TFBaseAbility> {
  return {
    ...getTwilightsFallAbilities(intl),
  };
}
