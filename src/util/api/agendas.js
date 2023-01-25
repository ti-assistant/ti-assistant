import { fetcher, poster } from './util'

export function createResolvedAgenda(agendaName, target) {
  const updatedAgenda = {};
  updatedAgenda.passed = (target !== "Against");
  updatedAgenda.resolved = true;
  updatedAgenda.target = target;

  return updatedAgenda;
}

export function resolveAgenda(mutate, gameid, agendas, agendaName, target) {
  const data = {
    action: "RESOLVE_AGENDA",
    agenda: agendaName,
    target: target,
  };

  const updatedAgendas = {...agendas};

  updatedAgendas[agendaName] = {...agendas[agendaName], ...createResolvedAgenda(agendaName, target)};

  const options = {
    optimisticData: updatedAgendas,
  };

  mutate(`/api/${gameid}/agendas`, poster(`/api/${gameid}/agendaUpdate`, data), options);
}

export function repealAgenda(mutate, gameid, agendas, agendaName) {
  const data = {
    action: "REPEAL_AGENDA",
    agenda: agendaName,
  };

  const updatedAgendas = {...agendas};

  delete updatedAgendas[agendaName].passed;
  delete updatedAgendas[agendaName].target;
  
  const options = {
    optimisticData: updatedAgendas,
  };

  mutate(`/api/${gameid}/agendas`, poster(`/api/${gameid}/agendaUpdate`, data), options);
}