import { fetchObjectives } from '../../../server/util/fetch';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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

  switch (data.action) {
    case "REVEAL_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.selected`;
      await db.collection('games').doc(gameid).update({
        [objectiveString]: true,
      });
      break;
    }
    case "REMOVE_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.selected`;
      await db.collection('games').doc(gameid).update({
        [objectiveString]: false,
      });
      break;
    }
    case "SCORE_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.scorers`;
      let updateValue = FieldValue.arrayUnion(data.faction);
      if (data.objective === "Support for the Throne" || data.objective === "Imperial Point") {
        const scorers = gameRef.data().objectives[data.objective].scorers ?? [];
        scorers.push(data.faction);
        updateValue = scorers;
      }
      await db.collection('games').doc(gameid).update({
        [objectiveString]: updateValue,
      });
      break;
    }
    case "UNSCORE_OBJECTIVE": {
      const objectiveString = `objectives.${data.objective}.scorers`;
      let updateValue = FieldValue.arrayRemove(data.faction)
      if (data.objective === "Support for the Throne" || data.objective === "Imperial Point") {
        const scorers = gameRef.data().objectives[data.objective].scorers ?? [];
        const lastIndex = scorers.lastIndexOf(data.faction);
        scorers.splice(lastIndex, 1);
        updateValue = scorers;
      }
      await db.collection('games').doc(gameid).update({
        [objectiveString]: updateValue,
      });
      break;
    }
  }

  const objectives = await fetchObjectives(gameid);

  res.status(200).json(objectives);
}