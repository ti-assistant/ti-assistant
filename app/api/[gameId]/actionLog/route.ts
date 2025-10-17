import { NextResponse } from "next/server";
import { getFullActionLog } from "../../../../server/util/fetch";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const actionLog = await getFullActionLog(gameId);

  return NextResponse.json(actionLog);
}
