import { Storage } from "@google-cloud/storage";
import "server-only";
import { getEvents } from "../../../server/data/events";
import { getIntl } from "../../../src/util/server";
import { ProcessedGame } from "../stats/processor";
import ArchivePage from "./archive-page";

async function getJSONFileFromStorage(
  storage: Storage,
): Promise<Record<string, ProcessedGame>> {
  const [file] = await storage
    .bucket("ti-assistant-datastore")
    .file("processed-games.json")
    .download();

  return JSON.parse(file.toString("utf8"));
}

export default async function Page({ params }: PageProps<"/[locale]/archive">) {
  const locale = (await params).locale;
  const intlPromise = getIntl(locale);

  const storage = new Storage({
    keyFilename: "./server/twilight-imperium-360307-ea7cce25efeb.json",
  });

  const processedGamesPromise = getJSONFileFromStorage(storage);

  const [intl, processedGames] = await Promise.all([
    intlPromise,
    processedGamesPromise,
  ]);

  const events = Object.values(getEvents(intl)).sort((a, b) =>
    a.name > b.name ? 1 : -1,
  );
  return <ArchivePage processedGames={processedGames} baseEvents={events} />;
}
