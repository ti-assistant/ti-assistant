import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getBaseData } from "../../../src/data/baseData";
import { getIntl } from "../../../src/util/server";
import { processGames } from "../../[locale]/stats/processor";

export async function GET() {
  const headerList = await headers();
  const cron = headerList.get("X-Appengine-Cron");
  if (!cron) {
    throw new Error("Only cronjobs are allowed to call this endpoint.");
  }

  const locale = "en";
  const intl = await getIntl(locale);
  const baseData = getBaseData(intl);

  await processGames(baseData);

  return NextResponse.json({});
}
