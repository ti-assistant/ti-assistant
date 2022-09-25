import { poster } from './util'

export function setSpeaker(mutate, gameid, state, speaker) {
  const data = {
    action: "SET_SPEAKER",
    speaker: speaker,
  };

  const updatedState = {...state};
  updatedState.state.speaker = speaker;

  const options = {
    optimisticData: updatedState,
  };

  mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
}