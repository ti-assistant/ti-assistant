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
        const scorersString = `objectives.${data.objective}.scorers`;
        await db.collection('games').doc(gameid).update({
          [objectiveString]: false,
          [scorersString]: [],
          [factionString]: FieldValue.arrayRemove(data.faction),
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      } else {
        const objectiveString = `objectives.${data.objective}.selected`;
        const scorersString = `objectives.${data.objective}.scorers`;
        await db.collection('games').doc(gameid).update({
          [objectiveString]: false,
          [scorersString]: [],
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    }
    case "SCORE_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.scorers`;
      const revealedString = `objectives.${data.objective}.selected`;
      let updateValue = FieldValue.arrayUnion(data.faction);
      if (data.objective === "Support for the Throne" || data.objective === "Imperial Point") {
        const scorers = gameRef.data().objectives[data.objective].scorers ?? [];
        scorers.push(data.faction);
        updateValue = scorers;
      }
      await db.collection('games').doc(gameid).update({
        [revealedString]: true,
        [objectiveString]: updateValue,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
    case "UNSCORE_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.scorers`;
      const revealedString = `objectives.${data.objective}.selected`;
      let updateValue = FieldValue.arrayRemove(data.faction)
      if (data.objective === "Support for the Throne" || data.objective === "Imperial Point") {
        const scorers = gameRef.data().objectives[data.objective].scorers ?? [];
        const lastIndex = scorers.lastIndexOf(data.faction);
        scorers.splice(lastIndex, 1);
        updateValue = scorers;
      }
      await db.collection('games').doc(gameid).update({
        [revealedString]: true,
        [objectiveString]: updateValue,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
  }

  const objectives = await fetchObjectives(gameid, req.cookies.secret);

  res.status(200).json(objectives);
}