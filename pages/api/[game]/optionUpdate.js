import { getFirestore, Timestamp } from 'firebase-admin/firestore';

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

  const timestampString = `updates.options.timestamp`;
  switch (data.action) {
    case "SET_OPTION": {
      const optionString = `options.${data.option}`;
      await db.collection('games').doc(gameid).update({
        [optionString]: data.value,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
  }
  const updatedRef = await db.collection('games').doc(gameid).get();

  res.status(200).json(updatedRef.data().options);
}