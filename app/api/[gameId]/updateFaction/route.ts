import { getFirestore } from "firebase-admin/firestore";
import {
  canEditGame,
  getGameDataInTransaction,
} from "../../../../server/util/fetch";
import { Optional } from "../../../../src/util/types/types";
import { NextResponse } from "next/server";

interface UpdateFactionData {
  factionId: FactionId;
  playerName?: string;
  color?: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const canEdit = await canEditGame(gameId);
  if (!canEdit) {
    return new Response("Not authorized", {
      status: 403,
    });
  }

  const db = getFirestore();

  const gameRef = db.collection("games").doc(gameId);

  const data = (await req.json()) as UpdateFactionData;

  // If only changing player name, no need to use a transaction.
  if (data.playerName) {
    await db
      .collection("games")
      .doc(gameId)
      .update({ [`factions.${data.factionId}.playerName`]: data.playerName });
    return NextResponse.json({});
  }

  await db.runTransaction(async (t) => {
    const gameData = await getGameDataInTransaction(gameRef, t);

    const factionColor = gameData.factions[data.factionId]?.color;
    if (!factionColor) {
      throw new Error("Invalid factionId");
    }

    // Faction is already correct, no change required.
    if (factionColor === data.color) {
      return false;
    }

    const updates = {
      [`factions.${data.factionId}.color`]: data.color,
    };

    // Check if another faction has this color.
    let factionToSwap: Optional<FactionId>;
    for (const faction of Object.values(gameData.factions)) {
      if (faction.color === data.color) {
        factionToSwap = faction.id;
        break;
      }
    }

    if (factionToSwap) {
      updates[`factions.${factionToSwap}.color`] = factionColor;
    }

    t.update(gameRef, updates);

    return false;
  });

  return NextResponse.json({});
}
