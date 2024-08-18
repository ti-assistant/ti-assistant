import { BASE_OPTIONS } from "./options";

export const BASE_GAME_DATA: StoredGameData = {
  factions: {},
  options: BASE_OPTIONS,
  planets: {},
  state: {
    phase: "SETUP",
    speaker: "Vuil'raith Cabal",
    round: 1,
  },
  sequenceNum: 1,
};
