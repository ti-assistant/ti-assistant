import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { BASE_TECHS } from "../../../server/data/techs";
import { BaseTech, Tech } from "../../../src/util/api/techs";
import { GameData } from "../../../src/util/api/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }

  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  const gameData = gameRef.data() as GameData;

  const options = gameData.options;

  const techs: Record<string, Tech> = {};
  Object.entries(BASE_TECHS).forEach(([techId, tech]) => {
    // Maybe filter out PoK technologies.
    if (!options.expansions.includes("POK") && tech.expansion === "POK") {
      return;
    }
    const techCopy = { ...tech };

    // Maybe update techs for codices.
    if (tech.omega && options.expansions.includes(tech.omega.expansion)) {
      techCopy.name += " Ω";
      techCopy.description = tech.omega.description;
    }

    techs[techId] = techCopy;
  });

  res.status(200).json(techs);
}
