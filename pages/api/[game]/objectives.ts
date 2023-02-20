import { fetchObjectives } from "../../../server/util/fetch";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }

  const secret = req.cookies.secret;

  const objectives = await fetchObjectives(gameId, secret ?? "");

  res.status(200).json(objectives);
}
