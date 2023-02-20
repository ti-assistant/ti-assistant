import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { GameData } from "../../../src/util/api/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }
  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  const gameData = gameRef.data() as GameData;

  const updates: Record<string, { timestamp: number }> = {};
  Object.entries(gameData.updates ?? {}).forEach(([name, val]) => {
    updates[name] = {
      timestamp: val.timestamp.toMillis(),
    };
  });

  res.status(200).json(updates);
}
