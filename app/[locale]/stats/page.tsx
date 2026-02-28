import { Storage } from "@google-cloud/storage";
import { ProcessedGame } from "./processor";
import StatsPage from "./stats-page";

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
  const storage = new Storage({
    keyFilename: "./server/twilight-imperium-360307-ea7cce25efeb.json",
  });

  const processedGamesPromise = getJSONFileFromStorage(storage);

  const [processedGames] = await Promise.all([processedGamesPromise]);

  return <StatsPage processedGames={processedGames} />;
}
