import { DataStore } from "../../context/dataStore";
import { poster } from "./util";

interface EnterPasswordData {
  password: string;
}

export function enterPassword(gameId: string, password: string) {
  const data: EnterPasswordData = {
    password,
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/enterPassword`, data, now);

  return updatePromise
    .then((_) => {
      DataStore.setViewOnly(false);
    })
    .catch((error) => {
      DataStore.reset();
    });
}
