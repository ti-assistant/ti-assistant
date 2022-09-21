const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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

  let cardString;
  let orderString;
  switch (data.action) {
    case "ASSIGN_STRATEGY_CARD":
      cardString = `strategycards.${data.card}.faction`;
      await db.collection('games').doc(gameid).update({
        [cardString]: data.faction,
      });
      break;
    case "CLEAR_STRATEGY_CARDS":
      for (const card of Object.keys(gameRef.data().strategycards)) {
        cardString = `strategycards.${card}.faction`;
        orderString = `strategycards.${card}.order`;
        await db.collection('games').doc(gameid).update({
          [cardString]: FieldValue.delete(),
          [orderString]: FieldValue.delete(),
        });
      }
      break;
  }
  
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