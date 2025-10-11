import { HideAgendaHandler, RevealAgendaHandler } from "../model/revealAgenda";
import dataUpdate from "./dataUpdate";

export function revealAgenda(gameId: string, agenda: AgendaId) {
  const data: GameUpdateData = {
    action: "REVEAL_AGENDA",
    event: {
      agenda,
    },
  };

  return dataUpdate(gameId, data, RevealAgendaHandler);
}

export function hideAgenda(gameId: string, agenda: AgendaId, veto?: boolean) {
  const data: GameUpdateData = {
    action: "HIDE_AGENDA",
    event: {
      agenda,
      veto,
    },
  };

  return dataUpdate(gameId, data, HideAgendaHandler);
}
