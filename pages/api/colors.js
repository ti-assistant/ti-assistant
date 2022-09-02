const COLORS = [
  "Black",
  "Blue",
  "Green",
  "Orange",
  "Magenta",
  "Purple",
  "Red",
  "Yellow"
];

export default function handler(req, res) {
  res.status(200).json(COLORS);
}