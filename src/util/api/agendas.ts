import { poster } from "./util";
import { mutate } from "swr";

import { Expansion } from "./options";
import { resolveAgendaRepeal } from "../../main/AgendaPhase";

export type OutcomeType =
  | "For/Against"
  | "Planet"
  | "Cultural Planet"
  | "Hazardous Planet"
  | "Industrial Planet"
  | "Player"
  | "Strategy Card"
  | "Law"
  | "Scored Secret Objective"
  | "Non-Home Planet Other Than Mecatol Rex"
  | "???";

export type AgendaType = "LAW" | "DIRECTIVE";

export type AgendaUpdateAction = "RESOLVE_AGENDA" | "REPEAL_AGENDA";

export interface AgendaUpdateData {
  action?: AgendaUpdateAction;
  agenda?: string;
  target?: string;
  timestamp?: number;
}

export interface BaseAgenda {
  description: string;
  elect: OutcomeType;
  expansion: Expansion;
  name: string;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  passedText?: string;
  failedText?: string;
  type: AgendaType;
}

export interface GameAgenda {
  activeRound?: number;
  name?: string;
  passed?: boolean;
  resolved?: boolean;
  target?: string;
}

export type Agenda = BaseAgenda & GameAgenda;

export function resolveAgenda(
  gameid: string,
  agendaName: string,
  target: string
) {
  const data: AgendaUpdateData = {
    action: "RESOLVE_AGENDA",
    agenda: agendaName,
    target: target,
  };

  mutate(
    `/api/${gameid}/agendas`,
    async () => await poster(`/api/${gameid}/agendaUpdate`, data),
    {
      optimisticData: (agendas: Record<string, Agenda>) => {
        const updatedAgendas = structuredClone(agendas);

        const agenda = updatedAgendas[agendaName];

        if (!agenda) {
          return updatedAgendas;
        }

        agenda.passed = target !== "Against";
        agenda.resolved = true;
        agenda.target = target;

        return updatedAgendas;
      },
      revalidate: false,
    }
  );
}

export function repealAgenda(gameid: string, agenda: Agenda | undefined) {
  if (!agenda) {
    return;
  }
  resolveAgendaRepeal(gameid, agenda);

  const data: AgendaUpdateData = {
    action: "REPEAL_AGENDA",
    agenda: agenda.name,
  };

  mutate(
    `/api/${gameid}/agendas`,
    async () => await poster(`/api/${gameid}/agendaUpdate`, data),
    {
      optimisticData: (agendas: Record<string, Agenda>) => {
        const updatedAgendas = structuredClone(agendas);

        const updatedAgenda = updatedAgendas[agenda.name];

        if (!updatedAgenda) {
          return updatedAgendas;
        }

        delete updatedAgenda.passed;
        delete updatedAgenda.target;

        return updatedAgendas;
      },
      revalidate: false,
    }
  );
}
