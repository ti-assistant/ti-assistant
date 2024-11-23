import { NextResponse } from "next/server";
import { rewriteProcessedGames } from "../../stats/processor";

export async function GET(request: Request) {
  const cronHeader = request.headers.get("x-appengine-cron");
  if (!cronHeader) {
    return NextResponse.error();
  }

  rewriteProcessedGames();

  return;
}
