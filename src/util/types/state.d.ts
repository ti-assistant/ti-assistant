type Phase =
  | "UNKNOWN"
  | "SETUP"
  | "STRATEGY"
  | "ACTION"
  | "STATUS"
  | "AGENDA"
  | "EDICT"
  | "END";

interface UndoData {
  action: "UNDO";
}

interface GameState {
  activeplayer?: FactionId | "None";
  ancientBurialSites?: string;
  agendaNum?: number;
  agendaUnlocked?: boolean;
  finalPhase?: Phase;
  // Used when jumping around in turn order.
  lastActivePlayer?: FactionId;
  paused?: boolean;
  phase: Phase;
  round: number;
  speaker: FactionId;
  tyrant?: FactionId;
  votingStarted?: boolean;
}
