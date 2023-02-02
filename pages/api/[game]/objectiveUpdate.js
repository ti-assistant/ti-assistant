import { fetchObjectives } from '../../../server/util/fetch';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const data = req.body;

  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();
  const objective = await db.collection('objectives').doc(data.objective).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  const gameObjectives = await fetchObjectives(gameid, req.cookies.secret);

  const timestampString = `updates.objectives.timestamp`;
  switch (data.action) {
    case "REVEAL_OBJECTIVE": {
      if (objective.data().type === "secret") {
        const secret = req.cookies.secret;
        const objectiveString = `${secret}.objectives.${data.objective}.selected`;
        const factionString = `${secret}.objectives.${data.objective}.factions`;

        await db.collection('games').doc(gameid).update({
          [objectiveString]: true,
          [factionString]: FieldValue.arrayUnion(data.faction),
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      } else {
        const objectiveString = `objectives.${data.objective}.selected`;
        await db.collection('games').doc(gameid).update({
          [objectiveString]: true,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    }
    case "REMOVE_OBJECTIVE": {
      if (objective.data().type === "secret") {
        const secret = req.cookies.secret;
        const objectiveString = `${secret}.objectives.${data.objective}.selected`;
        const factionString = `${secret}.objectives.${data.objective}.factions`;
        await db.collection('games').doc(gameid).update({
          [objectiveString]: false,
          [factionString]: FieldValue.arrayRemove(data.faction),
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      } else {
        const objectiveString = `objectives.${data.objective}.selected`;
        await db.collection('games').doc(gameid).update({
          [objectiveString]: false,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    }
    case "SCORE_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.scorers`;
      const revealedString = `objectives.${data.objective}.selected`;
      let updateValue = FieldValue.arrayUnion(data.faction);
      if (gameObjectives[data.objective].repeatable) {
        const scorers = gameRef.data().objectives[data.objective].scorers ?? [];
        scorers.push(data.faction);
        updateValue = scorers;
      }
      const updates = {
        [revealedString]: true,
        [objectiveString]: updateValue,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      if (gameRef.data().factions[data.faction].hero === "locked") {
        const scoredObjectives = Object.entries(gameObjectives).filter(([objectiveID, objective]) => {
          return objective.type !== "other" && 
            ((objective.scorers ?? []).includes(data.faction) || data.objective === objectiveID);
        }).length;
        if (scoredObjectives >= 3) {
          updates[`factions.${data.faction}.hero`] = "unlocked";
          updates[`updates.factions.timestamp`] = Timestamp.fromMillis(data.timestamp);
        }
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "UNSCORE_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.scorers`;
      const revealedString = `objectives.${data.objective}.selected`;
      let updateValue = FieldValue.arrayRemove(data.faction);
      if (gameObjectives[data.objective].repeatable) {
        const scorers = gameRef.data().objectives[data.objective].scorers ?? [];
        const lastIndex = scorers.lastIndexOf(data.faction);
        scorers.splice(lastIndex, 1);
        updateValue = scorers;
      }
      const updates = {
        [revealedString]: true,
        [objectiveString]: updateValue,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      }
      if (gameRef.data().factions[data.faction].hero === "unlocked") {
        const scoredObjectives = Object.entries(gameObjectives).filter(([objectiveID, objective]) => {
          return objective.type !== "other" && 
            ((objective.scorers ?? []).includes(data.faction) && data.objective !== objectiveID);
        }).length;
        if (scoredObjectives < 3) {
          updates[`factions.${data.faction}.hero`] = "locked";
          updates[`updates.factions.timestamp`] = Timestamp.fromMillis(data.timestamp);
        }
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
  }

  const objectives = await fetchObjectives(gameid, req.cookies.secret);

  res.status(200).json(objectives);
}