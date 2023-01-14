const { getFirestore, Timestamp } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  const timers = {};
  Object.entries(gameRef.data().timers ?? {}).forEach(([name, val]) => {
    timers[name] = val;
  });

  console.log(timers);
  res.status(200).json(timers);
}