import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getGameData } from "../../../server/util/fetch";

interface ChangeOptionData {
  option: string;
  value: any;
}

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

  const game = await db.collection("games").doc(gameId).get();

  if (!game.exists) {
    res.status(404).send({ message: "Game not found" });
    return;
  }

  const data = req.body as ChangeOptionData;

  await db
    .collection("games")
    .doc(gameId)
    .update({
      [`options.${data.option}`]: data.value,
    });

  const gameData = await getGameData(gameId);

  res.status(200).json(gameData);
}
