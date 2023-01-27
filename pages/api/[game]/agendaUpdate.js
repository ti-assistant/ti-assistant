import { fetchAgendas } from '../../../server/util/fetch';

import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { createResolvedAgenda } from '../../../src/util/api/agendas';

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
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "RESOLVE_AGENDA": {
      const agendaString = `agendas.${data.agenda}`;
      const agenda = createResolvedAgenda(data.agenda, data.target);
      switch (data.agenda) {
        case "Anti-Intellectual Revolution": {
          if (data.target === "Against") {
            agenda.activeRound = gameRef.data().state.round + 1;
          }
          break;
        }
        case "Arms Reduction": {
          if (data.target === "Against") {
            agenda.activeRound = gameRef.data().state.round + 1;
          }
          break;
        }
        case "Checks and Balances": {
          if (data.target === "Against") {
            agenda.activeRound = gameRef.data().state.round;
          }
          break;
        }
        case "New Constitution": {
          if (data.target === "For") {
            agenda.activeRound = gameRef.data().state.round + 1;
          }
          break;
        }
        case "Public Execution": {
          agenda.activeRound = gameRef.data().state.round;
          break;
        }
        case "Representative Government": {
          agenda.activeRound = gameRef.data().state.round + 1;
          // TODO: Get the list of users that voted on this.
          break;
        }
      }
      const updates = {
        [agendaString]: {...((gameRef.data().agendas ?? [])[data.agenda] ?? {}), ...agenda},
      };
      await db.collection('games').doc(gameid).update(updates);
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