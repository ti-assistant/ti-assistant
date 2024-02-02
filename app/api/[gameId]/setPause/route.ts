import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
  getGameData,
  getGameDataInTransaction,
} from "../../../../server/util/fetch";
import { NextResponse } from "next/server";

interface SetPauseData {
  paused: boolean;
}

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;

  const db = getFirestore();

  const gameRef = db.collection("games").doc(gameId);

  try {
    await db.runTransaction(async (t) => {
      // Ensure that game exists.
      await getGameDataInTransaction(gameRef, t);

      const data = (await req.json()) as SetPauseData;

      t.update(gameRef, {
        "state.paused": data.paused ?? FieldValue.delete(),
      });
    });
  } catch (e) {
    console.log("Transaction failed");
  }

  const gameData = await getGameData(gameId);

  return NextResponse.json(gameData);
}
