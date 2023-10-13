import { mutate } from "swr";
import { poster } from "./util";
import { BASE_GAME_DATA } from "../../../server/data/data";

interface ChangeOptionData {
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
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        currentData.options[option] = value;

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}
