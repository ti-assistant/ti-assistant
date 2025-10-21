import { ToggleStructureHandler } from "../model/toggleSpaceDock";
import dataUpdate from "./dataUpdate";

export function toggleStructure(
  gameId: string,
  planetId: PlanetId,
  structure: "Space Dock" | "PDS",
  change: "Add" | "Remove"
) {
  const data: GameUpdateData = {
    action: "TOGGLE_STRUCTURE",
    event: {
      planetId,
      structure,
      change,
    },
  };

  return dataUpdate(gameId, data, ToggleStructureHandler);
}
