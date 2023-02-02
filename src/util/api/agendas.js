import { poster } from './util'

export function createResolvedAgenda(agendaName, target) {
  const updatedAgenda = {};
  updatedAgenda.passed = (target !== "Against");
  updatedAgenda.resolved = true;
  updatedAgenda.target = target;

  return updatedAgenda;
}

export function resolveAgenda(mutate, gameid, agendaName, target) {
  const data = {
    action: "RESOLVE_AGENDA",
    agenda: agendaName,
    target: target,
  };

  mutate(`/api/${gameid}/agendas`, async () => await poster(`/api/${gameid}/agendaUpdate`, data), {
    optimisticData: agendas => {
      const updatedAgendas = structuredClone(agendas);
      updatedAgendas[agendaName] = {...updatedAgendas[agendaName], ...createResolvedAgenda(agendaName, target)};
      return updatedAgendas;
    },
    revalidate: false,
  });
}

export function repealAgenda(mutate, gameid, agendaName) {
  const data = {
    action: "REPEAL_AGENDA",
    agenda: agendaName,
  };

  mutate(`/api/${gameid}/agendas`, async () => await poster(`/api/${gameid}/agendaUpdate`, data), {
    optimisticData: agendas => {
      const updatedAgendas = structuredClone(agendas);
      delete updatedAgendas[agendaName].passed;
      delete updatedAgendas[agendaName].target;
      return updatedAgendas;
    },
    revalidate: false,
  });
}