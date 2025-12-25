import { IntlShape } from "react-intl";
import getTwilightsFallAbilities, {
  TFAbilityId,
} from "./twilightsfall/abilities";

export function getAbilities(
  intl: IntlShape
): Record<TFAbilityId, TFBaseAbility> {
  return {
    ...getTwilightsFallAbilities(intl),
  };
}
