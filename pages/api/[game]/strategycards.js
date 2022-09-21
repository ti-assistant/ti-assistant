const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const gameid = req.query.game;

  const strategiesRef = await db.collection('strategycards').orderBy('order').get();

  const gamestate = await db.collection('games').doc(gameid).get();
  const strategycards = gamestate.data().strategycards ?? {};

  let cards = {};
  strategiesRef.forEach(async (val) => {
    let strategy = val.data();
    let id = val.id;

    cards[id] = {
      ...strategy,
      ...(strategycards[id] ?? {}),
    };
  });

  res.status(200).json(cards);
}