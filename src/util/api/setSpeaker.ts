import { SetSpeakerHandler } from "../model/setSpeaker";
import dataUpdate from "./dataUpdate";

export function setSpeaker(gameId: string, newSpeaker: FactionId) {
  const data: GameUpdateData = {
    action: "SET_SPEAKER",
    event: {
      newSpeaker,
    },
  };

  return dataUpdate(gameId, data, SetSpeakerHandler);
}
