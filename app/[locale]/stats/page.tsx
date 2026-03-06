import { getFirestore } from "firebase-admin/firestore";
import { ProcessedGame } from "./processor";
import StatsPage from "./stats-page";

export default async function Page() {
  const db = getFirestore();

  const processedGames: Record<string, ProcessedGame> = {};

  const processedRef = await db.collection("processed").get();
  processedRef.forEach((game) => {
    processedGames[game.id] = game.data() as ProcessedGame;
  });

  return <StatsPage processedGames={processedGames} />;
}
