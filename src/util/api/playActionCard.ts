import {
  PlayActionCardHandler,
  UnplayActionCardHandler,
} from "../model/playActionCard";
import dataUpdate from "./dataUpdate";

export function playActionCard(
  gameId: string,
  card: string,
  target: FactionId | "None"
) {
  const data: GameUpdateData = {
    action: "PLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };

  return dataUpdate(gameId, data, PlayActionCardHandler);
}

export function unplayActionCard(
  gameId: string,
  card: string,
  target: FactionId | "None"
) {
  const data: GameUpdateData = {
    action: "UNPLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };

  return dataUpdate(gameId, data, UnplayActionCardHandler);
}
