import { setSpeaker } from './state';
import { fetcher, poster } from './util'

export function clearSubState(mutate, setUpdateTime, gameid, subState) {
  const data = {
    action: "CLEAR_SUB_STATE",
  };

  const updatedSubState = {};

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function setSubStateSpeaker(mutate, setUpdateTime, gameid, subState, factionName) {
  const data = {
    action: "SET_SPEAKER",
    factionName: factionName,
  };

  const updatedSubState = {...subState};
  updatedSubState.speaker = speaker;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function undoSubStateSpeaker(mutate, setUpdateTime, gameid, subState) {
  const data = {
    action: "UNDO_SPEAKER",
  };

  const updatedSubState = {...subState};
  delete updatedSubState.speaker;

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function addSubStateTech(mutate, setUpdateTime, gameid, subState, factionName, techName) {
  const data = {
    action: "ADD_TECH",
    factionName: factionName,
    techName: techName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].techs) {
    updatedSubState.factions[factionName].techs = [];
  }
  updatedSubState.factions[factionName].techs.push(techName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function removeSubStateTech(mutate, setUpdateTime, gameid, subState, factionName, techName) {
  const data = {
    action: "REMOVE_TECH",
    factionName: factionName,
    techName: techName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].techs) {
    updatedSubState.factions[factionName].techs = [];
  }
  updatedSubState.factions[factionName].techs =
    updatedSubState.factions[factionName].techs.filter((tech) => tech !== techName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function addSubStatePlanet(mutate, setUpdateTime, gameid, subState, factionName, planetName) {
  const data = {
    action: "ADD_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].planets) {
    updatedSubState.factions[factionName].planets = [];
  }
  updatedSubState.factions[factionName].planets.push(planetName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function removeSubStatePlanet(mutate, setUpdateTime, gameid, subState, factionName, planetName) {
  const data = {
    action: "REMOVE_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].planets) {
    updatedSubState.factions[factionName].planets = [];
  }
  updatedSubState.factions[factionName].planets =
    updatedSubState.factions[factionName].planets.filter((planet) => planet !== planetName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function scoreSubStateObjective(mutate, setUpdateTime, gameid, subState, factionName, objectiveName) {
  const data = {
    action: "SCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].objectives) {
    updatedSubState.factions[factionName].objectives = [];
  }
  updatedSubState.factions[factionName].objectives.push(objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function unscoreSubStateObjective(mutate, setUpdateTime, gameid, subState, factionName, objectiveName) {
  const data = {
    action: "UNSCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.factions) {
    updatedSubState.factions = {};
  }
  if (!updatedSubState.factions[factionName]) {
    updatedSubState.factions[factionName] = {};
  }
  if (!updatedSubState.factions[factionName].objectives) {
    updatedSubState.factions[factionName].objectives = [];
  }
  updatedSubState.factions[factionName].objectives =
    updatedSubState.factions[factionName].objectives.filter((objective) => objective !== objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function revealSubStateObjective(mutate, setUpdateTime, gameid, subState, objectiveName) {
  const data = {
    action: "REVEAL_OBJECTIVE",
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.objectives) {
    updatedSubState.objectives = [];
  }
  updatedSubState.objectives.push(objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function hideSubStateObjective(mutate, setUpdateTime, gameid, subState, objectiveName) {
  const data = {
    action: "HIDE_OBJECTIVE",
    objectiveName: objectiveName,
  };

  const updatedSubState = {...subState};
  if (!updatedSubState.objectives) {
    updatedSubState.objectives = {};
  }
  updatedSubState.objectives = updatedSubState.objectives.filter((objective) => objective !== objectiveName);

  const options = {
    optimisticData: updatedSubState,
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}

export function finalizeSubState(mutate, setUpdateTime, gameid, subState) {
  const data = {
    action: "FINALIZE_SUB_STATE",
  };

  const options = {
    optimisticData: {},
  };

  mutate(`/api/${gameid}/subState`, poster(`/api/${gameid}/subStateUpdate`, data, setUpdateTime), options);
}