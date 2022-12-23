export function getFactionColor(faction) {
  if (!faction || !faction.color) {
    return "#555";
  }
  switch (faction.color) {
    case "Blue":
      return "cornflowerblue";
    // TODO: Mess around with other colors.
  }
  return faction.color;
}