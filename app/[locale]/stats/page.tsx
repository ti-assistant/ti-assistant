import { Storage } from "@google-cloud/storage";
import { createIntl, createIntlCache } from "react-intl";
import { ProcessedGame } from "./processor";
import StatsPage from "./stats-page";
import { getBaseData } from "../../../src/data/baseData";
import { getLocale, getMessages } from "../../../src/util/server";
import { intlErrorFn } from "../../../src/util/util";

async function getJSONFileFromStorage(
  storage: Storage,
): Promise<Record<string, ProcessedGame>> {
  const [file] = await storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json")
    .download();

  return JSON.parse(file.toString("utf8"));
}

export default async function Page({}) {
  const locale = await getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl(
    { locale, messages, onError: intlErrorFn as any },
    cache,
  );

  const storage = new Storage({
    keyFilename: "./server/twilight-imperium-360307-ea7cce25efeb.json",
  });

  const baseData = getBaseData(intl);
  const processedGames = await getJSONFileFromStorage(storage);

  return <StatsPage processedGames={processedGames} baseData={baseData} />;
}
