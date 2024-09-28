import { Storage } from "@google-cloud/storage";
import { createIntl, createIntlCache } from "react-intl";
import { getBaseData } from "../../src/data/baseData";
import { getLocale, getMessages } from "../../src/util/server";
import { maybeUpdateProcessedGames, ProcessedGame } from "./processor";
import StatsPage from "./stats-page";

async function getJSONFileFromStorage(
  storage: Storage
): Promise<Record<string, ProcessedGame>> {
  const [file] = await storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json")
    .download();

  return JSON.parse(file.toString("utf8"));
}

export default async function Page({}) {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const cache = createIntlCache();
  const intl = createIntl({ locale, messages }, cache);

  const storage = new Storage({
    keyFilename: "./server/twilight-imperium-360307-ea7cce25efeb.json",
  });

  const baseData = getBaseData(intl);
  const processedGames = await getJSONFileFromStorage(storage);

  maybeUpdateProcessedGames(storage, processedGames, baseData);

  return <StatsPage processedGames={processedGames} baseData={baseData} />;
}
