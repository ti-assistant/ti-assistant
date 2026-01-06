import { Optional } from "../util/types/types";
import { useGameDataValue } from "./dataHooks";

export function useGameState() {
  return useGameDataValue<GameState>("state", {
    phase: "UNKNOWN",
    round: 1,
    speaker: "Vuil'raith Cabal",
  });
}

export function useAgendaUnlocked() {
  return useGameDataValue<boolean>("state.agendaUnlocked", false);
}

export function useFinalPhase() {
  return useGameDataValue<Phase>("state.finalPhase", "STATUS");
}

export function useRound() {
  return useGameDataValue<number>("state.round", 1);
}

export function usePhase() {
  return useGameDataValue<Phase>("state.phase", "UNKNOWN");
}

export function useSpeaker() {
  return useGameDataValue<FactionId>("state.speaker", "Vuil'raith Cabal");
}

export function useTyrant() {
  return useGameDataValue<Optional<FactionId>>("state.tyrant", undefined);
}
