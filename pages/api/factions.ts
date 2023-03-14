import { NextApiRequest, NextApiResponse } from "next";
import { BASE_FACTIONS } from "../../server/data/factions";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(BASE_FACTIONS);
}
