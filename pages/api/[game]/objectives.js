import { fetchObjectives } from '../../../server/util/fetch';

const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const gameid = req.query.game;

  const objectives = await fetchObjectives(gameid);

  res.status(200).json(objectives);
}