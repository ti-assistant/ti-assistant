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

  const timestampString = `updates.timers.timestamp`;
  switch (data.action) {
    case "SET_GAME_TIMER": {
      const timer = gameRef.data().timers.game ?? 0;
      if (data.timer > timer) {
        await db.collection('games').doc(gameid).update({
          "timers.game": data.timer,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    }
    case "SAVE_FACTION_TIMER": {
      const timer = (gameRef.data().timers ?? {})[data.faction] ?? 0;
      if (data.timer > timer) {
        const factionString = `timers.${data.faction}`;
        await db.collection('games').doc(gameid).update({
          [factionString]: data.timer,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    }
  }

  const responseRef = await db.collection('games').doc(gameid).get();

  return res.status(200).json(responseRef.data().timers);
}