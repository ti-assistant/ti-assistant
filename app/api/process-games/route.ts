import { NextResponse } from "next/server";
import { rewriteProcessedGames } from "../../stats/processor";
import { headers } from "next/headers";

export async function GET() {
  const headerList = headers();
  const cron = headerList.get("X-Appengine-Cron");
  if (!cron) {
    throw new Error("Only cronjobs are allowed to call this endpoint.");
  }

  await rewriteProcessedGames();

  return NextResponse.json({});
}
