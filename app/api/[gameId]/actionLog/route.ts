import { NextResponse } from "next/server";
import { getFullActionLog } from "../../../../server/util/fetch";

export async function GET(
  _: Request,
  { params }: { params: { gameId: string } }
) {
  const gameId = params.gameId;

  const actionLog = await getFullActionLog(gameId);

  return NextResponse.json(actionLog);
}
