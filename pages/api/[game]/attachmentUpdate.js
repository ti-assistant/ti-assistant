import { fetchAttachments, fetchPlanets } from '../../../server/util/fetch';

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { filterToPlanetAttachments } from '../../../src/util/attachments';

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
  
  const options = gameRef.data().options;

  switch (data.action) {
    case "ATTACH_TO_PLANET": {
      const attachString = `attachments.${data.attachment}.planets`;
      const orderString = `attachments.${data.attachment}.ordering.${data.planet}`;
      let updateVal = [data.planet];
      if (options['multiple-planet-attachments']) {
        updateVal = FieldValue.arrayUnion(data.planet);
      }
      const initialAttachments = await fetchAttachments(gameid);
      const planetAttachments = filterToPlanetAttachments(initialAttachments, data.planet);
      let maxAttachOrder = 0;
      for (const attachment of planetAttachments) {
        maxAttachOrder = Math.max(attachment.ordering[data.planet], maxAttachOrder);
      }
      await db.collection('games').doc(gameid).update({
        [attachString]: updateVal,
        [orderString]: maxAttachOrder + 1,
      });
      break;
    }
    case "REMOVE_FROM_PLANET": {
      const attachString = `attachments.${data.attachment}.planets`;
      const orderString = `attachments.${data.attachment}.ordering.${data.planet}`;
      await db.collection('games').doc(gameid).update({
        [attachString]: FieldValue.arrayRemove(data.planet),
        [orderString]: FieldValue.delete(),
      });
      break;
    }
  }


  const attachments = await fetchAttachments(gameid);

  res.status(200).json(attachments);
}