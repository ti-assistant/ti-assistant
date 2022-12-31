import { getOnDeckFaction } from '../helpers';
import { fetcher, poster } from './util'

export function setSpeaker(mutate, gameid, state, speaker, factions) {
  const data = {
    action: "SET_SPEAKER",
    speaker: speaker,
  };

  const updatedState = {...state};
  updatedState.speaker = speaker;

  const options = {
    optimisticData: updatedState,
  };

  mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);

  const currentOrder = factions[speaker].order;

  const updatedFactions = {...factions};
  
  Object.entries(updatedFactions).forEach(([name, faction]) => {
    let factionOrder = faction.order - currentOrder + 1;
    if (factionOrder < 1) {
      factionOrder += Object.keys(updatedFactions).length;
    }
    updatedFactions[name].order = factionOrder;
  });

  const opts = {
    optimisticData: updatedFactions,
  };

  mutate(`/api/${gameid}/factions`, fetcher(`/api/${gameid}/factions`), opts);
}

export async function nextPlayer(mutate, gameid, state, factions, strategyCards) {
  const data = {
    action: "ADVANCE_PLAYER",
  };
  
  const updatedState = {...state};
  const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
  state.activeplayer = onDeckFaction ? onDeckFaction.name : "None";

  const options = {
    optimisticData: updatedState,
  };
  return mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
}