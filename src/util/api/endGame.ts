import { ContinueGameHandler, EndGameHandler } from "../model/endGame";
import dataUpdate from "./dataUpdate";

export function endGame(gameId: string) {
  const data: GameUpdateData = {
    action: "END_GAME",
    event: {},
  };

  return dataUpdate(gameId, data, EndGameHandler);
}

export function continueGame(gameId: string) {
  const data: GameUpdateData = {
    action: "CONTINUE_GAME",
    event: {},
  };

  return dataUpdate(gameId, data, ContinueGameHandler);
}
