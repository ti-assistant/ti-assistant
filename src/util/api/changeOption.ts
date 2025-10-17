import { DataStore } from "../../context/dataStore";
import { poster } from "./util";

interface ChangeOptionData {
  option: string;
  value: any;
}

export function changeOption(gameId: string, option: string, value: any) {
  const data: ChangeOptionData = {
    option,
    value,
  };

  const now = Date.now();

  const updatePromise = poster(`/api/${gameId}/changeOption`, data, now);

  DataStore.update((storedGameData) => {
    storedGameData.options[option] = value;
    if (storedGameData.timers) {
      storedGameData.timers.paused = false;
    }

    return storedGameData;
  }, "CLIENT");

  return updatePromise.catch((_) => {
    DataStore.reset();
  });
}
