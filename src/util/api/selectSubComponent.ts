import { SelectSubComponentHandler } from "../model/selectSubComponent";
import dataUpdate from "./dataUpdate";

export function selectSubComponent(gameId: string, subComponent: string) {
  const data: GameUpdateData = {
    action: "SELECT_SUB_COMPONENT",
    event: {
      subComponent,
    },
  };

  return dataUpdate(gameId, data, SelectSubComponentHandler);
}
