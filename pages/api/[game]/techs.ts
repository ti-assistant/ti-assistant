import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
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

  const techsRef = await db.collection("techs").orderBy("name").get();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  const gameData = gameRef.data() as GameData;

  const options = gameData.options;

  const techs: Record<string, Tech> = {};
  techsRef.forEach(async (val) => {
    const tech = val.data() as BaseTech;
    const techId = val.id;

    // Maybe filter out PoK technologies.
    if (!options.expansions.includes("pok") && tech.game === "pok") {
      return;
    }

    // Maybe update techs for codices.
    if (tech.omega && options.expansions.includes(tech.omega.expansion)) {
      tech.name += " Ω";
      tech.description = tech.omega.description;
    }

    techs[techId] = tech;
  });

  res.status(200).json(techs);
}
