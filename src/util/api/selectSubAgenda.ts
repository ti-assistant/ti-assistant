import { SelectSubAgendaHandler } from "../model/selectSubAgenda";
import dataUpdate from "./dataUpdate";

export function selectSubAgenda(gameId: string, subAgenda: AgendaId | "None") {
  const data: GameUpdateData = {
    action: "SELECT_SUB_AGENDA",
    event: {
      subAgenda,
    },
  };

  return dataUpdate(gameId, data, SelectSubAgendaHandler);
}
