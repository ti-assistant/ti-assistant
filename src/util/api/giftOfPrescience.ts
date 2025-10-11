import { GiftOfPrescienceHandler } from "../model/giftOfPrescience";
import dataUpdate from "./dataUpdate";

export function giftOfPrescience(gameId: string, faction: FactionId) {
  const data: GameUpdateData = {
    action: "GIFT_OF_PRESCIENCE",
    event: {
      faction,
    },
  };

  return dataUpdate(gameId, data, GiftOfPrescienceHandler);
}
