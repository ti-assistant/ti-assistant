import { NextRequest, NextResponse } from "next/server";
import { getBaseData } from "../../../src/data/baseData";
import { getIntl } from "../../../src/util/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get("locale") ?? "en";

  const intl = await getIntl(locale);

  const baseData = getBaseData(intl);

  return NextResponse.json(baseData);
}
