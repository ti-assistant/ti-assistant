import { fetchAttachments } from "../../../server/util/fetch";

import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { filterToPlanetAttachments } from "../../../src/util/attachments";
import { NextApiRequest, NextApiResponse } from "next";
import { AttachmentUpdateData } from "../../../src/util/api/attachments";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }
  const data = req.body as AttachmentUpdateData;

  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  if (!data.timestamp || !data.action || !data.attachment || !data.planet) {
    res.status(422);
    return;
  }

  const timestampString = `updates.attachments.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "ATTACH_TO_PLANET": {
      const attachString = `attachments.${data.attachment}.planets`;
      const orderString = `attachments.${data.attachment}.ordering.${data.planet}`;
      let updateVal = [data.planet];
      const initialAttachments = await fetchAttachments(gameId);
      const planetAttachments = filterToPlanetAttachments(
        initialAttachments,
        data.planet
      );
      let maxAttachOrder = 0;
      for (const attachment of planetAttachments) {
        if (!attachment.ordering) {
          continue;
        }
        maxAttachOrder = Math.max(
          attachment.ordering[data.planet] ?? 0,
          maxAttachOrder
        );
      }
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [attachString]: updateVal,
          [orderString]: maxAttachOrder + 1,
          [timestampString]: timestamp,
        });
      break;
    }
    case "REMOVE_FROM_PLANET": {
      const attachString = `attachments.${data.attachment}.planets`;
      const orderString = `attachments.${data.attachment}.ordering.${data.planet}`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [attachString]: FieldValue.arrayRemove(data.planet),
          [orderString]: FieldValue.delete(),
          [timestampString]: timestamp,
        });
      break;
    }
  }

  const attachments = await fetchAttachments(gameId);

  res.status(200).json(attachments);
}
