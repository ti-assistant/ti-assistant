import { NextResponse } from "next/server";
import { rewriteProcessedGames } from "../../stats/processor";

export async function GET() {
  await rewriteProcessedGames();

  return NextResponse.json({});
}
