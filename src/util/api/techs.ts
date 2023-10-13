/**
 * Checks whether a faction has unlocked a specific tech.
 */
export function hasTech(faction: Faction, techId: TechId) {
  if (!faction.techs) {
    return false;
  }
  return !!faction.techs[techId];
}

export function isTechReplaced(factionId: FactionId, techId: TechId) {
  switch (factionId) {
    case "Federation of Sol":
      return techId === "Carrier II" || techId === "Infantry II";
    case "Arborec":
    case "Mahact Gene-Sorcerers":
      return techId === "Infantry II";
    case "Clan of Saar":
    case "Vuil'raith Cabal":
      return techId === "Space Dock II";
    case "L1Z1X Mindnet":
    case "Sardakk N'orr":
      return techId === "Dreadnought II";
    case "Titans of Ul":
      return techId === "Cruiser II" || techId === "PDS II";
    case "Naalu Collective":
      return techId === "Fighter II";
    case "Embers of Muaat":
      return techId === "War Sun";
    case "Argent Flight":
      return techId === "Destroyer II";
  }
  return false;
}
