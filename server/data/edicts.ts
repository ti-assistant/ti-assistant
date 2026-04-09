import { IntlShape } from "react-intl";
import getTwilightsFallEdicts from "./twilightsfall/edicts";

export function getEdicts(intl: IntlShape): Record<TFEdictId, TFBaseEdict> {
  return {
    ...getTwilightsFallEdicts(intl),
  };
}
