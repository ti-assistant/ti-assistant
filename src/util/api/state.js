import { fetcher, poster } from './util'

export function setSpeaker(mutate, setUpdateTime, gameid, state, speaker, factions) {
  const data = {
    action: "SET_SPEAKER",
    speaker: speaker,
  };

  const updatedState = {...state};
  state.speaker = speaker;

  const options = {
    optimisticData: updatedState,
  };

  mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data, setUpdateTime), options);

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

export function saveGameTimer(mutate, setUpdateTime, gameid, state, timer) {
  const data = {
    action: "SET_GAME_TIMER",
    timer: timer,
  };

  const updatedState = {...state};
  state.timer = timer;

  const options = {
    optimisticData: updatedState,
  };

  mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data, setUpdateTime), options);
}