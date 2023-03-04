import { mutate } from "swr";
import { poster } from "./util";

export type Expansion =
  | "BASE"
  | "POK"
  | "CODEX ONE"
  | "CODEX TWO"
  | "CODEX THREE"
  | "BASE ONLY";

export type OptionUpdateAction = "SET_OPTION";

export interface OptionUpdateData {
  action?: OptionUpdateAction;
  option?: string;
  timestamp?: number;
  value?: any;
}

export interface Options {
  expansions: Expansion[];
  "map-string"?: string;
  [key: string]: any;
}

export async function updateOption(
  gameId: string,
  optionName: string,
  value: any
) {
  const data: OptionUpdateData = {
    action: "SET_OPTION",
    option: optionName,
    value: value,
  };

  mutate(
    `/api/${gameId}/options`,
    async () => await poster(`/api/${gameId}/optionUpdate`, data),
    {
      optimisticData: (options: Options) => {
        const updatedOptions = structuredClone(options);

        updatedOptions[optionName] = value;

        return updatedOptions;
      },
      revalidate: false,
    }
  );
}
