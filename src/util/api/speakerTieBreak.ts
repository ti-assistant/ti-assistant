import { SpeakerTieBreakHandler } from "../model/speakerTieBreak";
import dataUpdate from "./dataUpdate";

export function speakerTieBreak(gameId: string, tieBreak: string) {
  const data: GameUpdateData = {
    action: "SPEAKER_TIE_BREAK",
    event: {
      tieBreak,
    },
  };

  return dataUpdate(gameId, data, SpeakerTieBreakHandler);
}
