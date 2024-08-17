import DataManager from "../../context/DataManager";
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

  DataManager.update((storedGameData) => {
    storedGameData.options[option] = value;
    storedGameData.lastUpdate = now;

    return storedGameData;
  });

  return updatePromise;
}
