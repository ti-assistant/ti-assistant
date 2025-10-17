import { ManualVPUpdateHandler } from "../model/manualVPUpdate";
import dataUpdate from "./dataUpdate";

export function manualVPUpdate(
  gameId: string,
  faction: FactionId,
  vps: number
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
