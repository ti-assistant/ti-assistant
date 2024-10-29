import "server-only";
import { Storage } from "@google-cloud/storage";
import ArchivePage from "./archive-page";
import { ProcessedGame } from "../stats/processor";

async function getJSONFileFromStorage(
  storage: Storage
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
  const processedGames = await getJSONFileFromStorage(storage);

  return <ArchivePage processedGames={processedGames} />;
}
