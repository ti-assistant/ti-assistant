import { fetcher, poster } from './util'

export function revealObjective(mutate, gameid, factionName, objectiveName) {
  const data = {
    action: "REVEAL_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(`/api/${gameid}/objectives`, async () => await poster(`/api/${gameid}/objectiveUpdate`, data), {
    optimisticData: objectives => {
      const updatedObjectives = structuredClone(objectives);

      updatedObjectives[objectiveName].selected = true;
      if (objectives[objectiveName].type === "secret") {
        updatedObjectives[objectiveName].factions = [
          ...(updatedObjectives[objectiveName].factions ?? []),
          factionName,
        ];
      }

      return updatedObjectives;
    },
    revalidate: false,
  });
}

export function removeObjective(mutate, gameid, factionName, objectiveName) {
  const data = {
    action: "REMOVE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(`/api/${gameid}/objectives`, async () => await poster(`/api/${gameid}/objectiveUpdate`, data), {
    optimisticData: objectives => {
      const updatedObjectives = structuredClone(objectives);

      updatedObjectives[objectiveName].selected = false;
      if (objectives[objectiveName].type === "secret") {
        updatedObjectives[objectiveName].factions = (updatedObjectives[objectiveName].factions ?? []).filter((faction) => faction !== factionName);
      }

      return updatedObjectives;
    },
    revalidate: false,
  });
}

export function scoreObjective(mutate, gameid, factionName, objectiveName) {
  const data = {
    action: "SCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(`/api/${gameid}/objectives`, async () => await poster(`/api/${gameid}/objectiveUpdate`, data), {
    optimisticData: objectives => {
      const updatedObjectives = structuredClone(objectives);

      updatedObjectives[objectiveName].scorers = [...(updatedObjectives[objectiveName].scorers ?? []), factionName];

      return updatedObjectives;
    },
    revalidate: false,
  });
}

export function unscoreObjective(mutate, gameid, factionName, objectiveName) {
  const data = {
    action: "UNSCORE_OBJECTIVE",
    objective: objectiveName,
    faction: factionName,
  };

  mutate(`/api/${gameid}/objectives`, async () => await poster(`/api/${gameid}/objectiveUpdate`, data), {
    optimisticData: objectives => {
      const updatedObjectives = structuredClone(objectives);

      const factionIndex = (updatedObjectives[objectiveName].scorers ?? []).lastIndexOf(factionName);
      if (factionIndex !== -1) {
        updatedObjectives[objectiveName].scorers.splice(factionIndex, 1);
      }

      return updatedObjectives;
    },
    revalidate: false,
  });
}