import { repealAgenda } from './agendas';
import { revealObjective, scoreObjective } from './objectives';
import { claimPlanet } from './planets';
import { setSpeaker } from './state';
import { lockTech, unlockTech } from './techs';
import { fetcher, poster } from './util'

export function clearSubState(mutate, gameid) {
  const data = {
    action: "CLEAR_SUB_STATE",
  };

  return mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      return {};
    },
    revalidate: false,
  });
}

export function setSubStateSelectedAction(mutate, gameid, actionName) {
  const data = {
    action: "SET_ACTION",
    actionName: actionName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      return {
        selectedAction: actionName,
      }
    },
    revalidate: false,
  });
}

export function setSubStateSpeaker(mutate, gameid, factionName) {
  const data = {
    action: "SET_SPEAKER",
    factionName: factionName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      updatedSubState.speaker = factionName;

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function undoSubStateSpeaker(mutate, gameid) {
  const data = {
    action: "UNDO_SPEAKER",
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      delete updatedSubState.speaker;

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function addSubStateTech(mutate, gameid, factionName, techName) {
  const data = {
    action: "ADD_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      if (!updatedSubState.factions) {
        updatedSubState.factions = {};
      }
      if (!updatedSubState.factions[factionName]) {
        updatedSubState.factions[factionName] = {};
      }
      if (!updatedSubState.factions[factionName].techs) {
        updatedSubState.factions[factionName].techs = [];
      }

      const techString = techName.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      updatedSubState.factions[factionName].techs.push(techString);

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function clearAddedSubStateTech(mutate, gameid, factionName, techName) {
  const data = {
    action: "CLEAR_ADDED_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      if (!updatedSubState.factions) {
        updatedSubState.factions = {};
      }
      if (!updatedSubState.factions[factionName]) {
        updatedSubState.factions[factionName] = {};
      }
      if (!updatedSubState.factions[factionName].techs) {
        updatedSubState.factions[factionName].techs = [];
      }

      const techString = techName.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      updatedSubState.factions[factionName].techs =
        updatedSubState.factions[factionName].techs.filter((tech) => tech !== techString);
    
      return updatedSubState;
    },
    revalidate: false,
  });
}

export function removeSubStateTech(mutate, gameid, factionName, techName) {
  const data = {
    action: "REMOVE_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      if (!updatedSubState.factions) {
        updatedSubState.factions = {};
      }
      if (!updatedSubState.factions[factionName]) {
        updatedSubState.factions[factionName] = {};
      }
      if (!updatedSubState.factions[factionName].removeTechs) {
        updatedSubState.factions[factionName].removeTechs = [];
      }

      const techString = techName.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      updatedSubState.factions[factionName].removeTechs.push(techString);
    
      return updatedSubState;
    },
    revalidate: false,
  });
}

export function clearRemovedSubStateTech(mutate, gameid, factionName, techName) {
  const data = {
    action: "CLEAR_REMOVED_TECH",
    factionName: factionName,
    techName: techName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      if (!updatedSubState.factions) {
        updatedSubState.factions = {};
      }
      if (!updatedSubState.factions[factionName]) {
        updatedSubState.factions[factionName] = {};
      }
      if (!updatedSubState.factions[factionName].removeTechs) {
        updatedSubState.factions[factionName].removeTechs = [];
      }

      const techString = techName.replace(/\//g,"")
        .replace(/\./g,"")
        .replace(" Ω", "");

      updatedSubState.factions[factionName].removeTechs =
        updatedSubState.factions[factionName].removeTechs.filter((tech) => tech !== techString);
        
      return updatedSubState;
    },
    revalidate: false,
  });
}

export function addSubStatePlanet(mutate, gameid, factionName, planetName) {
  const data = {
    action: "ADD_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

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

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function removeSubStatePlanet(mutate, gameid, factionName, planetName) {
  const data = {
    action: "REMOVE_PLANET",
    factionName: factionName,
    planetName: planetName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

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
  
      return updatedSubState;
    },
    revalidate: false,
  });
}

export function scoreSubStateObjective(mutate, gameid, factionName, objectiveName) {
  const data = {
    action: "SCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

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
    
      return updatedSubState;
    },
    revalidate: false,
  });
}

export function unscoreSubStateObjective(mutate, gameid, factionName, objectiveName) {
  const data = {
    action: "UNSCORE_OBJECTIVE",
    factionName: factionName,
    objectiveName: objectiveName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

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
      
      return updatedSubState;
    },
    revalidate: false,
  });
}

