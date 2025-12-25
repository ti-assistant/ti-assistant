import { IntlShape } from "react-intl";
import getTwilightsFallParadigms, {
  TFParadigmId,
} from "./twilightsfall/paradigms";

export function getParadigms(
  intl: IntlShape
): Record<TFParadigmId, TFBaseParadigm> {
  return {
    ...getTwilightsFallParadigms(intl),
  };
}
