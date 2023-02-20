import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import { BaseFaction } from "../../src/util/api/factions";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const db = getFirestore();

  const factionsRef = await db.collection("factions").get();

  let factions: Record<string, BaseFaction> = {};
  factionsRef.forEach((val) => {
    factions[val.id] = val.data() as BaseFaction;
  });

  res.status(200).json(factions);
}
