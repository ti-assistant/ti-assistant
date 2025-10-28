import { DataStore } from "../context/dataStore";
import { convertToFactionColor } from "./factions";

export function getFactionColor(factionId: FactionId) {
  const rawColor = DataStore.getValue<string>(`factions.${factionId}.color`);
  if (!rawColor) {
    return "var(--neutral-border)";
  }
  return convertToFactionColor(rawColor);
}
