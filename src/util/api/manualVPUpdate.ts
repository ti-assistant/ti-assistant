import { ManualCCUpdateHandler } from "../model/manualCCUpdate";
import { ManualVoteUpdateHandler } from "../model/manualVoteUpdate";
import { ManualVPUpdateHandler } from "../model/manualVPUpdate";
import dataUpdate from "./dataUpdate";

export function manualCCUpdate(
  gameId: string,
  faction: FactionId,
  commandCounters: number,
) {
  const data: GameUpdateData = {
    action: "MANUAL_CC_UPDATE",
    event: {
      faction,
      commandCounters,
    },
  };

  return dataUpdate(gameId, data, ManualCCUpdateHandler);
}

export function manualVPUpdate(
  gameId: string,
  faction: FactionId,
  vps: number,
) {
  const data: GameUpdateData = {
    action: "MANUAL_VP_UPDATE",
    event: {
      faction,
      vps,
    },
  };

  return dataUpdate(gameId, data, ManualVPUpdateHandler);
}

export function manualVoteUpdate(
  gameId: string,
  faction: FactionId,
  votes: number,
) {
  const data: GameUpdateData = {
    action: "MANUAL_VOTE_UPDATE",
    event: {
      faction,
      votes,
    },
  };

  return dataUpdate(gameId, data, ManualVoteUpdateHandler);
}
