import {
  RepealAgendaHandler,
  ResolveAgendaHandler,
} from "../model/resolveAgenda";
import dataUpdate from "./dataUpdate";

export function resolveAgenda(
  gameId: string,
  agenda: AgendaId,
  target: string
) {
  const data: GameUpdateData = {
    action: "RESOLVE_AGENDA",
    event: {
      agenda,
      target,
    },
  };

  return dataUpdate(gameId, data, ResolveAgendaHandler);
}

export function repealAgenda(gameId: string, agenda: AgendaId, target: string) {
  const data: GameUpdateData = {
    action: "REPEAL_AGENDA",
    event: {
      agenda,
      target,
    },
  };

  return dataUpdate(gameId, data, RepealAgendaHandler);
}
