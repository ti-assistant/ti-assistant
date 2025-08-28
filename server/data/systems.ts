import getBaseSystems from "./base/systems";
import getCodexThreeSystems from "./codexthree/systems";
import { DISCORDANT_STARS_SYSTEMS } from "./discordantstars/systems";
import getProphecyOfKingsSystems from "./prophecyofkings/systems";
import getThundersEdgeSystems from "./thundersedge/systems";

export function getSystems(): Record<SystemId, BaseSystem> {
  return {
    ...getBaseSystems(),
    ...getProphecyOfKingsSystems(),
    ...getCodexThreeSystems(),
    ...getThundersEdgeSystems(),
    ...DISCORDANT_STARS_SYSTEMS,
  };
}
