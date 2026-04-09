import { NextRequest, NextResponse } from "next/server";
import { getFirestoreAdmin } from "../../../src/util/server";
import { ProcessedGame } from "../../[locale]/stats/processor";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const latestTimestamp = searchParams.get("timestamp");

  const db = await getFirestoreAdmin();

  const processedGames: Record<string, ProcessedGame> = {};

  let processedRef = db
    .collection("processed")
    .orderBy("timestampMillis", "desc")
    .limit(50);

  if (latestTimestamp) {
    processedRef = processedRef.startAfter(parseInt(latestTimestamp));
  }

  const games = await processedRef.get();
  games.forEach((game) => {
    processedGames[game.id] = game.data() as ProcessedGame;
  });

  return NextResponse.json(processedGames);
}
