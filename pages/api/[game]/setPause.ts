import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { SetPauseData } from "../../../src/util/api/setPause";
import {
  getGameData,
  getGameDataInTransaction,
} from "../../../server/util/fetch";

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

  const gameRef = db.collection("games").doc(gameId);

  try {
    await db.runTransaction(async (t) => {
      // Ensure that game exists.
      await getGameDataInTransaction(gameRef, t);

      const data = req.body as SetPauseData;

      t.update(gameRef, {
        "state.paused": data.paused ?? FieldValue.delete(),
      });
    });
  } catch (e) {
    console.log("Transaction failed");
  }

  const gameData = await getGameData(gameId);

  res.status(200).json(gameData);
}
