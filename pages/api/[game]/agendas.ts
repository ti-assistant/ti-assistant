import { NextApiRequest, NextApiResponse } from "next";
import { fetchAgendas } from "../../../server/util/fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }

  const agendas = await fetchAgendas(gameId);

  res.status(200).json(agendas);
}
