import {
  PlayPromissoryNoteHandler,
  UnplayPromissoryNoteHandler,
} from "../model/playPromissoryNote";
import dataUpdate from "./dataUpdate";

export function playPromissoryNote(
  gameId: string,
  card: string,
  target: FactionId
) {
  const data: GameUpdateData = {
    action: "PLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
    },
  };

  return dataUpdate(gameId, data, PlayPromissoryNoteHandler);
}

export function unplayPromissoryNote(
  gameId: string,
  card: string,
  target: FactionId
) {
  const data: GameUpdateData = {
    action: "UNPLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
    },
  };

  return dataUpdate(gameId, data, UnplayPromissoryNoteHandler);
}
