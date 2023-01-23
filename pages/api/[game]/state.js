import { fetchPlanets } from '../../../server/util/fetch';

const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  const state = gameRef.data().state;

  if (!state.agendaUnlocked) {
    const planets = await fetchPlanets(gameid);
    if ((planets['Mecatol Rex'].owners ?? []).length > 0) {
      state.agendaUnlocked = true;
    }
  }

  res.status(200).json(state);
}