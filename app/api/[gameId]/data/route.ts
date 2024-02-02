import { NextResponse } from "next/server";
import { getGameData } from "../../../../server/util/fetch";

export async function GET(
  _: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;

  const storedGameData = await getGameData(gameId);

  return NextResponse.json(storedGameData);
}
