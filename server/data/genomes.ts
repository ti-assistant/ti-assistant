import { IntlShape } from "react-intl";
import getTwilightsFallGenomes, { TFGenomeId } from "./twilightsfall/genomes";

export function getGenomes(intl: IntlShape): Record<TFGenomeId, TFBaseGenome> {
  return {
    ...getTwilightsFallGenomes(intl),
  };
}
