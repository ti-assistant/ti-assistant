import { getFirestore } from "firebase-admin/firestore";
import "server-only";
import { getEvents } from "../../../server/data/events";
import { getFirestoreAdmin, getIntl } from "../../../src/util/server";
import { ProcessedGame } from "../stats/processor";
import ArchivePage from "./archive-page";

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps<"/[locale]/archive">) {
  const locale = (await params).locale;
  const intl = await getIntl(locale);

  const db = await getFirestoreAdmin();

  const processedGames: Record<string, ProcessedGame> = {};

  const processedRef = await db.collection("processed").get();
  processedRef.forEach((game) => {
    processedGames[game.id] = game.data() as ProcessedGame;
  });

  const events = Object.values(getEvents(intl)).sort((a, b) =>
    a.name > b.name ? 1 : -1,
  );
  return <ArchivePage processedGames={processedGames} baseEvents={events} />;
}
