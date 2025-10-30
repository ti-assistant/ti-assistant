import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import {
  getNewSpeakerEventFromLog,
  getSelectedActionFromLog,
} from "../util/api/data";
import { ActionLog, Optional } from "../util/types/types";
import { useMemoizedGameDataValue } from "./dataHooks";

export function useSelectedAction() {
  return useMemoizedGameDataValue<ActionLog, Optional<Action>>(
    "actionLog",
    undefined,
    (log) => getSelectedActionFromLog(getCurrentTurnLogEntries(log))
  );
}

export function useNewSpeaker() {
  return useMemoizedGameDataValue<ActionLog, Optional<FactionId>>(
    "actionLog",
    undefined,
    (log) =>
      getNewSpeakerEventFromLog(getCurrentTurnLogEntries(log))?.newSpeaker
  );
}
