import { Faction } from "./api/factions";

export function getFactionColor(faction: Faction | undefined) {
  if (!faction) {
    return "#555";
  }
  return convertToFactionColor(faction.color);
}

export function convertToFactionColor(color: string | undefined) {
  if (!color) {
    return "#555";
  }
  switch (color) {
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
  return color;
}

export function getFactionName(faction: Faction | undefined) {
  if (!faction) {
    return "Loading...";
  }
  if (faction.playerName) {
    return faction.playerName + " - " + faction.shortname;
  }
  return faction.name;
}

export function getFactionShortName(faction: Faction | undefined) {
  if (!faction) {
    return null;
  }
  if (faction.playerName) {
    return faction.playerName;
  }
  return faction.shortname;
}
