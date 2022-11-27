import { fetchAgendas } from '../../../server/util/fetch';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

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

  const timestampString = `updates.agendas.timestamp`;
  switch (data.action) {
    case "PASS_AGENDA": {
      const passedString = `agendas.${data.agenda}.passed`;
      const targetString = `agendas.${data.agenda}.target`;
      await db.collection('games').doc(gameid).update({
        [passedString]: true,
        [targetString]: data.target,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
    case "RESOLVE_AGENDA": {
      const passedString = `agendas.${data.agenda}.passed`;
      const passed = (data.target !== "Against");
      const resolvedString = `agendas.${data.agenda}.resolved`;
      const targetString = `agendas.${data.agenda}.target`;
      await db.collection('games').doc(gameid).update({
        [passedString]: passed,
        [resolvedString]: true,
        [targetString]: data.target,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
    case "REPEAL_AGENDA": {
      const agendaString = `agendas.${data.agenda}`;
      await db.collection('games').doc(gameid).update({
        [agendaString]: FieldValue.delete(),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
  }


  const agendas = await fetchAgendas(gameid);

  res.status(200).json(agendas);
}