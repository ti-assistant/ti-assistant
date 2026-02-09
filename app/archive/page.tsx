import { Storage } from "@google-cloud/storage";
import { createIntl, createIntlCache } from "react-intl";
import "server-only";
import { getEvents } from "../../server/data/events";
import { getLocale, getMessages } from "../../src/util/server";
import { ProcessedGame } from "../stats/processor";
import ArchivePage from "./archive-page";
import { intlErrorFn } from "../../src/util/util";

async function getJSONFileFromStorage(
  storage: Storage,
): Promise<Record<string, ProcessedGame>> {
  const [file] = await storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json")
    .download();

  return JSON.parse(file.toString("utf8"));
}

export default async function Page() {
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

  const processedGames = await getJSONFileFromStorage(storage);

  const events = Object.values(getEvents(intl)).sort((a, b) =>
    a.name > b.name ? 1 : -1,
  );
  return <ArchivePage processedGames={processedGames} baseEvents={events} />;
}
