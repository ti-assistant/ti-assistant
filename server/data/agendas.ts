import { IntlShape } from "react-intl";
import getBaseAgendas from "./base/agendas";
import getProphecyOfKingsAgendas from "./prophecyofkings/agendas";

export function getAgendas(intl: IntlShape): Record<AgendaId, BaseAgenda> {
  return {
    ...getBaseAgendas(intl),
    ...getProphecyOfKingsAgendas(intl),
  };
}
