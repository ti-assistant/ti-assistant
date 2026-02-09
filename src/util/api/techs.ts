import { Techs } from "../../context/techDataHooks";
import { Optional } from "../types/types";

/**
 * Checks whether a faction has unlocked a specific tech.
 */
export function hasTech(faction: Optional<Faction>, tech: Optional<Tech>) {
  if (!tech || !faction) {
    return false;
  }
  if (!faction.techs) {
    return false;
  }
  if (tech.state === "purged") {
    return false;
  }
  const factionTech = faction.techs[tech.id];
  return !!factionTech && factionTech.state !== "purged";
}

export function canExploreFrontierTokens(
  faction: Optional<Faction>,
  techs: Techs,
) {
  if (!faction) {
    return false;
  }
  if (hasTech(faction, techs["Dark Energy Tap"])) {
    return true;
  }
  const color: Exclude<FactionColor, "Magenta"> | "Pink" =
    faction.color === "Magenta" ? "Pink" : faction.color;
  const antimatterTechId: TechId = `Antimatter ${color}`;

  return hasTech(faction, techs[antimatterTechId]);
}

export function isTechPurged(faction: Faction, tech: Tech) {
  if (tech.state === "purged") {
    return true;
  }
  const factionTech = (faction.techs ?? {})[tech.id];
  if (!factionTech) {
    return false;
  }
  return factionTech.state === "purged";
}

export function isTechReplaced(factionId: FactionId, techId: TechId) {
  switch (factionId) {
    case "Federation of Sol":
      return techId === "Carrier II" || techId === "Infantry II";
    case "Arborec":
    case "Mahact Gene-Sorcerers":
      return techId === "Infantry II";
    case "Clan of Saar":
    case "Last Bastion":
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
    case "Crimson Rebellion":
    case "Ral Nel Consortium":
      return techId === "Destroyer II";
  }
  return false;
}

export function getReplacementTech(
  factionId: FactionId,
  techId: TechId,
): Optional<TechId> {
  switch (techId) {
    case "Carrier II":
      switch (factionId) {
        case "Federation of Sol":
          return "Advanced Carrier II";
      }
      break;
    case "Cruiser II":
      switch (factionId) {
        case "Titans of Ul":
          return "Saturn Engine II";
      }
      break;
    case "Destroyer II":
      switch (factionId) {
        case "Argent Flight":
          return "Strike Wing Alpha II";
        case "Crimson Rebellion":
          return "Exile II";
        case "Ral Nel Consortium":
          return "Linkship II";
      }
      break;
    case "Dreadnought II":
      switch (factionId) {
        case "L1Z1X Mindnet":
          return "Super-Dreadnought II";
        case "Sardakk N'orr":
          return "Exotrireme II";
      }
      break;
    case "Fighter II":
      switch (factionId) {
        case "Naalu Collective":
          return "Hybrid Crystal Fighter II";
      }
      break;
    case "Infantry II":
      switch (factionId) {
        case "Arborec":
          return "Letani Warrior II";
        case "Federation of Sol":
          return "Spec Ops II";
        case "Mahact Gene-Sorcerers":
          return "Crimson Legionnaire II";
      }
      break;
    case "PDS II":
      switch (factionId) {
        case "Titans of Ul":
          return "Hel Titan II";
      }
      break;
    case "Space Dock II":
      switch (factionId) {
        case "Clan of Saar":
          return "Floating Factory II";
        case "Last Bastion":
          return "4X4IC Helios V2";
        case "Vuil'raith Cabal":
          return "Dimensional Tear II";
      }
      break;
    case "War Sun":
      switch (factionId) {
        case "Embers of Muaat":
          return "Prototype War Sun II";
      }
      break;
  }
}
