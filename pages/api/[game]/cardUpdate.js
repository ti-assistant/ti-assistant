import { fetchStrategyCards } from '../../../server/util/fetch';

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
    case "ASSIGN_STRATEGY_CARD": {
      const factionString = `strategycards.${data.card}.faction`;
      await db.collection('games').doc(gameid).update({
        [factionString]: data.faction,
      });
      if (data.faction === "Naalu Collective") {
        const orderString = `strategycards.${data.card}.order`;
        await db.collection('games').doc(gameid).update({
          [orderString]: 0,
        });
      }
      break;
    }
    case "USE_STRATEGY_CARD": {
      const usedString = `strategycards.${data.card}.used`;
      await db.collection('games').doc(gameid).update({
        [usedString]: true,
      });
      break;
    }
    case "CLEAR_STRATEGY_CARDS": {
      for (const card of Object.keys(gameRef.data().strategycards)) {
        const usedString = `strategycards.${card}.used`;
        const cardString = `strategycards.${card}.faction`;
        const orderString = `strategycards.${card}.order`;
        await db.collection('games').doc(gameid).update({
          [cardString]: FieldValue.delete(),
          [orderString]: FieldValue.delete(),
          [usedString]: FieldValue.delete(),
        });
      }
      break;
    }
  }

  
  const strategyCards = await fetchStrategyCards(gameid);

  res.status(200).json(strategyCards);
}