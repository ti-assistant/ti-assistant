import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

import { fetchStrategyCards } from '../../../server/util/fetch';
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
        [techString]: FieldValue.arrayUnion(data.techName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "REMOVE_TECH": {
      const techString = `subState.factions.${data.factionName}.techs`;
      updates = {
        [techString]: FieldValue.arrayRemove(data.techName),
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
    case "FINALIZE_SUB_STATE": {
      const subState = gameRef.data().subState;
      updates = {
        "subState": FieldValue.delete(),
        [timestampString]: timestamp,
      };
      if (subState.speaker) {
        updates[`state.speaker`] = subState.speaker;
        updates[`updates.state.timestamp`] = timestamp;
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
        (value.planets ?? []).forEach((planet) => {
          updates[`planets.${factionName}.planets.${planet}.ready`] = true;
          updates[`planets.${planet}.owners`] = [factionName];
          updates[`updates.planets.timestamp`] = timestamp;
          updates[`updates.factions.timestamp`] = timestamp;
        });
        (value.objectives ?? []).forEach((objective) => {
          updates[`objectives.${objective}.selected`] = true;
          updates[`objectives.${objective}.scorers`] = FieldValue.arrayUnion(factionName);
          updates[`updates.objectives.timestamp`] = timestamp;
        });
      });
      break;
    }
  }
  await db.collection('games').doc(gameid).update(updates);

  const responseRef = await db.collection('games').doc(gameid).get();

  return res.status(200).json(responseRef.data().subState ?? {});
}