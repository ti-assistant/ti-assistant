const { getFirestore, Timestamp } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  const updates = {};
  Object.entries(gameRef.data().updates ?? {}).forEach(([name, val]) => {
    updates[name] = {
      timestamp: val.timestamp.toMillis(),
    };
  });

  res.status(200).json(updates);
}