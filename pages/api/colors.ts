import { NextApiRequest, NextApiResponse } from "next";

const COLORS = [
  "Black",
  "Blue",
  "Green",
  "Orange",
  "Magenta",
  "Purple",
  "Red",
  "Yellow",
];

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(COLORS);
}
