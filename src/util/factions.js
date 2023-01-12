export function getFactionColor(faction) {
  if (!faction || !faction.color) {
    return "#555";
  }
  switch (faction.color) {
    case "Blue":
      return "cornflowerblue";
    case "Purple":
      return "mediumpurple";
    case "Magenta":
      return "hotpink";
    case "Yellow":
      return "gold";
    // TODO: Mess around with other colors.
  }
  return faction.color;
}

export function getFactionName(faction) {
  if (!faction) {
    return "Loading...";
  }
  if (faction.playerName) {
    return faction.playerName + " - " + faction.shortname;
  }
  return faction.name;
}