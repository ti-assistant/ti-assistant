import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { OptionUpdateData } from "../../../src/util/api/options";
import { GameData } from "../../../src/util/api/util";

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
  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  const data = req.body as OptionUpdateData;

  if (!data.timestamp || !data.value || !data.option) {
    res.status(422);
    return;
  }

  const timestampString = `updates.options.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "SET_OPTION": {
      const optionString = `options.${data.option}`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [optionString]: data.value,
          [timestampString]: timestamp,
        });
      break;
    }
  }
  const updatedRef = await db.collection("games").doc(gameId).get();

  const gameData = updatedRef.data() as GameData;

  res.status(200).json(gameData.options);
}
