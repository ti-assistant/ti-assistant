import { fetcher, poster } from './util'

export function revealObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName) {
  const data = {
    action: "REVEAL_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  const updatedObjectives = {...objectives};

  updatedObjectives[objectiveName].selected = true;
  if (updatedObjectives[objectiveName].type === "secret") {
    updatedObjectives[objectiveName].factions = [
      ...(updatedObjectives[objectiveName].factions ?? []),
      factionName,
    ];
  }

  const options = {
    optimisticData: updatedObjectives,
  };

  mutate(`/api/${gameid}/objectives`, poster(`/api/${gameid}/objectiveUpdate`, data, setUpdateTime), options);
}

export function removeObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName) {
  const data = {
    action: "REMOVE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  const updatedObjectives = {...objectives};

  updatedObjectives[objectiveName].selected = false;
  updatedObjectives[objectiveName].scorers = [];
  if (updatedObjectives[objectiveName].type === "secret") {
    updatedObjectives[objectiveName].factions = (updatedObjectives[objectiveName].factions ?? []).filter((faction) => faction !== factionName);
  }

  const options = {
    optimisticData: updatedObjectives,
  };

  mutate(`/api/${gameid}/objectives`, poster(`/api/${gameid}/objectiveUpdate`, data, setUpdateTime), options);
}

export function scoreObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName) {
  const data = {
    action: "SCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  const updatedObjectives = {...objectives};

  updatedObjectives[objectiveName].scorers = [...(updatedObjectives[objectiveName].scorers ?? []), factionName];

  const options = {
    optimisticData: updatedObjectives,
  };

  mutate(`/api/${gameid}/objectives`, poster(`/api/${gameid}/objectiveUpdate`, data, setUpdateTime), options);
}

export function unscoreObjective(mutate, setUpdateTime, gameid, objectives, factionName, objectiveName) {
  const data = {
    action: "UNSCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  const updatedObjectives = {...objectives};

  const factionIndex = (updatedObjectives[objectiveName].scorers ?? []).lastIndexOf(factionName);
  if (factionIndex !== -1) {
    updatedObjectives[objectiveName].scorers.splice(factionIndex, 1);
  }

  const options = {
    optimisticData: updatedObjectives,
  };

  mutate(`/api/${gameid}/objectives`, poster(`/api/${gameid}/objectiveUpdate`, data, setUpdateTime), options);
}