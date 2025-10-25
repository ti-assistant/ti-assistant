import { getClaimedPlanets } from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { ActionLog } from "../util/types/types";
import { useMemoizedGameDataValue } from "./dataHooks";

export function useClaimedPlanetEvents(factionId: FactionId) {
  return useMemoizedGameDataValue<ActionLog, ClaimPlanetEvent[]>(
    "actionLog",
    [],
    (log) => getClaimedPlanets(getCurrentTurnLogEntries(log), factionId)
  );
}
