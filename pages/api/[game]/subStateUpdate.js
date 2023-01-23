import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

import { fetchComponents, fetchObjectives, fetchStrategyCards } from '../../../server/util/fetch';
import { computeVotes } from '../../../src/main/AgendaPhase';
import { getOnDeckFaction } from '../../../src/util/helpers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const data = req.body;

  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  let tech = data.techName;
  if (tech) {
    tech = tech.replace(/\//g,"");
    tech = tech.replace(/\./g,"");
    tech = tech.replace(" Ω", "");
  }

  let updates;
  const timestampString = `updates.substate.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "CLEAR_SUB_STATE": {
      updates = {
        "subState": FieldValue.delete(),
      };
      break;
    }
    case "SET_ACTION": {
      updates = {
        "subState": {
          selectedAction: data.actionName,
        },
        [timestampString]: timestamp,
      };
      break;
    }
    case "SET_SPEAKER": {
      updates = {
        "subState.speaker": data.factionName,
        [timestampString]: timestamp,
      };
      break;
    }
    case "UNDO_SPEAKER": {
      updates = {
        "subState.speaker": FieldValue.delete(),
        [timestampString]: timestamp,
      };
      break;
    }
    case "ADD_TECH": {
      const techString = `subState.factions.${data.factionName}.techs`;
      updates = {
        [techString]: FieldValue.arrayUnion(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "CLEAR_ADDED_TECH": {
      const techString = `subState.factions.${data.factionName}.techs`;
      updates = {
        [techString]: FieldValue.arrayRemove(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "REMOVE_TECH": {
      const techString = `subState.factions.${data.factionName}.removeTechs`;
      updates = {
        [techString]: FieldValue.arrayUnion(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "CLEAR_REMOVED_TECH": {
      const techString = `subState.factions.${data.factionName}.removeTechs`;
      updates = {
        [techString]: FieldValue.arrayRemove(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "ADD_PLANET": {
      const planetString = `subState.factions.${data.factionName}.planets`;
      updates = {
        [planetString]: FieldValue.arrayUnion(data.planetName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "REMOVE_PLANET": {
      const planetString = `subState.factions.${data.factionName}.planets`;
      updates = {
        [planetString]: FieldValue.arrayRemove(data.planetName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "SCORE_OBJECTIVE": {
      const objectiveString = `subState.factions.${data.factionName}.objectives`;
      updates = {
        [objectiveString]: FieldValue.arrayUnion(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "UNSCORE_OBJECTIVE": {
      const objectiveString = `subState.factions.${data.factionName}.objectives`;
      updates = {
        [objectiveString]: FieldValue.arrayRemove(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "CAST_VOTES": {
      const voteString = `subState.factions.${data.factionName}.votes`;
      const targetString = `subState.factions.${data.factionName}.target`;
      updates = {
        [voteString]: data.numVotes,
        [targetString]: data.target,
        [timestampString]: timestamp,
        "subState.tieBreak": FieldValue.delete(),
      }
      break;
    }
    case "REVEAL_OBJECTIVE": {
      updates = {
        "subState.objectives": FieldValue.arrayUnion(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "HIDE_OBJECTIVE": {
      updates = {
        "subState.objectives": FieldValue.arrayRemove(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "REVEAL_AGENDA": {
      updates = {
        "subState.agenda": data.agendaName,
        [timestampString]: timestamp,
      };
      break;
    }
    case "HIDE_AGENDA": {
      updates = {
        "subState.agenda": FieldValue.delete(),
        [timestampString]: timestamp,
        "subState.tieBreak": FieldValue.delete(),
        "subState.outcome": FieldValue.delete(),
      };
      Object.keys(gameRef.data().factions).forEach((factionName) => {
        const voteString = `subState.factions.${factionName}.votes`;
        const targetString = `subState.factions.${factionName}.target`;
        updates[voteString] = FieldValue.delete();
        updates[targetString] = FieldValue.delete();
      });
      break;
    }
    case "SET_OTHER_FIELD": {
      const newFieldString = `subState.${data.fieldName}`
      updates = {
        [newFieldString]: data.value,
        [timestampString]: timestamp,
      };
      break;
    }
    case "FINALIZE_SUB_STATE": {
      const subState = gameRef.data().subState ?? {};
      const gameLog = gameRef.data().gameLog ?? [];
      gameLog.push(subState);
      const gameObjectives = await fetchObjectives(gameid, req.cookies.secret);
      const components = await fetchComponents(gameid);
      updates = {
        "subState": FieldValue.delete(),
        "gameLog": gameLog,
        [timestampString]: timestamp,
      };
      if (subState.speaker) {
        updates[`state.speaker`] = subState.speaker;
        updates[`updates.state.timestamp`] = timestamp;
        updates[`updates.factions.timestamp`] = timestamp;
        const currentOrder = gameRef.data().factions[subState.speaker].order;
        for (const [name, faction] of Object.entries(gameRef.data().factions)) {
          let factionOrder = faction.order - currentOrder + 1;
          if (factionOrder < 1) {
            factionOrder += Object.keys(gameRef.data().factions).length;
          }
          const factionString = `factions.${name}.order`;
          updates[factionString] = factionOrder;
        }
      }
      if (subState.component) {
        const component = components[subState.component];
        if (component.type === "leader" && component.leader === "hero") {
          updates[`factions.${component.faction}.hero`] = "purged";
          updates[`updates.factions.timestamp`] = timestamp;
        }
      }
      (subState.objectives ?? []).forEach((objective) => {
        updates[`objectives.${objective}.selected`] = true;
        updates[`updates.objectives.timestamp`] = timestamp;
      });
      Object.entries(subState.factions ?? {}).forEach(([factionName, value]) => {
        (value.techs ?? []).forEach((tech) => {
          updates[`factions.${factionName}.techs.${tech}.ready`] = true;
          updates[`updates.factions.timestamp`] = timestamp;
        });
        (value.removeTechs ?? []).forEach((tech) => {
          updates[`factions.${factionName}.techs.${tech}`] = FieldValue.delete();
          updates[`updates.factions.timestamp`] = timestamp;
        });
        (value.planets ?? []).forEach((planet) => {
          const planetName = planet === "[0.0.0]" ? "000" : planet;
          updates[`planets.${factionName}.planets.${planetName}.ready`] = true;
          updates[`planets.${planetName}.owners`] = [factionName];
          updates[`updates.planets.timestamp`] = timestamp;
          updates[`updates.factions.timestamp`] = timestamp;
        });
        (value.objectives ?? []).forEach((objective) => {
          updates[`objectives.${objective}.selected`] = true;
          updates[`objectives.${objective}.scorers`] = FieldValue.arrayUnion(factionName);
          updates[`updates.objectives.timestamp`] = timestamp;
        });
        if ((value.objectives ?? []).length > 0 && 
            gameRef.data().factions[factionName].hero === "locked") {
          const scoredObjectives = Object.entries(gameObjectives).filter(([objectiveID, objective]) => {
            return objective.type !== "other" && 
              ((objective.scorers ?? []).includes(factionName) || (value.objectives ?? []).includes(objectiveID));
          }).length;
          if (scoredObjectives >= 3) {
            updates[`factions.${factionName}.hero`] = "unlocked";
            updates[`updates.factions.timestamp`] = Timestamp.fromMillis(data.timestamp);
          }
        }
      });
    }
    break;
  }
  await db.collection('games').doc(gameid).update(updates);

  const responseRef = await db.collection('games').doc(gameid).get();

  return res.status(200).json(responseRef.data().subState ?? {});
}