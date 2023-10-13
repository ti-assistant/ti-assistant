type Phase =
  | "UNKNOWN"
  | "SETUP"
  | "STRATEGY"
  | "ACTION"
  | "STATUS"
  | "AGENDA"
  | "END";

type StateUpdateAction =
  | "ADVANCE_PHASE"
  | "START_NEXT_ROUND"
  | "JUMP_TO_PLAYER"
  | "ADVANCE_PLAYER"
  | "PREVIOUS_PLAYER"
  | "SET_SPEAKER"
  | "END_GAME"
  | "CONTINUE_GAME"
  | "SET_AGENDA_NUM"
  | "ANCIENT_BURIAL_SITES" // Probably a better way to do this...
  | "SET_GLOBAL_PAUSE";

type GameAction = "ASSIGN_STRATEGY_CARD" | "SET_SPEAKER";

interface UndoData {
  action: "UNDO";
}

interface GameState {
  activeplayer?: FactionId | "None";
  ancientBurialSites?: string;
  agendaNum?: number;
  agendaUnlocked?: boolean;
  finalPhase?: Phase;
  paused?: boolean;
  phase: Phase;
  round: number;
  speaker: FactionId;
}
