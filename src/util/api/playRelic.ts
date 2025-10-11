import { PlayRelicHandler, UnplayRelicHandler } from "../model/playRelic";
import dataUpdate from "./dataUpdate";

export function playRelic(gameId: string, event: PlayRelicEvent) {
  const data: GameUpdateData = {
    action: "PLAY_RELIC",
    event,
  };

  return dataUpdate(gameId, data, PlayRelicHandler);
}

export function unplayRelic(gameId: string, event: PlayRelicEvent) {
  const data: GameUpdateData = {
    action: "UNPLAY_RELIC",
    event,
  };

  return dataUpdate(gameId, data, UnplayRelicHandler);
}
