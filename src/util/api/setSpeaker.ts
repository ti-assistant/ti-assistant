import { SetSpeakerHandler } from "../model/setSpeaker";
import { SetTyrantHandler } from "../model/setTyrant";
import { Optional } from "../types/types";
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

export function setTyrant(gameId: string, newTyrant: Optional<FactionId>) {
  const data: GameUpdateData = {
    action: "SET_TYRANT",
    event: {
      newTyrant,
    },
  };

  return dataUpdate(gameId, data, SetTyrantHandler);
}
