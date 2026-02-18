import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { rewriteProcessedGames } from "../../[locale]/stats/processor";

export async function GET() {
  const headerList = await headers();
  const cron = headerList.get("X-Appengine-Cron");
  if (!cron) {
    throw new Error("Only cronjobs are allowed to call this endpoint.");
  }

  await rewriteProcessedGames();

  return NextResponse.json({});
}
