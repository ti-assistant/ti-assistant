import { use } from "react";
import { DatabaseFnsContext } from "../../context/contexts";
import { poster } from "./util";

interface EnterPasswordData {
  password: string;
}

export function useEnterPassword() {
  const databaseFns = use(DatabaseFnsContext);
  return async (gameId: string, password: string) => {
    const data: EnterPasswordData = {
      password,
    };

    const now = Date.now();
    const gameTime: number = databaseFns.getValue("timers.game") ?? 0;

    const updatePromise = poster(
      `/api/${gameId}/enterPassword`,
      data,
      now,
      gameTime,
    );

    try {
      const success = await updatePromise;
      databaseFns.setViewOnly(false);
      return success;
    } catch (_) {
      databaseFns.reset();
    }
  };
}
