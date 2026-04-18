import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getFirestoreAdmin } from "../../../src/util/server";
import { Optional } from "../../../src/util/types/types";
import { objectEntries } from "../../../src/util/util";

export async function GET() {
  const headerList = await headers();
  const cron = headerList.get("X-Appengine-Cron");
  if (!cron) {
    throw new Error("Only cronjobs are allowed to call this endpoint.");
  }
  
  schemaUpdateV1toV2();

  return NextResponse.json({});
}

function schemaUpToDate(a: Optional<string>, b: string) {
  if (!a) {
    return false;
  }
  const [aMajor, aMinor, aOther] = a.split(".").map(parseInt);
  const [bMajor, bMinor, bOther] = b.split(".").map(parseInt);

  if (!aMajor || aMinor == undefined || aOther == undefined) {
    return false;
  }
  if (!bMajor || bMinor == undefined || bOther == undefined) {
    return false;
  }

  if (aMajor < bMajor) {
    return false;
  }
  if (aMajor > bMajor) {
    return true;
  }
  if (aMinor < bMinor) {
    return false;
  }
  if (aMinor > bMinor) {
    return true;
  }
  if (aOther < bOther) {
    return false;
  }
  return true;
}

async function schemaUpdateV1toV2() {
  const db = await getFirestoreAdmin();

  const archivedGames = await db.collection("archive").get();

  archivedGames.forEach((game) => {
    const gameId = game.id;
    console.log("Updating", gameId);
    const gameData = game.data() as StoredGameData;
    if (schemaUpToDate(gameData.schema, "2.0.0")) {
      console.log("Already up to date");
      return;
    }

    const players: Partial<Record<PlayerId, GamePlayer>> = {};
    for (const [id, faction] of objectEntries(gameData.factions)) {
      let factionId = id === "Obsidian" ? "Firmament" : id;
      players[factionId] = {
        factionId: id,
        id: factionId,
        mapPosition: faction.mapPosition,
      };
    }

    try {
      db.collection("archive").doc(gameId).update({
        players,
        schema: "2.0.0",
      });
    } catch (e) {
      console.log("Error", players);
      throw new Error();
    }
  });

  const liveGames = await db.collection("games").get();

  liveGames.forEach((game) => {
    const gameId = game.id;
    console.log("Updating", gameId);
    const gameData = game.data() as StoredGameData;
    if (schemaUpToDate(gameData.schema, "2.0.0")) {
      return;
    }

    const players: Partial<Record<PlayerId, GamePlayer>> = {};
    for (const faction of Object.values(gameData.factions)) {
      let factionId = faction.id === "Obsidian" ? "Firmament" : faction.id;
      players[factionId] = {
        factionId: faction.id,
        id: factionId,
        mapPosition: faction.mapPosition,
      };
    }

    db.collection("games").doc(gameId).update({
      players,
      schema: "2.0.0",
    });
  });
}