export function castSubStateVotes(mutate, gameid, factionName, target, numVotes) {
  const data = {
    action: "CAST_VOTES",
    factionName: factionName,
    target: target,
    numVotes: numVotes,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      if (!updatedSubState.factions) {
        updatedSubState.factions = {};
      }
      if (!updatedSubState.factions[factionName]) {
        updatedSubState.factions[factionName] = {};
      }

      updatedSubState.factions[factionName].votes = numVotes;
      updatedSubState.factions[factionName].target = target;

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function revealSubStateObjective(mutate, gameid, objectiveName) {
  const data = {
    action: "REVEAL_OBJECTIVE",
    objectiveName: objectiveName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      if (!updatedSubState.objectives) {
        updatedSubState.objectives = [];
      }
      updatedSubState.objectives.push(objectiveName);

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function hideSubStateObjective(mutate, gameid, objectiveName) {
  const data = {
    action: "HIDE_OBJECTIVE",
    objectiveName: objectiveName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      if (!updatedSubState.objectives) {
        updatedSubState.objectives = [];
      }

      updatedSubState.objectives = updatedSubState.objectives.filter((objective) => objective !== objectiveName);

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function revealSubStateAgenda(mutate, gameid, agendaName) {
  const data = {
    action: "REVEAL_AGENDA",
    agendaName: agendaName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      updatedSubState.agenda = agendaName;

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function hideSubStateAgenda(mutate, gameid) {
  const data = {
    action: "HIDE_AGENDA",
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      delete updatedSubState.agenda;
      delete updatedSubState.tieBreak;
      delete updatedSubState.outcome;
      delete updatedSubState.factions;

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function repealSubStateAgenda(mutate, gameid, agendaName) {
  const data = {
    action: "REPEAL_AGENDA",
    agendaName: agendaName,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      updatedSubState.repealedAgenda = agendaName;

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function removeRepealedSubStateAgenda(mutate, gameid) {
  const data = {
    action: "REMOVE_REPEALED_AGENDA",
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState);

      delete updatedSubState.repealedAgenda;

      return updatedSubState;
    },
    revalidate: false,
  });
}


export function setSubStateOther(mutate, gameid, fieldName, value) {
  const data = {
    action: "SET_OTHER_FIELD",
    fieldName: fieldName,
    value: value,
  };

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      const updatedSubState = structuredClone(subState) ?? {};

      updatedSubState[fieldName] = value;

      return updatedSubState;
    },
    revalidate: false,
  });
}

export function finalizeSubState(mutate, gameid, subState, factions) {
  const data = {
    action: "FINALIZE_SUB_STATE",
  };

  if (subState.speaker) {
    setSpeaker(mutate, gameid, subState.speaker, factions);
  }

  if (subState.component) {
    // TODO: Handle compoents.
  }

  if (subState.repealedAgenda) {
    repealAgenda(mutate, gameid, subState.repealedAgenda);
  }

  for (const objectiveName of (subState.objectives ?? [])) {
    revealObjective(mutate, gameid, null, objectiveName);
  }

  for (const [factionName, updates] of Object.entries(subState.factions ?? {})) {
    // Unlocked techs
    for (const techName of (updates.techs ?? [])) {
      if (techName === "IIHQ Modernization") {
        claimPlanet(mutate, gameid, "Custodia Vigilia", factionName);
      }
      unlockTech(mutate, gameid, factionName, techName);
    }
    // Locked techs
    for (const techName of (updates.removeTechs ?? [])) {
      lockTech(mutate, gameid, factionName, techName);
    }
    // Conquered planets
    for (let planetName of (updates.planets ?? [])) {
      planetName = planetName === "[0.0.0]" ? "000" : planetName;
      claimPlanet(mutate, gameid, planetName, factionName);
    }
    // Scored objectives
    for (const objectiveName of (updates.objectives ?? [])) {
      scoreObjective(mutate, gameid, factionName, objectiveName);
    }
  }

  mutate(`/api/${gameid}/subState`, async () => await poster(`/api/${gameid}/subStateUpdate`, data), {
    optimisticData: subState => {
      return {};
    },
    revalidate: false,
  });

  // const subState = gameRef.data().subState ?? {};
  // const gameLog = gameRef.data().gameLog ?? [];
  // gameLog.push(subState);
  // const gameObjectives = await fetchObjectives(gameid, req.cookies.secret);
  // const gamePlanets = await fetchPlanets(gameid);
  // const attachments = await fetchAttachments(gameid);
  // const components = await fetchComponents(gameid);
  // updates = {
  //   "subState": FieldValue.delete(),
  //   "gameLog": gameLog,
  //   [timestampString]: timestamp,
  // };
  // if (subState.speaker) {
  //   updates[`state.speaker`] = subState.speaker;
  //   updates[`updates.state.timestamp`] = timestamp;
  //   updates[`updates.factions.timestamp`] = timestamp;
  //   const currentOrder = gameRef.data().factions[subState.speaker].order;
  //   for (const [name, faction] of Object.entries(gameRef.data().factions)) {
  //     let factionOrder = faction.order - currentOrder + 1;
  //     if (factionOrder < 1) {
  //       factionOrder += Object.keys(gameRef.data().factions).length;
  //     }
  //     const factionString = `factions.${name}.order`;
  //     updates[factionString] = factionOrder;
  //   }
  // }
  // if (subState.component) {
  //   const component = components[subState.component];
  //   const futureState = usedComponentState(component);
  //   if (futureState !== "active") {
  //     updates[`components.${subState.component}.state`] = futureState;
  //     updates[`updates.components.timestamp`] = timestamp;
  //   }
  //   if (component.type === "leader" && component.leader === "hero") {
  //     updates[`factions.${component.faction}.hero`] = "purged";
  //     updates[`updates.factions.timestamp`] = timestamp;
  //   }
  // }
  // if (subState.repealedAgenda) {
  //   updates[`agendas.${subState.repealedAgenda}`] = FieldValue.delete();
  //   updates[`updates.agendas.timestamp`] = timestamp;
  // }
  // (subState.objectives ?? []).forEach((objective) => {
  //   updates[`objectives.${objective}.selected`] = true;
  //   updates[`updates.objectives.timestamp`] = timestamp;
  // });
  // for (const [factionName, value] of Object.entries(subState.factions ?? {})) {
  //   (value.techs ?? []).forEach((tech) => {
  //     if (tech === "IIHQ Modernization") {
  //       updates[`planets.Custodia Vigilia.owners`] = [factionName];
  //       updates[`updates.planets.timestamp`] = timestamp;
  //     }
  //     updates[`factions.${factionName}.techs.${tech}.ready`] = true;
  //     updates[`updates.factions.timestamp`] = timestamp;
  //   });
  //   (value.removeTechs ?? []).forEach((tech) => {
  //     updates[`factions.${factionName}.techs.${tech}`] = FieldValue.delete();
  //     updates[`updates.factions.timestamp`] = timestamp;
  //   });
  //   for (const planet of (value.planets ?? [])) {
  //     const planetName = planet === "[0.0.0]" ? "000" : planet;
  //     updates[`planets.${factionName}.planets.${planetName}.ready`] = true;
  //     updates[`planets.${planetName}.owners`] = [factionName];
  //     updates[`updates.planets.timestamp`] = timestamp;
  //     updates[`updates.factions.timestamp`] = timestamp;
  //     const pseudoData = {
  //       action: "ADD_PLANET",
  //       planet: planetName,
  //     };
  //     if (await shouldUnlockXxchaCommander(pseudoData, gameRef, gamePlanets, attachments)) {
  //       updates[`factions.Xxcha Kingdom.commander`] = "unlocked";
  //       updates[`updates.factions.timestamp`] = timestamp

  //     }
  //   }
  //   (value.objectives ?? []).forEach((objective) => {
  //     updates[`objectives.${objective}.selected`] = true;
  //     updates[`objectives.${objective}.scorers`] = FieldValue.arrayUnion(factionName);
  //     updates[`updates.objectives.timestamp`] = timestamp;
  //   });
  //   if ((value.objectives ?? []).length > 0 && 
  //       gameRef.data().factions[factionName].hero === "locked") {
  //     const scoredObjectives = Object.entries(gameObjectives).filter(([objectiveID, objective]) => {
  //       return objective.type !== "other" && 
  //         ((objective.scorers ?? []).includes(factionName) || (value.objectives ?? []).includes(objectiveID));
  //     }).length;
  //     if (scoredObjectives >= 3) {
  //       updates[`factions.${factionName}.hero`] = "unlocked";
  //       updates[`updates.factions.timestamp`] = Timestamp.fromMillis(data.timestamp);
  //     }
  //   }
  // }
}