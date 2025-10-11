import { NextApiRequest, NextApiResponse } from "next";
import { getTimers } from "../../../../server/util/fetch";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const storedTimers = await getTimers(gameId);

  return NextResponse.json(storedTimers);
}
