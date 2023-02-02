import { getOnDeckFaction } from '../helpers';
import { fetcher, poster } from './util'

export function setSpeaker(mutate, gameid, speaker, factions) {
  const data = {
    action: "SET_SPEAKER",
    speaker: speaker,
  };

  mutate(`/api/${gameid}/state`, async () => await poster(`/api/${gameid}/stateUpdate`, data), {
    optimisticData: state => {
      const updatedState = structuredClone(state);

      updatedState.speaker = speaker;

      return updatedState;
    },
    revalidate: false,
  });

  const currentOrder = factions[speaker].order;

  // TODO: Consider whether there's a better option.
  // Maybe split the backend changes to have separate updates?
  mutate(`/api/${gameid}/factions`, factions => {
    const updatedFactions = structuredClone(factions);

    const numFactions = Object.keys(factions).length;
  
    for (const name of Object.keys(factions)) {
      let factionOrder = updatedFactions[name].order - currentOrder + 1;
      if (factionOrder < 1) {
        factionOrder += numFactions;
      }
      updatedFactions[name].order = factionOrder;
    }

    return updatedFactions;
  }, {
    revalidate: false,
  });
}

export async function nextPlayer(mutate, gameid, factions, strategyCards) {
  const data = {
    action: "ADVANCE_PLAYER",
  };

  mutate(`/api/${gameid}/state`, async () => await poster(`/api/${gameid}/stateUpdate`, data), {
    optimisticData: state => {
      const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
      return {
        ...structuredClone(state),
        activeplayer: onDeckFaction ? onDeckFaction.name : "None",
      };
    },
    revalidate: false,
  });
}

export async function finishGame(mutate, gameid) {
  const data = {
    action: "END_GAME",
  };

  mutate(`/api/${gameid}/state`, async () => await poster(`/api/${gameid}/stateUpdate`, data), {
    optimisticData: state => {
      const updatedState = structuredClone(state);

      updatedState.phase = "END";

      return updatedState;
    },
    revalidate: false,
  });
}

export async function continueGame(mutate, gameid) {
  const data = {
    action: "CONTINUE_GAME",
  };

  mutate(`/api/${gameid}/state`, async () => await poster(`/api/${gameid}/stateUpdate`, data), {
    optimisticData: state => {
      const updatedState = structuredClone(state);


      return updatedState;
    },
    revalidate: false,
  });
}

export async function setAgendaNum(mutate, gameid, agendaNum) {
  const data = {
    action: "SET_AGENDA_NUM",
    agendaNum: agendaNum,
  };

  mutate(`/api/${gameid}/state`, async () => await poster(`/api/${gameid}/stateUpdate`, data), {
    optimisticData: state => {
      const updatedState = structuredClone(state);

      updatedState.agendaNum = agendaNum;

      return updatedState;
    },
    revalidate: false,
  });
}