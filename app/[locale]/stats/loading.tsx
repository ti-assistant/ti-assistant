import { createIntl, createIntlCache } from "react-intl";
import { getBaseData } from "../../../src/data/baseData";
import { getLocale, getMessages } from "../../../src/util/server";
import { intlErrorFn } from "../../../src/util/util";
import StatsPage from "./stats-page";

export default async function Loading() {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl(
    { locale, messages, onError: intlErrorFn as any },
    cache,
  );

  const baseData = getBaseData(intl);

  return <StatsPage processedGames={{}} baseData={baseData} loading />;
}
