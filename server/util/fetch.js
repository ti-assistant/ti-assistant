const { getFirestore } = require('firebase-admin/firestore');

/**
 * 
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} strategy cards keyed by name.
 */
export async function fetchStrategyCards(gameid) {
  const db = getFirestore();

  const strategiesRef = await db.collection('strategycards').orderBy('order').get();

  if (!gameid) {
    return strategiesRef.data();
  }

  const gameState = await db.collection('games').doc(gameid).get();
  const strategyCards = gameState.data().strategycards ?? {};

  let cards = {};
  strategiesRef.forEach(async (val) => {
    if (!strategyCards[val.id]) {
      cards[val.id] = val.data();
      return;
    }

    cards[val.id] = {
      ...val.data(),
      ...strategyCards[val.id],
    };
  });

  return cards;
}