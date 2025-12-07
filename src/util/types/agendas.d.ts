type OutcomeType =
  | "For/Against"
  | "Planet"
  | "Cultural Planet"
  | "Hazardous Planet"
  | "Industrial Planet"
  | "Player"
  | "Strategy Card"
  | "Law"
  | "Scored Secret Objective"
  | "Non-Home Planet Other Than Mecatol Rex"
  | "???";

type AgendaType = "LAW" | "DIRECTIVE";

type AgendaUpdateAction = "RESOLVE_AGENDA" | "REPEAL_AGENDA";

interface AgendaUpdateData {
  action?: AgendaUpdateAction;
  agenda?: string;
  target?: string;
  timestamp?: number;
}

interface BaseAgenda {
  description: string;
  elect: OutcomeType;
  expansion: Expansion;
  removedIn?: Expansion;
  id: AgendaId;
  name: string;
  omegas?: Omega<BaseAgenda>[];
  passedText?: string;
  failedText?: string;
  type: AgendaType;
}

interface GameAgenda {
  activeRound?: number;
  // Used to undo New Constitution.
  affected?: string[];
  name?: string;
  passed?: boolean;
  resolved?: boolean;
  target?: string;
}

type Agenda = BaseAgenda & GameAgenda;

type AgendaId = BaseGame.AgendaId | ProphecyOfKings.AgendaId;
