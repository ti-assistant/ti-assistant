import { NextResponse } from "next/server";
import { getGameData } from "../../../../server/util/fetch";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const storedGameData = await getGameData(gameId);

  return NextResponse.json(storedGameData);
}
