import { fetchAttachments } from "../../../server/util/fetch";
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

  const attachments = await fetchAttachments(gameId);

  res.status(200).json(attachments);
}
