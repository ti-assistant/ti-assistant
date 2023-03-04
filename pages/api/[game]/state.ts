import { fetchPlanets } from "../../../server/util/fetch";
import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
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
    return;
  }

  const gameData = gameRef.data() as GameData;

  const state = gameData.state;

  if (!state.agendaUnlocked) {
    const planets = await fetchPlanets(gameId);
    const mecatolRex = planets["Mecatol Rex"];
    if (mecatolRex && mecatolRex.owner) {
      state.agendaUnlocked = true;
    }
  }

  res.status(200).json(state);
}
