import { IntlShape } from "react-intl";
import getTwilightsFallParadigms from "./twilightsfall/paradigms";

export function getParadigms(
  intl: IntlShape
): Record<TFParadigmId, TFBaseParadigm> {
  return {
    ...getTwilightsFallParadigms(intl),
  };
}
