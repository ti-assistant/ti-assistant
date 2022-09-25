const { getFirestore } = require('firebase-admin/firestore');

/**
 * Fetches the strategy cards associated with a game.
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

/**
 * Fetches the objectives associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} objectives keyed by name.
 */
 export async function fetchObjectives(gameid) {
  const db = getFirestore();

  const objectivesRef = await db.collection('objectives').get();

  if (!gameid) {
    return objectivesRef.data();
  }

  const gameState = await db.collection('games').doc(gameid).get();
  const gameObjectives = gameState.data().objectives ?? {};

  let objectives = {};
  objectivesRef.forEach(async (val) => {
    if (!gameObjectives[val.id]) {
      objectives[val.id] = val.data();
      return;
    }

    objectives[val.id] = {
      ...val.data(),
      ...gameObjectives[val.id],
    };
  });

  return objectives;
}