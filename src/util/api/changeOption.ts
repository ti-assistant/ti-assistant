import { mutate } from "swr";
import { poster, StoredGameData } from "./util";

export interface ChangeOptionData {
  option: string;
  value: any;
}

export function changeOption(gameId: string, option: string, value: any) {
  const data: ChangeOptionData = {
    option,
    value,
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/changeOption`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        storedGameData.options[option] = value;

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}
