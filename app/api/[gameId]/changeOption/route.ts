import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { canEditGame, getGameData } from "../../../../server/util/fetch";

interface ChangeOptionData {
  option: string;
  value: any;
}

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;
  const canEdit = await canEditGame(gameId);
  if (!canEdit) {
    return new Response("Not authorized", {
      status: 403,
    });
  }

  const db = getFirestore();

  const game = await db.collection("games").doc(gameId).get();

  if (!game.exists) {
    return new Response("Game not found", {
      status: 404,
    });
  }

  const data = (await req.json()) as ChangeOptionData;

  await db
    .collection("games")
    .doc(gameId)
    .update({
      [`options.${data.option}`]: data.value,
    });

  const gameData = await getGameData(gameId);

  return NextResponse.json(gameData);
}
